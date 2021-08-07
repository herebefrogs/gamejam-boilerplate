// Web Monetization wrapper API

let monetizationEnabled = false;
let paid = 0;
let currency = '';


export const isMonetizationEnabled = () => monetizationEnabled;

export const monetizationEarned = () => `${Math.round(paid * 1000000000) / 1000000000} ${currency.toLowerCase()}`;

function disableMonetization() {
  // flag monetization as active
  monetizationEnabled = false;
}

function enableMonetization() {
  // flag monetization as active
  monetizationEnabled = true;
}

function paymentCounter({ detail }) {
  enableMonetization();
  paid += detail.amount / Math.pow(10, detail.assetScale);
  currency = detail.assetCode;
}

/**
 * Check for Web Monetization support and trigger the provided callback function
 * when web monetization has started (e.g. user is confirmed to be a Coil subscriber)
 */
export function checkMonetization() {
  if (document.monetization) {
    // check if Web Monetization has started
    if (document.monetization.state === 'started') {
      enableMonetization();
    };

    // setup a listener for when Web Monetization has finished starting
    document.monetization.addEventListener('monetizationstart', enableMonetization);
    document.monetization.addEventListener('monetizationprogress', paymentCounter);
    document.monetization.addEventListener('monetizationstop', disableMonetization);
  }
}
