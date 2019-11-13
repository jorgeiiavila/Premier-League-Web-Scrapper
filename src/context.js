module.exports.setGlobalContext = () => {
  window.cleanSpanHTMLFromText = text => {
    const spanPosition = text.search("<span");
    if (spanPosition !== -1) return text.substring(0, spanPosition).trim();
    return text.trim();
  };
};

module.exports.setStatsContext = () => {
  window.classifyStatsData = (
    season,
    topStatsNames,
    topStatsValues,
    statsNames,
    statsValues
  ) => {
    const [attack, teamPlay, discipline, defense] = statsNames.map(x =>
      x.shift()
    );
    const [
      attackStats,
      teamPlayStats,
      disciplineStats,
      defenseStats
    ] = statsNames.map(x => x);
    const [
      attackValues,
      teamPlayValues,
      disciplineValues,
      defenseValues
    ] = statsValues.map(x => x);

    const topStatsObj = {};
    const attackObj = {};
    const teamPlayObj = {};
    const disciplineObj = {};
    const defenseObj = {};

    topStatsNames.forEach((stat, index) => {
      topStatsObj[stat] = topStatsValues[index];
    });

    attackStats.forEach((stat, index) => {
      attackObj[stat] = attackValues[index];
    });

    teamPlayStats.forEach((stat, index) => {
      teamPlayObj[stat] = teamPlayValues[index];
    });

    disciplineStats.forEach((stat, index) => {
      disciplineObj[stat] = disciplineValues[index];
    });

    defenseStats.forEach((stat, index) => {
      defenseObj[stat] = defenseValues[index];
    });

    return {
      season,
      data: {
        topStats: topStatsObj,
        [attack]: attackObj,
        [teamPlay]: teamPlayObj,
        [discipline]: disciplineObj,
        [defense]: defenseObj
      }
    };
  };
};

module.exports.setOverviewContext = () => {
  window.extractPersonalDetails = () => {
    const personalDetailsSection = document.querySelector(
      "section.personalDetails"
    );
    const name = document
      .querySelector("div.playerDetails h1 div.name.t-colour")
      .innerText.trim();
    const numberElement = document.querySelector(
      "div.playerDetails div.number.t-colour"
    );
    const number = numberElement ? numberElement.innerText.trim() : "";
    const nationality = personalDetailsSection.querySelector(
      "ul.pdcol1 span.playerCountry"
    ).innerText;
    const dateOfBirth = cleanSpanHTMLFromText(
      personalDetailsSection.querySelector("ul.pdcol2 div.info").innerHTML
    );
    const height = personalDetailsSection.querySelector("ul.pdcol3 div.info")
      .innerHTML;

    const club = document.querySelector(
      "div.playerOverviewAside.u-hide-mob section div.info a"
    ).innerText;

    const position = document
      .querySelectorAll("div.playerOverviewAside.u-hide-mob section div.info")
      .item(1).innerText;

    return { name, number, nationality, dateOfBirth, height, club, position };
  };

  window.extractPremierLeaguePlayingCareer = () => {
    const premierLeaguePlayingCareerSection = document.querySelector(
      "div.table.playerClubHistory.true"
    );

    const careerTableBody = premierLeaguePlayingCareerSection.querySelector(
      "table tbody"
    );

    const playerCareerNodes = careerTableBody.querySelectorAll("tr.table");
    const playerCareerNodesArray = Array.from(playerCareerNodes);

    const playerCareer = playerCareerNodesArray.map(seasonNode => {
      const season = seasonNode.querySelector("td.season p").innerText;
      const team = seasonNode.querySelector("td.team span").innerText;
      const startingApps = cleanSpanHTMLFromText(
        seasonNode.querySelector("td.appearances").innerHTML
      );
      const subsApps = seasonNode
        .querySelector("td.appearances span.appearances--sub")
        .innerText.replace(/\D/g, "");
      const goals = seasonNode.querySelector("td.goals").innerText;

      return { season, team, startingApps, subsApps, goals };
    });

    return playerCareer;
  };
};
