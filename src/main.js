const puppeteer = require("puppeteer");
const { extractPlayerOverview, extractPlayerStats } = require("./player");
const {
  setGlobalContext,
  setOverviewContext,
  setStatsContext
} = require("./context");
const { delay } = require("./utils");
const fs = require("fs");

const mainURL = "https://www.premierleague.com";
const players = "/players/";
const stats = "stats";
const filter = "?co=1&se=";

async function startScrapper() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("https://www.premierleague.com/tables", {
    waitUntil: "load"
  });
  await delay(1000);
  const seasons = await page.evaluate(() => {
    const seasonsNodes = document.querySelectorAll(
      '[data-dropdown-list="compSeasons"] li'
    );
    return Array.from(seasonsNodes).map(x => {
      return {
        season: x.getAttribute("data-option-name"),
        id: x.getAttribute("data-option-id")
      };
    });
  });

  console.log(seasons);

  const playersData = await fetchAllTeamPlayersData(page, seasons.slice(0, 3));
  browser.close();
  const json = JSON.stringify(playersData);
  fs.writeFile("../output/liverpoolPlayers.json", json, "utf8", err => {
    if (err) throw err;
    console.log("Saved!");
  });
  return playersData;
}

async function fetchAllTeamPlayersData(page, seasons) {
  await page.goto("https://www.premierleague.com/clubs/10/Liverpool/squad", {
    waitUntil: "load"
  });
  let playersProfiles = await page.evaluate(() => {
    const playersNodes = document.querySelectorAll(
      "ul.squadListContainer.squadList.block-list-4.block-list-3-m.block-list-2-s.block-list-padding li a"
    );
    const playersNodesArray = Array.from(playersNodes);
    const playersProfiles = playersNodesArray.map(x => x.getAttribute("href"));
    console.log(playersProfiles);
    return playersProfiles;
  });

  playersProfiles = playersProfiles.slice(10, 12);

  const playersData = [];
  for (let i = 0; i < playersProfiles.length; i++) {
    const playerProfile = mainURL + playersProfiles[i];
    await page.goto(playerProfile, {
      waitUntil: "load"
    });
    const data = await fetchPlayerData(
      page,
      playerProfile.replace("overview", ""),
      seasons
    );
    playersData.push(data);
  }

  return playersData;
}

async function fetchPlayerData(page, url, seasons) {
  try {
    await page.evaluate(setGlobalContext);
    await page.evaluate(setOverviewContext);
    const overview = await page.evaluate(extractPlayerOverview);

    const statsPerSeason = [];
    for (let i = 0; i < seasons.length; i++) {
      await page.goto(url + stats + filter + seasons[i].id, {
        waitUntil: "domcontentloaded"
      });
      console.log("Players Filtered Stats URLs");
      console.log(url + stats + filter + seasons[i].id);
      await delay(2000);
      await page.evaluate(setGlobalContext);
      await page.evaluate(setStatsContext);
      const seasonStats = await page.evaluate(extractPlayerStats);
      statsPerSeason.push(seasonStats);
    }

    return { overview, statsPerSeason };
  } catch (error) {
    console.error(error);
  }
}

startScrapper().then(_ => console.log("Success!"));
