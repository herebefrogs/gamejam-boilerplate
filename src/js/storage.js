// Storage wrapper API

/**
 * Save a value in localStorage under a key, automatically prefixed by the JS13KGAMES year and game title (hardcoded)
 * @params {*} key to save value under
 * @params {*} value to save
 */
export const save = (key, value) => localStorage.setItem(`2020.workingTitle.${key}`, value);

/**
 * Retrieve a value in localStorage from its key, automatically prefixed by the JS13KGAMES year and game title (hardcoded)
 * @params {*} key to load value from
 */
export const load = key => localStorage.getItem(`2020.workingTitle.${key}`);
