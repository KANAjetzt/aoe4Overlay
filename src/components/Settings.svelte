<script>
  import { appStore } from "./../stores.js";
  import Hotkeys from "./Hotkeys.svelte";
  import PlayerSearch from "./PlayerSearch.svelte";

  const saveSettings = async (e) => {
    if (!$appStore.settings.playerId) {
      $appStore.isError = true;
      $appStore.errorMessage = "No player data";
      return;
    }

    const res = await window.electron.invoke("settings", $appStore.settings);

    console.log(res);

    if (res.status === "success") {
      $appStore.isSettingsSaved = true;

      console.log($appStore.settings);
    } else {
      $appStore.isError = true;
      $appStore.errorMessage = res.message;
    }
  };

  const handleCloseBtn = async () => {
    const res = await window.electron.invoke("close");
  };
</script>

<div class="bar">
  <button class="close" on:click={handleCloseBtn} />
</div>

<main class="settings">
  <h2>PlayerId</h2>
  <PlayerSearch />

  <h2>Hotkeys</h2>
  <Hotkeys />

  <button class="btnSave" on:click={saveSettings}
    >save
    <div class="doneIcon {$appStore.isSettingsSaved ? 'start' : ''}" />
  </button>
  {#if $appStore.isError}
    <p class="errorMessage">{$appStore.errorMessage}</p>
  {/if}
</main>

<style>
  .bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-blend-mode: overlay;
    background-image: url(../static/bg/textile.png),
      linear-gradient(176deg, #1f2738, #07080c);
    -webkit-app-region: drag;
  }

  .close {
    margin-right: 10px;
    width: 14px;
    height: 14px;
    border: none;
    background: linear-gradient(180deg, #e7c067, #b8862d);
    -webkit-mask-image: url(../static/icon/close.svg);
    -webkit-mask-repeat: no-repeat;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }
  h2 {
    padding: 50px 0 10px 0;
    font-family: Merriweather, serif;
    background: linear-gradient(176deg, #ffdf91, #cda351);
    color: transparent;
    background-clip: inherit;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2:first-of-type {
    padding: 10px 0;
  }

  .settings {
    width: 1030px;
    height: 800px;
    padding: 5rem;
    background-blend-mode: overlay;
    background-image: url(../static/bg/textile.png),
      linear-gradient(#1f2738, #07080c);
  }

  .btnSave {
    position: relative;
    cursor: pointer;
    margin-top: 70px;
    padding: 10px 15px;
    letter-spacing: 2px;
    color: #ffdf91;
    text-shadow: 1px 1px 0px #00000099;
    text-transform: uppercase;
    border-width: 1.7px;
    border-style: solid;
    border-image-source: linear-gradient(
      135deg,
      rgba(184, 133, 45, 0),
      #b8852d00,
      #ffe09100,
      #b8852d00,
      rgba(184, 133, 45, 0)
    );
    border-image-slice: 2;
    background: linear-gradient(#0a5b7f, #003050);
    box-shadow: 3px 3px 0 #0000004d;
    transition: all 0.2s ease-out;
  }

  .btnSave:focus,
  .btnSave:hover {
    border-width: 1.7px;
    border-image-source: linear-gradient(
      135deg,
      rgb(184 134 45),
      #b8862d,
      #ffdf91,
      #b8862d,
      rgb(184 134 45)
    );
    border-style: solid;
    border-image-slice: 2;
  }

  .btnSave:active {
    box-shadow: 5px 8px 2px #0000004d;
    border-image-source: linear-gradient(
      90deg,
      rgba(184, 133, 45, 0.5),
      #b8862d,
      #ffdf91,
      #b8862d,
      rgba(184, 133, 45, 0.5)
    );
  }

  .doneIcon {
    position: absolute;
    top: 50%;
    transform: translate(70px, -50%);
    display: block;
    content: "";
    width: 25px;
    height: 25px;
    background: linear-gradient(180deg, #e7c067, #b8862d);
    -webkit-mask-image: url(../static/icon/done.svg);
    -webkit-mask-repeat: no-repeat;
    opacity: 0;
    animation: slideIn 0.2s ease-out forwards;
    animation-play-state: paused;
  }

  .start {
    animation-play-state: running;
  }

  .errorMessage {
    margin-top: 30px;
    padding: 10px;
    background: #c34d3a59;
    width: 40%;
  }

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translate3d(0px, -50%, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(70px, -50%, 0);
    }
  }
</style>
