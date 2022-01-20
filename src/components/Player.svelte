<script>
  import { onMount } from "svelte";
  import { appStore, players } from "./../stores.js";

  export let index;

  let isCiv = Object.hasOwn($players[index], "civ");

  onMount(() => {
    // check for civ
    if (!isCiv) return;

    // set background image
    document.documentElement.style.setProperty(
      `--bgPlayer${index}`,
      `url(../static/bg/bg${$players[index].civ}.png)`
    );
  });

  const handleStreakStyle = () => {
    const streak = $players[index].streak;
    let streakStyle = "";

    switch (true) {
      case streak < 0:
        streakStyle = "streakLoosing";
        break;

      case streak === 0:
        streakStyle = "streakNeutral";
        break;

      case streak <= 5:
        streakStyle = "streakWinning";
        break;

      case streak <= 6:
        streakStyle = "streakOnFire";
        break;

      default:
        break;
    }

    return `streak ${streakStyle}`;
  };
</script>

<div class="player player{index} {isCiv ? `` : 'noCiv'}">
  {#if isCiv}
    <div class="flag">
      <img
        src={$appStore.flags[$players[index].civ]}
        alt={`civFlagPlayer${index}`}
      />
    </div>
  {/if}
  <h2 class="playerName">{$players[index].name}</h2>
  <div class="stats">
    <ul>
      <li>#{$players[index].rank}</li>
      <li>{$players[index].elo}</li>
      <li>{$players[index].winRate}%</li>
      <li class={handleStreakStyle()}>{$players[index].streak}</li>
      <li class="wins">W {$players[index].wins}</li>
      <li class="losses">L {$players[index].losses}</li>
    </ul>
  </div>
</div>

<style>
  img {
    width: auto;
    height: 80px;
  }

  h2,
  li {
    font-family: sans-serif;
    color: #eee;
    font-size: 14px;
  }

  ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(6, max-content);
  }

  li {
    padding: 0 5px;
    word-spacing: -2px;
  }

  .wins,
  .losses,
  .streak {
    font-weight: bold;
  }

  .wins {
    color: #85ffa5;
  }

  .losses {
    color: #ff8585;
  }

  .streak {
    display: flex;
    align-items: center;
  }
  .streak::after {
    content: "";
    display: block;
    width: 13px;
    height: 13px;
    margin-left: 2px;
  }

  .streakNeutral {
    color: #eee;
  }
  .streakNeutral::after {
    background: #eee;
    -webkit-mask-image: url(../static/icon/winning-streak01.svg);
    -webkit-mask-repeat: no-repeat;
  }

  .streakWinning {
    color: #85ffa5;
  }
  .streakWinning::after {
    background: #85ffa5;
    -webkit-mask-image: url(../static/icon/winning-streak01.svg);
    -webkit-mask-repeat: no-repeat;
  }

  .streakOnFire {
    color: #85ffa5;
  }
  .streakOnFire::after {
    background: #85ffa5;
    -webkit-mask-image: url(../static/icon/winning-fire.svg);
    -webkit-mask-repeat: no-repeat;
  }

  .streakLoosing {
    color: #ff8585;
  }
  .streakLoosing::after {
    background: #ff8585;
    -webkit-mask-image: url(../static/icon/losing-streak.svg);
    -webkit-mask-repeat: no-repeat;
  }

  .player {
    display: grid;
    grid-template-rows: 1fr 1fr;
    column-gap: 10px;
    row-gap: 5px;
    background-repeat: repeat-x;
    background-position: bottom;
    background-size: 31%;
  }

  .player0 {
    grid-template-columns: 1fr 3fr;
    background-image: var(--bgPlayer0);
  }

  .player1 {
    grid-template-columns: 3fr 1fr;
    background-image: var(--bgPlayer1);
  }

  .playerName {
    align-self: end;
    font-size: 16px;
  }

  .player1 .playerName {
    justify-self: end;
  }

  .player1 .stats {
    justify-self: end;
  }

  .flag {
    grid-row: 1 / 3;
    align-self: center;
  }

  .player1 .flag {
    grid-column: 2 / 3;
  }

  .noCiv {
    grid-template-rows: 1fr;
  }
</style>
