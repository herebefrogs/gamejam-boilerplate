// very specific to Afterglow Xbox 
// TODO use the standard controller mapping and expose all buttons
const LEFT_ANALOG_X_AXIS = 0;
const LEFT_ANALOG_Y_AXIS = 1;
const BUTTON_A = 0;
const BUTTON_B = 1;
const BUTTON_X = 2;
const BUTTON_Y = 3;

let gamepad;

function gamepadConnected(e, gamepads) {
  if ((gamepads || navigator.getGamepads())[e.gamepad.index] && e.gamepad.connected) {
    console.log('[gamepad] connecting', e.gamepad);
    gamepad = e.gamepad;
  } else {
    // ¯\_(ツ)_/¯ Chrome fires a gamepadconnected event in lieu of
    // a gamepaddisconnected one, with connected set to true nonetheless
    // so force the gamepad disconnection
    gamepadDisconnected({ gamepad: { index: e.gamepad.index, connected: false }});
  }
}

function gamepadDisconnected(e) {
  if (gamepad && gamepad.index === e.gamepad.index && !e.gamepad.connected) {
    console.log('[gamepad] disconnecting', gamepad);
    gamepad = undefined;
  }
};

function gamepadPollData() {
  const controllers = navigator.getGamepads();
  // ¯\_(ツ)_/¯ Chrome doesn't fire the gamepadconnected event when attaching a gamepad
  // so pick the first connected gamepad of the list
  if (!gamepad) {
    for (let controller of controllers) {
      if (controller && controller.connected) {
        gamepadConnected({ gamepad: controller }, controllers);
        break;
      }
    }
  }
  if (gamepad) {
    return {
      // expose all buttons from standard mapping
      leftX: Math.round(gamepad.axes[LEFT_ANALOG_X_AXIS] * 100) / 100,
      leftY: Math.round(gamepad.axes[LEFT_ANALOG_Y_AXIS] * 100) / 100,
      buttonA: gamepad.buttons[BUTTON_A].pressed,
      buttonB: gamepad.buttons[BUTTON_B].pressed,
      buttonX: gamepad.buttons[BUTTON_X].pressed,
      buttonY: gamepad.buttons[BUTTON_Y].pressed
    };
  }
};

// turn off gamepad polling if Gamepad API not supported
if (!navigator.getGamepads) {
  gamepadPollData = function() {};
}

// TODO test if this is going to be kept by Rollup if only gamepadPollData is used
addEventListener('gamepadconnected', gamepadConnected);
addEventListener('gamepaddisconnected', gamepadDisconnected);

export {
  gamepad,
  gamepadConnected,
  gamepadDisconnected,
  gamepadPollData
}