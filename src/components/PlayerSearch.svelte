<script>
  import Loader from "./Loader.svelte";
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { appStore, players } from "./../stores.js";
  import Player from "./Player.svelte";

  let playerName = null;
  let isOutroDone = false;

  const getPlayerData = async () => {
    // Show loading bar
    $appStore.isLoading = true;

    // Reset players
    $players = [];

    // search for player
    const playerDataRes = await fetch(
      `https://aoeiv.net/api/leaderboard?game=aoe4&leaderboard_id=17&search=${playerName}&start=1&count=1`
    );
    const playerData = await playerDataRes.json();
    const player = playerData.leaderboard[0];

    const {
      profile_id: id,
      name,
      rank,
      rating: elo,
      games,
      wins,
      losses,
    } = player;

    // win rate
    const winRate = Math.round((100 * wins) / games);

    $players[0] = {
      id,
      name,
      rank,
      elo,
      games,
      wins,
      losses,
      winRate,
    };

    // Hide loading bar
    $appStore.isLoading = false;

    // show player selection
    $appStore.isPlayerPreviewVisible = true;
  };

  const handleSearchBtnClick = () => {
    // if there isn't a player in the preview yet
    if (!$players[0]) {
      // just search for the player
      getPlayerData();
    } else {
      // hide player selection
      $appStore.isPlayerPreviewVisible = false;
      // wait for animation to end
      setTimeout(() => {
        // search player
        getPlayerData();
      }, 305);
    }
  };
</script>

<div class="searchBar">
  <Loader style="searchBar" />
  <input
    type="text"
    name="playerName"
    id="playerName"
    class="playerName"
    placeholder="Search by Playername"
    bind:value={playerName}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        handleSearchBtnClick();
      }
    }}
  />
  <button class="btnSearch" on:click={handleSearchBtnClick} />
</div>
{#if $appStore.isPlayerPreviewVisible && $players[0]}
  <div
    class="playerSelection"
    transition:slide|local={{
      duration: 300,
      easing: quintOut,
    }}
  >
    <button
      class="btnPlayerSelect"
      on:click={() => {
        $appStore.settings.playerId = $players[0].id;
        playerName = $players[0].id;

        // hide player selection
        $appStore.isPlayerPreviewVisible = false;
      }}
    >
      <Player index={0} />
    </button>
  </div>
{/if}

<style>
  .searchBar {
    position: relative;
    display: flex;
    align-items: center;
  }

  .playerName {
    padding: 0.5rem;
    font-weight: bold;
    border-width: 0 0 3px;
    border-image-slice: 2;
    border-image-source: linear-gradient(
      90deg,
      rgba(184, 134, 45, 0),
      #b8862d,
      #ffdf91,
      #b8862d,
      rgba(184, 134, 45, 0)
    );
    border-style: solid;
    background: transparent;

    transition: all 0.2s ease-out;
  }

  .playerName:focus,
  .playerName:hover {
    outline: none;
    border-image-source: linear-gradient(
      90deg,
      rgba(184, 134, 45, 0),
      #5f3f04,
      #ffdf91,
      #5f3f04,
      rgba(184, 133, 45, 0)
    );
  }

  .btnSearch {
    display: block;
    width: 25px;
    height: 25px;
    background: none;
    border: none;
    background: linear-gradient(180deg, #e7c067, #b8862d);
    -webkit-mask-image: url("../static/icon/search.svg");
    -webkit-mask-repeat: no-repeat;
    cursor: pointer;
  }

  .playerSelection {
    padding: 10px 0;
  }

  .btnPlayerSelect {
    padding: 10px;
    background: #0000005c;
    border: none;
    border-width: 3px 4px 3px 4px;
    border-image-slice: 7;
    border-image-source: linear-gradient(
      90deg,
      rgba(184, 134, 45, 0),
      #b8862d,
      #ffdf91,
      #b8862d,
      rgba(184, 134, 45, 0)
    );
    border-style: solid;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }

  .btnPlayerSelect:focus,
  .btnPlayerSelect:hover {
    border-image-source: linear-gradient(
      90deg,
      rgba(184, 134, 45, 0),
      #5f3f04,
      #ffdf91,
      #5f3f04,
      rgba(184, 133, 45, 0)
    );
    background: #0000008a;
  }
</style>
