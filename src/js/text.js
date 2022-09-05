import { lerp, loadImg } from './utils';

// available alphabet (must match characters in the alphabet sprite exactly)
// U = up arrow
// D = down arrow
// L = left arrow
// R = right arrow
// T = teapot icon
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789.:!-%,/';

export const ALIGN_LEFT = 0;
export const ALIGN_CENTER = 1;
export const ALIGN_RIGHT = 2;

// alphabet sprite, embedded as a base64 encoded dataurl by build script
import CHARSET from '../img/charset.webp';
export const CHARSET_SIZE = 8; // in px
const TEXT_SPEED = 500;        // milliseconds per character
let charset;
let textCanvas;
let ctx;

/**
 * Load charset spritesheet and initialize the text canvas at the specified size
 * @param {Canvas} canvas main canvas to clone
 * @param {int} w
 * @param {int} h
 * @return the text canvas so it can be blipped
 */
export const initCharset = async () => {
  charset = await loadImg(CHARSET);
}

export const initTextBuffer = (canvas, w, h) => {
  textCanvas = canvas.cloneNode();
  textCanvas.width = w;
  textCanvas.heigh = h;

  ctx = textCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  return textCanvas;
}

export const clearTextBuffer = () => {
  ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
}

/**
 * Render a message on the canvas context using a pixelart alphabet sprite
 * @param {*} msg 
 * @param {*} x 
 * @param {*} y 
 * @param {*} align 
 * @param {*} scale 
 */
export function renderText(msg, x, y, align = ALIGN_LEFT, scale = 1) {
  const SCALED_SIZE = scale * CHARSET_SIZE;
  const MSG_WIDTH = msg.length * SCALED_SIZE + (msg.length - 1) * scale;
  const ALIGN_OFFSET = align === ALIGN_RIGHT ? MSG_WIDTH :
                       align === ALIGN_CENTER ? MSG_WIDTH / 2 :
                       0;
  [...msg].forEach((c, i) => {
    ctx.drawImage(
      charset,
      // TODO could memoize the characters index or hardcode a lookup table
      ALPHABET.indexOf(c) * CHARSET_SIZE, 0, CHARSET_SIZE, CHARSET_SIZE,
      x + i * scale * (CHARSET_SIZE + 1) - ALIGN_OFFSET, y, SCALED_SIZE, SCALED_SIZE
    );
  });
};

export function renderAnimatedText(msg, x, y, startTime, currentTime, align = ALIGN_LEFT, scale = 1) {
  return renderText(
    msg.substring(0, Math.floor(lerp(0, msg.length, (currentTime - startTime) / TEXT_SPEED))),
    x, y, align, scale
  );
};
