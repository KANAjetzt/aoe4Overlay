const profileId = 7257105;

const flags = [
  "./static/flag/flag0.png",
  "./static/flag/flag1.png",
  "./static/flag/flag2.png",
  "./static/flag/flag3.png",
  "./static/flag/flag4.png",
  "./static/flag/flag5.png",
  "./static/flag/flag6.png",
  "./static/flag/flag7.png",
  "./static/flag/flag8.png",
];
const maps = [
  "Dry Arabia",
  "Lipany",
  "High View",
  "Mountain Pass",
  "Ancient Spires",
  "Danube River",
  "Black Forest",
  "Mongolian Heights",
  "Altai",
  "Confluence",
  "French Pass",
  "Hill and Dale",
  "King of Hill",
  "Warring Islands",
  "Archipelago",
  "Nagari",
  "Boulder Bay",
];

const getMatchData = async (profileId) => {
  // get match data
  const currentMatch = await fetch(
    `https://aoeiv.net/api/player/matches?game=aoe4&profile_id=${profileId}&count=1`
  );
  const currentMatchData = await currentMatch.json();
  const matchData = currentMatchData[0];

  return {
    map: maps[matchData.map_type],
    server: matchData.server,
    player0: {
      id: matchData.players[0].profile_id,
      civ: matchData.players[0].civ,
    },
    player1: {
      id: matchData.players[1].profile_id,
      civ: matchData.players[1].civ,
    },
  };
};

const getPlayerData = async (profileId) => {
  // get player data
  const playerDataRes = await fetch(
    `https://aoeiv.net/api/leaderboard?game=aoe4&leaderboard_id=17&start=1&count=1&profile_id=${profileId}`
  );
  const playerData = await playerDataRes.json();
  const player = playerData.leaderboard[0];

  const { name, rank, rating: elo, games, wins, losses } = player;

  // win rate
  const winRate = Math.round((100 * wins) / games);

  return {
    name,
    rank,
    elo,
    games,
    wins,
    losses,
    winRate,
  };
};

const updatePlayerUI = (selector, player) => {
  const playerDOM = document.querySelector(selector);

  playerDOM.innerHTML = `
    <div class="flag">
      <img src="${flags[player.civ]}" alt="civFlagPlayer0">
    </div>
    <h2 class="playerName">${player.name}</h2>
    <div class="stats">
      <ul>
        <li>#${player.rank}</li>
        <li>${player.elo}</li>
        <li>${player.winRate} %</li>
        <li>${player.wins} W</li>
        <li>${player.losses} L</li>
      </ul>
    </div> 
  `;

  if (selector === ".player0") {
    // bg
    document.documentElement.style.setProperty(
      "--player0BG",
      `url(static/bg/bg${player.civ}.png)`
    );

    // animate in
    playerDOM.classList.add("fadeInLeft");
  } else {
    // bg
    document.documentElement.style.setProperty(
      "--player1BG",
      `url(static/bg/bg${player.civ}.png)`
    );

    // animate in
    playerDOM.classList.add("fadeInRight");
  }
};

const updateMatchUI = (selector, data) => {
  const matchDOM = document.querySelector(selector);

  matchDOM.innerHTML = `
    <p>${data.map}</p>
    <p>${data.server}</p>
  `;

  // animate in
  matchDOM.classList.add("fadeInTop");
};

const clearLoader = () => {
  return new Promise((resolve, reject) => {
    // animate out loader
    document.querySelector(".loaderV2").classList.add("loaderV2Exit");

    setTimeout(() => {
      resolve();
    }, 1000 * 1);
  });
};

(async () => {
  const match = await getMatchData(profileId);

  // get player0 data
  const player0 = await getPlayerData(match.player0.id);
  player0.civ = match.player0.civ;
  console.log(player0);

  // get player1 data
  const player1 = await getPlayerData(match.player1.id);
  player1.civ = match.player1.civ;
  console.log(player1);

  // Clear loader
  await clearLoader();

  // Update player UI
  updatePlayerUI(".player0", player0);
  updatePlayerUI(".player1", player1);

  // Update match UI
  updateMatchUI(".matchInfo", match);
})();
