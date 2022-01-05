<script>
  import { onMount } from "svelte";
  import { fly, slide, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { appStore, players, match } from "./../stores.js";
  import Loader from "./Loader.svelte";
  import MatchInfo from "./MatchInfo.svelte";
  import Player from "./Player.svelte";

  onMount(() => {
    window.electron.on("refresh", () => {
      refreshData();
    });
  });

  const getMatchData = async (profileId) => {
    // get match data
    const currentMatch = await fetch(
      `https://aoeiv.net/api/player/matches?game=aoe4&profile_id=${profileId}&count=1`
    );
    console.log(currentMatch);

    if (!currentMatch.ok) {
      throw Error(currentMatch.statusText);
    }
    const currentMatchData = await currentMatch.json();
    const matchData = currentMatchData[0];

    $match = {
      id: matchData.match_id,
      map: $appStore.maps[matchData.map_type],
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

    $players.push({
      name,
      rank,
      elo,
      games,
      wins,
      losses,
      winRate,
    });
  };

  const getData = async () => {
    await getMatchData($appStore.settings.playerId);
    // get player0 data
    await getPlayerData($match.player0.id);
    $players[0].civ = $match.player0.civ;
    // get player1 data
    await getPlayerData($match.player1.id);
    $players[1].civ = $match.player1.civ;
  };

  const refreshData = async () => {
    // toggle on loader
    $appStore.isLoading = true;

    // try to get new data for some amount of time
    const oldData = { ...$match };
    const maxTime = 60; //sec
    const interval = 5; //sec
    let counter = 0;

    const intervalId = setInterval(async () => {
      await getMatchData($appStore.settings.playerId);

      // if its old data
      if ($match.id === oldData.id) {
        // if maxTime is over
        if (counter >= maxTime / interval) {
          // toggle off loader
          $appStore.isLoading = false;
          // reset counter
          counter = 0;
          // stop searching for data
          clearInterval(intervalId);
        }

        // else increase counter
        counter++;
        // and try again
        return;
      }

      // if its new data
      // get player0 data
      await getPlayerData($match.player0.id);
      $players[0].civ = $match.player0.civ;
      // get player1 data
      await getPlayerData($match.player1.id);
      $players[1].civ = $match.player1.civ;

      // toggle off loader
      $appStore.isLoading = false;
      // reset counter
      counter = 0;
      // stop searching for data
      clearInterval(intervalId);
    }, 1000 * interval);
  };
</script>

<main class="overlay">
  {#await getData()}
    <Loader />
  {:then}
    {#if $appStore.isOverlayVisible}
      {#if $appStore.isLoading}
        <Loader />
      {/if}
      <div
        class="player0"
        in:fly|local={{
          duration: 2000,
          x: -300,
          y: 0,
          opacity: 1.0,
          easing: quintOut,
        }}
      >
        <Player index={0} />
      </div>
      <div class="matchInfo" in:fade|local={{ duration: 3000 }}>
        <MatchInfo />
      </div>
      <div
        class="player1"
        in:fly|local={{
          duration: 2000,
          x: 300,
          y: 0,
          opacity: 1.0,
          easing: quintOut,
        }}
      >
        <Player index={1} />
      </div>
    {/if}
  {:catch error}
    <p class="error">{error.message}</p>
    <Loader error={true} />
  {/await}
</main>

<style>
  .overlay {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    background-color: #0c0c0c7e;
    min-width: 1030px;
    min-height: 80px;
    /* background-blend-mode: multiply;
  background-image: url(static/bg/textile.png),
    linear-gradient(#394766, #181c29a1); */
    opacity: 0.8;
  }

  .player0 {
    background-image: var(--player0BG);
    grid-template-columns: 1fr 3fr;
  }

  .player1 {
    background-image: var(--player1BG);
    grid-template-columns: 3fr 1fr;
  }

  .matchInfo {
    align-self: center;
    justify-self: center;
  }

  .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
