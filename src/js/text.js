import { loadImg } from './utils';

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
let charset;
let ctx;

export const initCharset = async (canvasContext) => {
  ctx = canvasContext;
  charset = await loadImg(CHARSET);
}

/**
 * Render a message on the canvas context using a pixelart alphabet sprite
 * @param {*} msg 
 * @param {*} ctx 
 * @param {*} x 
 * @param {*} y 
 * @param {*} align 
 * @param {*} scale 
 */
export function renderText(msg, x, y, align = ALIGN_LEFT, scale = 1) {
  const SCALED_SIZE = scale * CHARSET_SIZE;
  const MSG_WIDTH = msg.length * (SCALED_SIZE + 1) - 1;
  const ALIGN_OFFSET = align === ALIGN_RIGHT ? MSG_WIDTH :
                       align === ALIGN_CENTER ? MSG_WIDTH / 2 :
                       0;
  [...msg].forEach((c, i) => {
    ctx.drawImage(
      charset,
      // TODO could memoize the characters index or hardcode a lookup table
      ALPHABET.indexOf(c)*CHARSET_SIZE, 0, CHARSET_SIZE, CHARSET_SIZE,
      x + i*(SCALED_SIZE + 1) - ALIGN_OFFSET, y, SCALED_SIZE, SCALED_SIZE
    );
  });
};
