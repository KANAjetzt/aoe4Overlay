<script>
  import { appStore } from "./../stores.js";

  let isActive = {
    refresh: false,
    hide: false,
  };
  let action = null;
  let pressedKeys = [];
  let isKeySet = false;
  let errorMessage = "";

  const modifiers = new Map();
  modifiers.set("ControlLeft", "Control");
  modifiers.set("ControlRight", "Control");
  modifiers.set("AltLeft", "Alt");
  modifiers.set("AltRight", "AltGr");
  modifiers.set("ShiftLeft", "Shift");
  modifiers.set("ShiftRight", "Shift");

  const keyCodes = new Map();
  keyCodes.set("Digit0", "0");
  keyCodes.set("Digit1", "1");
  keyCodes.set("Digit2", "2");
  keyCodes.set("Digit3", "3");
  keyCodes.set("Digit4", "4");
  keyCodes.set("Digit5", "5");
  keyCodes.set("Digit6", "6");
  keyCodes.set("Digit7", "7");
  keyCodes.set("Digit8", "8");
  keyCodes.set("Digit9", "9");
  keyCodes.set("Numpad0", "num0");
  keyCodes.set("Numpad1", "num1");
  keyCodes.set("Numpad2", "num2");
  keyCodes.set("Numpad3", "num3");
  keyCodes.set("Numpad4", "num4");
  keyCodes.set("Numpad5", "num5");
  keyCodes.set("Numpad6", "num6");
  keyCodes.set("Numpad7", "num7");
  keyCodes.set("Numpad8", "num8");
  keyCodes.set("Numpad9", "num9");
  keyCodes.set("NumpadDecimal", "numdec");
  keyCodes.set("NumpadAdd", "numadd");
  keyCodes.set("NumpadSubtract", "numsub");
  keyCodes.set("NumpadMultiply", "nummult");
  keyCodes.set("NumpadDivide", "numdiv");
  keyCodes.set("F1", "F1");
  keyCodes.set("F2", "F2");
  keyCodes.set("F3", "F3");
  keyCodes.set("F4", "F4");
  keyCodes.set("F5", "F5");
  keyCodes.set("F6", "F6");
  keyCodes.set("F7", "F7");
  keyCodes.set("F8", "F8");
  keyCodes.set("F9", "F9");
  keyCodes.set("F10", "F10");
  keyCodes.set("F11", "F11");
  keyCodes.set("F12", "F12");
  keyCodes.set("F13", "F13");
  keyCodes.set("F14", "F14");
  keyCodes.set("F15", "F15");
  keyCodes.set("F16", "F16");
  keyCodes.set("F17", "F17");
  keyCodes.set("F18", "F18");
  keyCodes.set("F19", "F19");
  keyCodes.set("F20", "F20");
  keyCodes.set("F21", "F21");
  keyCodes.set("F22", "F22");
  keyCodes.set("F23", "F23");
  keyCodes.set("F24", "F24");
  keyCodes.set("KeyA", "A");
  keyCodes.set("KeyB", "B");
  keyCodes.set("KeyC", "C");
  keyCodes.set("KeyD", "D");
  keyCodes.set("KeyE", "E");
  keyCodes.set("KeyF", "F");
  keyCodes.set("KeyG", "G");
  keyCodes.set("KeyH", "H");
  keyCodes.set("KeyI", "I");
  keyCodes.set("KeyJ", "J");
  keyCodes.set("KeyK", "K");
  keyCodes.set("KeyL", "L");
  keyCodes.set("KeyM", "M");
  keyCodes.set("KeyN", "N");
  keyCodes.set("KeyO", "O");
  keyCodes.set("KeyP", "P");
  keyCodes.set("KeyQ", "Q");
  keyCodes.set("KeyR", "R");
  keyCodes.set("KeyS", "S");
  keyCodes.set("KeyT", "T");
  keyCodes.set("KeyU", "U");
  keyCodes.set("KeyV", "V");
  keyCodes.set("KeyW", "W");
  keyCodes.set("KeyX", "X");
  keyCodes.set("KeyY", "Y");
  keyCodes.set("KeyZ", "Z");
  keyCodes.set("Period", ".");
  keyCodes.set("Comma", ",");
  keyCodes.set("Slash", "-");
  keyCodes.set("Space", "Space");
  keyCodes.set("Tab", "Tab");
  keyCodes.set("CapsLock", "Capslock");
  keyCodes.set("NumLock", "Numlock");
  keyCodes.set("Backspace", "Backspace");
  keyCodes.set("Insert", "Insert");
  keyCodes.set("Delete", "Delete");
  keyCodes.set("Enter", "Enter");
  keyCodes.set("NumpadEnter", "Enter");
  keyCodes.set("ArrowUp", "Up");
  keyCodes.set("ArrowDown", "Down");
  keyCodes.set("ArrowLeft", "Left");
  keyCodes.set("ArrowRight", "Right");
  keyCodes.set("PrintScreen", "PrintScreen");

  const handleKeyDown = (e) => {
    if (e.repeat) return;
    console.log(e);

    // check if modifier or key
    if (modifiers.has(e.code)) {
      // its a modifier
      pressedKeys.push(modifiers.get(e.code));
      // check if its an allowed key
    } else if (keyCodes.has(e.code)) {
      // its a key
      // only one key allowed!
      if (!isKeySet) {
        pressedKeys.push(keyCodes.get(e.code));
        isKeySet = true;
      } else {
        // show info
        errorMessage = "sorry only one key is allowed";
      }
    } else {
      // key is not allowed show error
      errorMessage = `sorry ${e.key} is not allowed to be in a scortcut`;
    }

    $appStore.settings.hotkeys[action] = pressedKeys.join("+");

    console.log($appStore.settings.hotkeys);
  };

  const handleKeyUp = (e) => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);

    // reset pressedKeys
    pressedKeys = [];

    // reset active
    isActive[action] = false;
  };

  // multiple modifiers and a single key code
  const captureHotkey = () => {
    // reset error message
    errorMessage = "";

    // reset hotkey data
    $appStore.settings.hotkeys[action] = "";
    isKeySet = false;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  };
</script>

<ul>
  <label for="refresh">Refresh</label>
  <input
    type="button"
    name="refresh"
    id="refresh"
    class="refresh {isActive.refresh ? 'active' : ''}"
    bind:value={$appStore.settings.hotkeys.refresh}
    on:click={() => {
      action = "refresh";
      isActive[action] = true;
      captureHotkey();
    }}
  />

  <label for="hide">Hide / Show</label>
  <input
    type="button"
    name="hide"
    id="hide"
    class="hide {isActive.hide ? 'active' : ''}"
    bind:value={$appStore.settings.hotkeys.hide}
    on:click={() => {
      action = "hide";
      isActive[action] = true;
      captureHotkey();
    }}
  />
</ul>

{#if errorMessage}
  <p class="errorMessage">{errorMessage}</p>
{/if}

<style>
  ul {
    display: grid;
    grid-template-columns: max-content max-content;
    row-gap: 30px;
    column-gap: 100px;
    align-items: center;
  }

  label {
    cursor: pointer;
  }

  input {
    padding: 10px;
    background: #0000005c;
    border: none;
    border-width: 2px;
    border-image-slice: 7;
    border-image-source: linear-gradient(
      165deg,
      rgb(184 134 45),
      #b8862d,
      #ffdf91,
      #b8862d,
      rgb(184 134 45)
    );
    border-style: solid;
    box-shadow: 1px 2px 4px #00000066;
    cursor: pointer;
    transition: all 0.2s ease-out;
    text-transform: uppercase;
  }

  input:focus,
  input:hover {
    border-image-source: linear-gradient(
      90deg,
      rgb(184 134 45),
      #b8862d,
      #ffdf91,
      #b8862d,
      rgb(184 134 45)
    );
    background: #0000008a;
  }

  input.active {
    background: linear-gradient(180deg, #ffdf91a3, #b8862d85);
  }

  .errorMessage {
    margin-top: 30px;
    padding: 10px;
    background: #c34d3a59;
    width: 40%;
  }
</style>
