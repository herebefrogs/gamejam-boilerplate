/**
 * Return how many world/CSS units are visible on screen, derived from
 * physical pixels rather than raw innerWidth/innerHeight.
 *
 * Mobile browsers disagree on devicePixelRatio for the identical physical
 * screen (e.g. on the same 1080-physical-px-wide phone, Chrome may report
 * dpr=2.625 -> innerWidth 411, Firefox dpr=4 -> innerWidth 270), so a
 * viewport sized off innerWidth/innerHeight alone shows meaningfully less
 * content in one browser than another on the same device. innerWidth*dpr
 * is the device's physical pixel width, which both browsers agree on, so
 * deriving the viewport from physical pixels cancels the disagreement.
 *
 * Only relevant to a game that adapts its viewport to the device (unlike
 * this boilerplate's default fixed-resolution BUFFER scaled to fit, see
 * onresize() in game.js, which never touches devicePixelRatio).
 *
 * @param {Number} pxPerUnit - physical pixels per world/CSS unit, project-chosen
 * @returns {[Number, Number]} [width, height] in world/CSS units
 */
export function viewportSize(pxPerUnit) {
  return [
    innerWidth * devicePixelRatio / pxPerUnit,
    innerHeight * devicePixelRatio / pxPerUnit
  ];
}
