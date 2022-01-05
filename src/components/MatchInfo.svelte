<script>
  import { match } from "./../stores.js";
</script>

<div class="matchInfo">
  <p>{$match.map}</p>
  <p>{$match.server}</p>
</div>

<style>
  .matchInfo {
    align-self: center;
    justify-self: center;
  }

  p {
    font-family: sans-serif;
    color: #eee;
    font-size: 14px;
    text-align: center;
    line-height: 1.5;
  }
</style>
