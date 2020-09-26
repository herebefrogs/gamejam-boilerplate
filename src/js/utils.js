export function rand(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export function choice(values) {
  return values[rand(0, values.length - 1)];
};

/**
 * Return a value between min and max based on current time in range [0...1]
 * @param {*} min min value
 * @param {*} max max value
 * @param {*} t current time in range [0...1]
 */
export function lerp(min, max, t) {
  if (t < 0) return min;
  if (t > 1) return max;
  return min * (1 - t) + max * t;
}

/**
 * Return a value from an array of values based on current time in range [0...1]
 * @param {*} values array of values to pick from
 * @param {*} t current time in range [0...1], mapped to an index in values
 */
export function lerpArray(values, t) {
  if (t < 0) return values[0];
  if (t > 1) return values[values.length - 1];

  return values[Math.floor((values.length - 1) * t)];
}

/**
 * Return a value between the values of an array based on current time in range [0...1]
 * @param {*} values array of values to pick from
 * @param {*} t current time in range [0...1], mapped to an index in values
 */
export function smoothLerpArray(values, t) {
  if (t <= 0) return values[0];
  if (t >= 1) return values[values.length - 1];

  const start = Math.floor((values.length - 1) * t);
  const min = values[start];
  const max = values[Math.ceil((values.length - 1) * t)];
  // t * number of intervals - interval start index
  const delta = t * (values.length - 1) - start;
  return lerp(min, max, delta);
}