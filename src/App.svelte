<script>
  import { onMount } from "svelte";
  import { appStore } from "./stores.js";
  import Settings from "./components/Settings.svelte";
  import Overlay from "./components/Overlay.svelte";

  let isSettings = false;

  onMount(() => {
    window.electron.on("sendSettings", (e, settings) => {
      console.log("reciving settings!");
      $appStore.settings = settings;
      console.log($appStore.settings);

      // main window if player id is there else show settings window
      $appStore.settings.playerId
        ? ($appStore.currentWindow = "main")
        : ($appStore.currentWindow = "settings");

      isSettings = true;
    });
  });
</script>

{#if isSettings}
  {#if $appStore.currentWindow === "main"}
    <Overlay />
  {/if}
  {#if $appStore.currentWindow === "settings"}
    <Settings />
  {/if}
{/if}

<style>
</style>
