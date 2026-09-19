/** Pointer events
 * Record pointer location and click times.
 *
 * Note: importing any public function of this module
 * will install the keyboard event listeners
 */

import { clamp } from '../utils';

/* private */

// screen position of pointer (pageX/pageY)
let x = 0;
let y = 0;
// steering vector, each axis in [-1, 1]
let vX = 0;
let vY = 0;
// pad centre / anchor, per axis. Starts at the contact point; trails the
// finger by RAMP once the finger pushes past the pad edge (see updatePad).
// This is the "floating D-pad" - the pad follows your thumb rather than
// staying pinned where you first touched, so a long drift never leaves you
// off the pad. On reversal the finger has to travel back through this centre
// before the axis flips sign, which is the D-pad feel players expect.
let aX = 0;
let aY = 0;
// the pad radius, px: an axis ramps linearly 0 -> +/-1 over this distance from
// the anchor, and the anchor trails the finger to stay within it. One number,
// both jobs - deflection is proportional edge to edge (no dead outer band).
// Sized for a thumb: ~a finger-width of slack each way. Was MIN_DISTANCE.
const RAMP = 55;
// hold-straight dead radius around the centre, px. Inside it an axis reads
// exactly 0 - absorbs thumb tremor and, being per-axis, snaps a mostly-
// vertical or mostly-horizontal drag to pure up/down or left/right.
const DEAD = 8;
// click time
let pointerDownTime = 0;
// last pointer event (for canvas space calculations)
let lastEvent;

// NOTE:
// - pointer events are universal (mouse, touch, pen)
// - if necessary distinguish multi-touch or multiple pens with e.pointerId
// - listening for mouse events would double pointer events
// - listening touch events only work for mobile and would not capture mouse events
addEventListener('pointerdown', e => {
  e.preventDefault();
  lastEvent = e;

  pointerDownTime = performance.now();
  [x, y] = [aX, aY] = pointerLocation();
  vX = vY = 0;   // don't let the previous drag's heading leak into the frame before the first move
});

addEventListener('pointermove', e => {
  e.preventDefault();
  lastEvent = e;

  [x, y] = pointerLocation();

  if (pointerDownTime) {
    updatePad();
  }
});

addEventListener('pointerup', e => {
  e.preventDefault();
  lastEvent = e;

  pointerDownTime = 0;
  vX = vY = aX = aY = 0;
});

// for multiple pointers, use e.pointerId to differentiate (on desktop, mouse is always 1, on mobile every pointer even has a different id incrementing by 1)
// for surface area of touch contact, use e.width and e.height (in CSS pixel) mutiplied by window.devicePixelRatio (for device pixels aka canvas pixels)
// for canvas space coordinate, use e.layerX and .layerY when e.target = c
// { id: e.pointerId, x: e.x, y: e.y, w: e.width*window.devicePixelRatio, h: e.height*window.devicePixelRatio}
const pointerLocation = () => [Math.floor(lastEvent.pageX), Math.floor(lastEvent.pageY)];

// drag the anchor so the finger is never more than RAMP from it, then read
// the deflection off (finger - anchor) on each axis independently.
function updatePad() {
  aX = clamp(aX, x - RAMP, x + RAMP);
  aY = clamp(aY, y - RAMP, y + RAMP);
  vX = deflect(x - aX);
  vY = deflect(y - aY);
};

// one axis: 0 within DEAD of centre, ramps to +/-1 by RAMP (the anchor trail
// keeps the finger within RAMP, so the clamp only bites on a fast flick).
function deflect(d) {
  const m = Math.abs(d);
  return m <= DEAD ? 0 : Math.sign(d) * clamp((m - DEAD) / (RAMP - DEAD), 0, 1);
};


/* public API */

export const isPointerDown = () => pointerDownTime;

export const isPointerUp = () => isPointerDown() ? (pointerDownTime = 0) || true : false;

export const pointerScreenPosition = () => [x, y];

export const pointerCanvasPosition = (canvasWidth, canvasHeight) => {
  // canvas is centered horizontally
  // x/pageX/y/pageY are in screen space, must be offset by canvas position then scaled down
  // to be converted in canvas space
  return [
    clamp(
      (lastEvent.x || lastEvent.pageX) - (innerWidth - canvasWidth)/2,
      0, canvasWidth
    ),
    clamp(
     lastEvent.y || lastEvent.pageY,
      0, canvasHeight
    )
  ].map(Math.round);
}

export const pointerDirection = () => [vX, vY];

// pad state for the on-screen D-pad overlay (drawn in game.js - inputs/ must
// not render). [anchor x, anchor y, finger x, finger y, RAMP, DEAD], positions
// in pageX/pageY px, the two radii as defined above.
export const pointerPad = () => [aX, aY, x, y, RAMP, DEAD];

// TODO verify and delete
/*
function addDebugTouch(x, y) {
  touches.push([x / innerWidth * VIEWPORT.width, y / innerHeight * VIEWPORT.height]);
  if (touches.length > 10) {
    touches = touches.slice(touches.length - 10);
  }
};

function renderDebugTouch() {
  let x = maxX / innerWidth * VIEWPORT.width;
  let y = maxY / innerHeight * VIEWPORT.height;
  renderDebugTouchBound(x, x, 0, VIEWPORT.height, '#f00');
  renderDebugTouchBound(0, VIEWPORT.width, y, y, '#f00');
  x = minX / innerWidth * VIEWPORT.width;
  y = minY / innerHeight * VIEWPORT.height;
  renderDebugTouchBound(x, x, 0, VIEWPORT.height, '#ff0');
  renderDebugTouchBound(0, VIEWPORT.width, y, y, '#ff0');

  if (touches.length) {
    VIEWPORT_CTX.strokeStyle = VIEWPORT_CTX.fillStyle =   '#02d';
    VIEWPORT_CTX.beginPath();
    [x, y] = touches[0];
    VIEWPORT_CTX.moveTo(x, y);
    touches.forEach(function([x, y]) {
      VIEWPORT_CTX.lineTo(x, y);
    });
    VIEWPORT_CTX.stroke();
    VIEWPORT_CTX.closePath();
    VIEWPORT_CTX.beginPath();
    [x, y] = touches[touches.length - 1];
    VIEWPORT_CTX.arc(x, y, 2, 0, 2 * Math.PI)
    VIEWPORT_CTX.fill();
    VIEWPORT_CTX.closePath();
  }
};

function renderDebugTouchBound(_minX, _maxX, _minY, _maxY, color) {
  VIEWPORT_CTX.strokeStyle = color;
  VIEWPORT_CTX.beginPath();
  VIEWPORT_CTX.moveTo(_minX, _minY);
  VIEWPORT_CTX.lineTo(_maxX, _maxY);
  VIEWPORT_CTX.stroke();
  VIEWPORT_CTX.closePath();
};
*/
