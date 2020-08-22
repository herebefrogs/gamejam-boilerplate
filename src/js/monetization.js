// Web Monetization wrapper API

/**
 * Check for Web Monetization support and trigger callback provided to unlock extra content
 * when web monetization has started (e.g. user is confirmed to be a Coil subscriber)
 * @params (*) unlockExtraContent callback to unlock extra content warranted by the web monetization payments
 */
export function checkMonetization(unlockExtraContent) {
  function onMonetizationStart() {
    document.monetization.removeEventListener('monetizationstart', onMonetizationStart);
    unlockExtraContent();
  }

  if (document.monetization) {
    // check if Web Monetization has started
    if (document.monetization.state === 'started') {
      onMonetizationStart();
    // or setup a listener for when Web Monetization has finished starting
    } else if (document.monetization.state === 'pending') {
      document.monetization.addEventListener('monetizationstart', onMonetizationStart);
    }
  }
}