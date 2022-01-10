<script>
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { appStore } from "../stores";

  export let style = "";
</script>

<div
  transition:slide|local={{
    duration: 300,
    easing: quintOut,
  }}
  on:outroend={() => {
    $appStore.isLoading = false;
  }}
  class="loaderV2 {$appStore.isLoadingError ? 'error' : ''} {style}"
/>

<style>
  /* Loader V2 */
  .loaderV2 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background-color: #ffdf91;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 40%,
      #b8862d 50%,
      transparent 60%
    );
    background-size: 400% 400%;
    animation: loaderV2 3s ease infinite;
  }

  .loaderV2::before {
    content: "";
    display: block;
    width: 100%;
    height: 10px;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 15%,
      #b8862d 50%,
      transparent 70%
    );
    background-size: 400% 400%;
    animation: loaderV2 3s ease infinite;
    animation-delay: 1s;
  }

  .loaderV2::after {
    content: "";
    display: block;
    width: 100%;
    height: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 40%,
      #b8862d 50%,
      transparent 60%
    );
    background-size: 400% 400%;
    animation: loaderV2 3s ease infinite;
    animation-delay: 2s;
  }

  .searchBar {
    width: 21%;
    height: 3px;
  }
  .searchBar::after,
  .searchBar::before {
    height: 3px;
  }

  .error,
  .error::before,
  .error::after {
    background-color: #ff9191;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      transparent 40%,
      #b82d2d 50%,
      transparent 60%
    );
    background-position: 50%;
    animation: shake 0.7s ease-in-out;
  }

  @keyframes loaderV2 {
    0% {
      background-position: 100%;
    }
    100% {
      background-position: -30%;
    }
  }

  @keyframes shake {
    from,
    to {
      transform: translate3d(0, 0, 0);
      background-position: 50%;
    }

    20%,
    60% {
      background-position: 47%;
    }

    40%,
    80% {
      background-position: 53%;
    }
  }
</style>
