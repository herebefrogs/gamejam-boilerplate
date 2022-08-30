/** Pointer events
 * Record pointer location and click times.
 *
 * Note: importing any public function of this module
 * will install the keyboard event listeners
 */

import { clamp, lerp } from '../utils';

/* private */

// on screen position of pointer
let x = 0;
let y = 0;
// vector/direction of pointer motion, in range [-1, 1];
let vX = 0;
let vY = 0;
// pointer container, used to detect direction reversal for each axis
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;
// minimum distance to cover before pointer direction considered reversed
// aka click "size" in px
let MIN_DISTANCE = 30;
// click time
let pointerDownTime = 0;

// NOTE:
// - pointer events are universal (mouse, touch, pen
// - if necessary distinguish multi-touch or multiple pens with e.pointerID
// - listening for mouse events would double pointer events
// - listening touch events only work for mobile and would not capture mouse events
addEventListener('pointerdown', e => {
  e.preventDefault();

  pointerDownTime = performance.now();
  [x, y] = [maxX, maxY] = [minX, minY] = pointerLocation(e);
});

addEventListener('pointermove', e => {
  e.preventDefault();

  // TODO there might be cases where we want the pointer position
  // despite no touch happening (think mouse moving but no click)
  // should I get rid of the if?
  if (pointerDownTime) {
    [x, y] = pointerLocation(e)
    setTouchVector();
  }
});

addEventListener('pointerup', e => {
  e.preventDefault();

  pointerDownTime = 0;
  x = y = vX = vY = minX = minY = maxX = maxY = 0;
});

const pointerLocation = e => [e.pageX, e.pageY];

function setTouchVector() {
  // touch moving further right
  if (x > maxX) {
    maxX = x;
    vX = lerp(0, 1, (maxX - minX) / MIN_DISTANCE)
  }
  // pointer moving further left
  else if (x < minX) {
    minX = x;
    vX = -lerp(0, 1, (maxX - minX) / MIN_DISTANCE)
  }
  // pointer reversing left while moving right before
  else if (x < maxX && vX >= 0) {
    minX = x;
    vX = 0;
  }
  // pointer reversing right while moving left before
  else if (minX < x && vX <= 0) {
    maxX = x;
    vX = 0;
  }

  // pointer moving further down
  if (y > maxY) {
    maxY = y;
    vY = lerp(0, 1, (maxY - minY) / MIN_DISTANCE)

  }
  // pointer moving further up
  else if (y < minY) {
    minY = y;
    vY = -lerp(0, 1, (maxY - minY) / MIN_DISTANCE)

  }
  // pointer reversing up while moving down before
  else if (y < maxY && vY >= 0) {
    minY = y;
    vY = 0;
  }
  // pointer reversing down while moving up before
  else if (minY < y && vY <= 0) {
    maxY = y;
    vY = 0;
  }
};


/* public API */

export const isPointerDown = () => pointerDownTime;

export const isPointerUp = () => isPointerDown() ? pointerDownTime = 0 || true : false;

export const screenPointerPosition = () => [x, y];

export const canvasPointerPosition = () => {
  // implicit window.inner... c is canvas ID "magic"
  // TODO could this be cached? (but how to refresh when changed?)
  const canvasX = Math.floor((innerWidth - c.width) / 2);
  const canvasY = Math.floor((innerHeight - c.height) / 2);

  return [
    clamp(x - canvasX, 0, c.width),
    clamp(y - canvasY, 0, c.height)
  ];
}

export const pointerDirection = () => [vX, vY];

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
