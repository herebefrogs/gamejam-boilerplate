/** Keyboard input
 * Record time at which each key gets pressed
 * and provide utilities to queries which keys are pressed or released
 *
 * Note: importing any public function of this module
 * will install the keyboard event listeners
 */

/* private */

// time at which each key was pressed
// key = KeyboardEvent.code
// value = time in ms at which keyboard event was first emitted (repeats are filtered out)
const KEYS = {};

const _isKeyDown = code => KEYS[code] || 0;

const _releaseKey = code => delete KEYS[code];

addEventListener('keydown', e => {
  // prevent itch.io from scrolling the page up/down
  e.preventDefault();

  if (!e.repeat) {
    KEYS[e.code] = performance.now();
  }
});

addEventListener('keyup', e => _releaseKey(e.code));




/* public API */

// returns the most recent key pressed amongst the array passed as argument (or 0 if none were)
export const isKeyDown = (...codes) => Math.max(...codes.map(code => _isKeyDown(code)))

// retuns the list of keys currently pressed
export const whichKeyDown = () => Object.keys(KEYS).filter(code => _isKeyDown(code));

// returns if any key is currently pressed
export const anyKeyDown = () => whichKeyDown().length;

// return true if a key can be released (must be currently pressed) or false if it can't
// note: this "consumes" the key pressed by releasing it (only if it was pressed)
export const isKeyUp = code => _isKeyDown(code) ? _releaseKey(code) : false;

