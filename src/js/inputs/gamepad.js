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

// only the first connected gamepad is used
// no support yet for multiple simultaneous gamepads.
function gamepadPollData() {
  for (const gamepad of navigator.getGamepads()) {
    if (gamepad && gamepad.connected) {
      // "standard" gamepad mapping (gamepad.mapping === 'standard'), as
      // reported by an Xbox Controller (official Microsoft and 3rd party
      // licensed AfterGlow). Triggers (buttons 6/7) are analog, [0, 1]
      // range, not discrete.
      return {
        leftX: Math.round(gamepad.axes[0] * 100) / 100,
        leftY: Math.round(gamepad.axes[1] * 100) / 100,
        rightX: Math.round(gamepad.axes[2] * 100) / 100,
        rightY: Math.round(gamepad.axes[3] * 100) / 100,
        buttonA: gamepad.buttons[0].pressed,
        buttonB: gamepad.buttons[1].pressed,
        buttonX: gamepad.buttons[2].pressed,
        buttonY: gamepad.buttons[3].pressed,
        leftBumper: gamepad.buttons[4].pressed,
        rightBumper: gamepad.buttons[5].pressed,
        leftTrigger: Math.round(gamepad.buttons[6].value * 100) / 100,
        rightTrigger: Math.round(gamepad.buttons[7].value * 100) / 100,
        back: gamepad.buttons[8].pressed,
        start: gamepad.buttons[9].pressed,
        leftStickButton: gamepad.buttons[10].pressed,
        rightStickButton: gamepad.buttons[11].pressed,
        dpadUp: gamepad.buttons[12].pressed,
        dpadDown: gamepad.buttons[13].pressed,
        dpadLeft: gamepad.buttons[14].pressed,
        dpadRight: gamepad.buttons[15].pressed
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
