<script>
  import { appStore, players } from "./../stores.js";

  export let index;
</script>

<div
  class="player player{index}"
  style={`background-image: url(static/bg/bg${$players[index].civ}.png)`}
>
  <div class="flag">
    <img
      src={$appStore.flags[$players[index].civ]}
      alt={`civFlagPlayer${index}`}
    />
  </div>
  <h2 class="playerName">{$players[index].name}</h2>
  <div class="stats">
    <ul>
      <li>#{$players[index].rank}</li>
      <li>{$players[index].elo}</li>
      <li>{$players[index].winRate}%</li>
      <li>W {$players[index].wins}</li>
      <li>L {$players[index].losses}</li>
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
    grid-template-columns: repeat(5, max-content);
  }

  li {
    padding: 0 5px;
    word-spacing: -2px;
  }

  ul :nth-child(n + 4) {
    font-weight: bold;
  }

  ul :nth-child(4) {
    color: #85ffa5;
  }

  ul :nth-child(5) {
    color: #ff8585;
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
  }

  .player1 {
    grid-template-columns: 3fr 1fr;
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
</style>
