// Gamepad API quirks, hand-tested Chrome/Firefox/Safari (2026-09):
// - Firefox never fires 'gamepadconnected'/'gamepaddisconnected', and
//   navigator.getGamepads() always returns [] despite all dom.gamepad.xxx
//   properties being on in about:config.
// - Chrome doesn't fire 'gamepadconnected' on physical plug, but delays it
//   until the user interaction with the controller (button press, stick move),
//   and indexes that pad as a *2nd* one: navigator.getGamepads() becomes
//   [null, Gamepad, null, null] instead of appearing atindex 0.
//   Unpluging the controller fires the 'gamepaddisconnected' event.
//   Re-plugging the same controller fires the event *twice*, and the pad
//   then appears at both index 0 and 1 simultaneously.
// - Safari fires 'gamepadconnected' reliably on physical connect (index 0,
//   stays there), but never fires 'gamepaddisconnected' on physical unplug.
//
// Conclusion: connect/disconnect events are too unreliable for detection.
// navigator.getGamepads(), polled every frame, is the only thing that works
// consistently across all three engines - so that's all this module does.

// specific to Xbox Controller (official Microsoft and 3rd party licensed AfterGlow)
const LEFT_ANALOG_X_AXIS = 0;
const LEFT_ANALOG_Y_AXIS = 1;
const BUTTON_A = 0;
const BUTTON_B = 1;
const BUTTON_X = 2;
const BUTTON_Y = 3;

// only the first connected gamepad is used
// no support yet for multiple simultaneous gamepads.
function gamepadPollData() {
  for (const gamepad of navigator.getGamepads()) {
    if (gamepad && gamepad.connected) {
      return {
        leftX: Math.round(gamepad.axes[LEFT_ANALOG_X_AXIS] * 100) / 100,
        leftY: Math.round(gamepad.axes[LEFT_ANALOG_Y_AXIS] * 100) / 100,
        buttonA: gamepad.buttons[BUTTON_A].pressed,
        buttonB: gamepad.buttons[BUTTON_B].pressed,
        buttonX: gamepad.buttons[BUTTON_X].pressed,
        buttonY: gamepad.buttons[BUTTON_Y].pressed
      };
    }
  }
};

// turn off gamepad polling if Gamepad API not supported
if (!navigator.getGamepads) {
  gamepadPollData = function() {};
}

export {
  gamepadPollData
}
