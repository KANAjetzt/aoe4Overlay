<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { appStore, players, match } from "./../stores.js";
  import Loader from "./Loader.svelte";
  import MatchInfo from "./MatchInfo.svelte";
  import Player from "./Player.svelte";

  onMount(() => {
    getData();

    window.electron.on("refresh", () => {
      refreshData();
    });
  });

  const getMatchData = async (profileId, intervalId, previousMatchId) => {
    // get match data
    const currentMatch = await fetch(
      `https://aoeiv.net/api/player/matches?game=aoe4&profile_id=${profileId}&count=1`
    );

    // If request fails
    if (!currentMatch.ok) {
      // Toggle error loader state
      $appStore.isLoadingError = true;
      $appStore.isError = true;
      $appStore.errorMessage = currentMatch.statusText;

      if (intervalId) {
        // stop interval
        clearInterval(intervalId);
      }

      $match = {};

      throw Error(currentMatch.statusText);
    }
    const currentMatchData = await currentMatch.json();
    const matchData = currentMatchData[0];

    // Save Match data in store
    $match = {
      id: matchData.match_id,
      map: $appStore.maps[matchData.map_type],
      server: matchData.server,
      player0: {
        id: matchData.players[0].profile_id,
        name: matchData.players[0].name,
        civ: matchData.players[0].civ,
      },
      player1: {
        id: matchData.players[1].profile_id,
        name: matchData.players[1].name,
        civ: matchData.players[1].civ,
      },
    };

    // if it's not 1v1 and new Data
    if (matchData.num_players > 2 && matchData.match_id !== previousMatchId) {
      // Toggle error loader state
      $appStore.isLoadingError = true;
      $appStore.isError = true;
      $appStore.errorMessage = "sorry currently only 1v1 is supported";

      // stop interval
      clearInterval(intervalId);

      throw Error("sorry currently only 1v1 is supported");
    }
  };

  // TODO: Use index of player insted of profileId and name
  const getPlayerData = async (profileId, name) => {
    // get player data
    const playerDataRes = await fetch(
      `https://aoeiv.net/api/leaderboard?game=aoe4&leaderboard_id=17&start=1&count=1&profile_id=${profileId}`
    );

    // If request fails
    if (!playerDataRes.ok) {
      // Toggle error state
      $appStore.isLoadingError = true;
      $appStore.isError = true;
      $appStore.errorMessage = playerDataRes.statusText;

      throw Error(playerDataRes.statusText);
    }

    const playerData = await playerDataRes.json();
    const player = playerData.leaderboard[0];

    // If the player has no leaderboard data
    if (!player) {
      // Toggle error state
      $appStore.isLoadingError = true;
      $appStore.isError = true;
      $appStore.errorMessage = `no leaderboard Data for ${name}`;

      throw Error(`no leaderboard Data for ${name}`);
    }

    const { rank, rating: elo, games, wins, losses, streak } = player;

    // win rate
    const winRate = Math.round((100 * wins) / games);

    // Save player data in store
    $players.push({
      name: player.name,
      rank,
      elo,
      games,
      wins,
      losses,
      winRate,
      streak,
    });
  };

  const getData = async () => {
    // Reset error state
    $appStore.isLoadingError = false;
    $appStore.isError = false;
    $appStore.errorMessage = "";

    // toggle on loader
    $appStore.isLoading = true;

    // clear match store
    $match = {};

    // clear players store
    $players = [];

    await getMatchData($appStore.settings.playerId);
    // get player0 data
    await getPlayerData($match.player0.id, $match.player0.name);
    $players[0].civ = $match.player0.civ;
    // get player1 data
    await getPlayerData($match.player1.id, $match.player1.name);
    $players[1].civ = $match.player1.civ;

    // toggle off loader
    $appStore.isLoading = false;
  };

  const refreshData = async () => {
    // Reset error state
    $appStore.isLoadingError = false;
    $appStore.isError = false;
    $appStore.errorMessage = "";

    // toggle on loader
    $appStore.isLoading = true;

    // try to get new data for some amount of time
    const oldData = { ...$match };
    const maxTime = 60; //sec
    const interval = 5; //sec
    let counter = 0;

    const intervalId = setInterval(async () => {
      await getMatchData($appStore.settings.playerId, intervalId, oldData.id);

      // if its old data
      if ($match.id === oldData.id) {
        // if maxTime is over
        if (counter >= maxTime / interval - 1) {
          // Toggle error loader state
          $appStore.isLoadingError = true;
          setTimeout(() => {
            // toggle off loader
            $appStore.isLoading = false;
            // reset error state
            $appStore.isLoadingError = false;
            // stop searching for data
            clearInterval(intervalId);
          }, 700);
        }

        // else increase counter and try again
        counter++;
      } else {
        // if its new data
        // get new data
        // TODO: pass match data to getData - we allready have the new matchData here.
        getData();

        // stop searching for data
        clearInterval(intervalId);
      }
    }, 1000 * interval);
  };
</script>

<main class="overlay">
  {#if $appStore.isError}
    <div class="error">
      <p>{$appStore.errorMessage}</p>
    </div>
  {/if}
  {#if $appStore.isLoading}
    <Loader />
  {:else if $appStore.isLoadingOutroEnd}
    <div
      class="player0"
      transition:fly|local={{
        duration: 2000,
        x: -600,
        y: 0,
        opacity: 1.0,
        easing: quintOut,
      }}
    >
      <Player index={0} />
    </div>
    <div
      class="matchInfo"
      in:fade|local={{ duration: 3000 }}
      out:fade|local={{ duration: 300 }}
    >
      <MatchInfo />
    </div>
    <div
      class="player1"
      transition:fly|local={{
        duration: 2000,
        x: 600,
        y: 0,
        opacity: 1.0,
        easing: quintOut,
      }}
    >
      <Player index={1} />
    </div>
  {/if}
</main>

<style>
  .overlay {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    background-color: #0c0c0c7e;
    min-width: 1030px;
    min-height: 80px;
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
    background-color: #0c0c0c7e;
    min-width: 1030px;
    min-height: 80px;
    opacity: 0.8;
  }

  .error p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
