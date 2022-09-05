/**
 * Share data with other apps. Invoke native sharing mechanisms first,
 * and fallback to Twitter sharing (text+url only) if not available
 * 
 * @param {*} data data to be shared, formatted like
 * the data attribute of Web Share API's share() function
 * (title:, text:, url:, files:)
 */
export const share = async (data) => {
  if (navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data);
    } catch {
      // silencio Bruno!
    }
  } else {
    // twitter only
    open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`, '_blank');
  }
}