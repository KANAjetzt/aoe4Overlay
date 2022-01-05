<script>
  export let error = false;
</script>

<div class="loaderV2 {error ? 'error' : ''}" />

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
    animation: none;
  }

  @keyframes loaderV2 {
    0% {
      background-position: 100%;
    }
    100% {
      background-position: -30%;
    }
  }
</style>
