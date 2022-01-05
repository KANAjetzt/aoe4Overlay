import { writable, derived } from "svelte/store";

export const appStore = writable({
  settings: {
    playerId: 7257105,
    hotkeys: {
      refresh: "Alt+CommandOrControl+R",
      hide: "Alt+CommandOrControl+H",
    },
  },
  isOverlayVisible: false,
  isLoading: false,
  flags: [
    "./static/flag/flag0.png",
    "./static/flag/flag1.png",
    "./static/flag/flag2.png",
    "./static/flag/flag3.png",
    "./static/flag/flag4.png",
    "./static/flag/flag5.png",
    "./static/flag/flag6.png",
    "./static/flag/flag7.png",
    "./static/flag/flag8.png",
  ],
  maps: [
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
  ],
});

export const players = writable([]);

// export const players = writable([
//   {
//     name: "ZipfelKuh",
//     rank: 32148,
//     elo: 945,
//     games: 37,
//     wins: 17,
//     losses: 20,
//     winRate: 46,
//     civ: 7,
//   },
//   {
//     name: "ZipfelKuh",
//     rank: 32148,
//     elo: 945,
//     games: 37,
//     wins: 17,
//     losses: 20,
//     winRate: 46,
//     civ: 6,
//   },
// ]);

export const match = writable({});

// export const match = writable({
//   map: "Hintertupfingen",
//   server: "uk west",
// });
