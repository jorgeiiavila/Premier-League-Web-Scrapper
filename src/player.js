module.exports.extractPlayerOverview = () => {
  const personalDetails = extractPersonalDetails();
  const premierLeagueCareer = extractPremierLeaguePlayingCareer();

  return { personalDetails, premierLeagueCareer };
};

module.exports.extractPlayerStats = () => {
  const season = document.querySelector("div.dropDown.mobile div.current")
    .innerText;
  const topStatsElements = document.querySelectorAll(
    "div.topStat span.allStatContainer"
  );
  const topStatsNames = ["Appearances", "Goals", "Wins", "Loses"];
  const topStatsValues = Array.from(topStatsElements).map(x =>
    x.innerHTML.trim()
  );
  const statsSectionsElements = document.querySelectorAll(
    "ul.normalStatList div.statsListBlock"
  );
  const statsSections = Array.from(statsSectionsElements);

  const statsNamesNodes = statsSections.map(x =>
    Array.from(x.querySelectorAll("span.stat"))
  );
  const statsValuesNodes = statsSections.map(x =>
    Array.from(x.querySelectorAll("span.allStatContainer"))
  );

  const statsNames = statsNamesNodes.map(sectionStats =>
    sectionStats.map(statName => cleanSpanHTMLFromText(statName.innerHTML))
  );
  const statsValues = statsValuesNodes.map(sectionStatValues =>
    sectionStatValues.map(statValue => statValue.innerHTML.trim())
  );

  const data = classifyStatsData(
    season,
    topStatsNames,
    topStatsValues,
    statsNames,
    statsValues
  );
  return data;
};
