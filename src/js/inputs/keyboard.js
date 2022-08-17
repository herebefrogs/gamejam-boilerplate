
// time at which each key was pressed
// key = KeyboardEvent.code
// value = time in ms at which keyboard event was first emitted (repeats are filtered out)
const KEYS = {};

/* public API */
export const isKeyDown = code => KEYS[code] || 0;

export const keysDown = () => Object.keys(KEYS).filter(code => KEYS[code]);

export const isAnyKeyDown = () => keysDown().length;

// note: this "consumes" the key pressed by releasing it (only if it was pressed)
export const isKeyUp = code => isKeyDown(code) ? releaseKey(code) : false;

/* private */

const releaseKey = code => delete KEYS[code];

document.addEventListener('keydown', e => {
  // prevent itch.io from scrolling the page up/down
  e.preventDefault();

  if (!e.repeat) {
    KEYS[e.code] = performance.now();
  }
});

document.addEventListener('keyup', e => releaseKey(e.code));
