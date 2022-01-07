<script>
  import Hotkeys from "./Hotkeys.svelte";
  import PlayerSearch from "./PlayerSearch.svelte";
</script>

<main class="settings">
  <h2>PlayerId</h2>
  <PlayerSearch />

  <Hotkeys />
</main>

<style>
  h2 {
    padding: 10px 0;
    font-family: Merriweather, serif;
    background: linear-gradient(176deg, #ffdf91, #cda351);
    color: transparent;
    background-clip: inherit;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .settings {
    width: 1030px;
    height: 800px;
    padding: 5rem;
    background-blend-mode: overlay;
    background-image: url(../static/bg/textile.png),
      linear-gradient(#1f2738, #07080c);
  }
</style>
