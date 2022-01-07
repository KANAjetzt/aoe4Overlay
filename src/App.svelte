<script>
  import Settings from "./components/Settings.svelte";
  import { appStore } from "./stores.js";
  import Overlay from "./components/Overlay.svelte";
</script>

{#if $appStore.currentWindow === "main"}
  <Overlay />
{/if}
{#if $appStore.currentWindow === "settings"}
  <Settings />
{/if}

<style>
</style>
