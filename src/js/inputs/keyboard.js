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

const releaseKey = code => delete KEYS[code];

addEventListener('keydown', e => {
  // prevent itch.io from scrolling the page up/down
  e.preventDefault();

  if (!e.repeat) {
    KEYS[e.code] = performance.now();
  }
});

 addEventListener('keyup', e => releaseKey(e.code));


/* public API */

// returns the most recent key pressed amongt the array passed as argument (or 0 if none were)
export const areKeyDown = codes => {
  const times = Object.keys(KEYS).filter(code => codes.includes(code)).map(code => isKeyDown(code));
  return times.length ? Math.max(...times) : 0;
}

// returns the time a key was pressed (or 0 if it wasn't)
export const isKeyDown = code => KEYS[code] || 0;

// retuns the list of keys currently pressed
export const whichKeysDown = () => Object.keys(KEYS).filter(code => isKeyDown(code));

// returns if any key is currently pressed
export const isAnyKeyDown = () => whichKeysDown().length;

// return true if a key can be released (must be currently pressed) or false if it can't
// note: this "consumes" the key pressed by releasing it (only if it was pressed)
export const isKeyUp = code => isKeyDown(code) ? releaseKey(code) : false;

