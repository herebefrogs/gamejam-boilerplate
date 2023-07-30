/**
 * Represents the size and position of a rectangle.
 * 
 * NOTE: y axis is going downward (origin in top left corner)
 * like screen, DOM, and canvas, so top is above
 * 
 * @param {*} x top left corner x coordinate
 * @param {*} y top left corner y coordinate
 * @param {*} w width
 * @param {*} h height
 */
export const rect = (x, y, w, h) => ({
  // setters
  x,
  y,
  width: w,
  height: h,
  // readonly, inspired by DOMRect
  get left() { return this.width > 0 ? this.x : this.x + this.width },
  get top() { return this.height > 0 ? this.y : this.y + this.height },
  get right() { return this.width > 0 ? this.x + this.width : this.x },
  get bottom() { return this.height > 0 ? this.y + this.height : this.y },
  // utilities for collision detection
  contains: function(x, y) { return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom },
  intersects: function(r) { return this.left < r.right && r.left < this.right && this.top < r.bottom && r.top < this.bottom },
  intersection: function(r) {
    if (!this.intersects(r)) return rect(0, 0, 0, 0);

    const left = Math.max(this.left, r.left);
    const top = Math.max(this.top, r.top);
    return rect(
      left,
      top,
      Math.min(this.right, r.right) - left,
      Math.min(this.bottom, r.bottom) - top
    )
  },
})
