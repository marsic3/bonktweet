// todo this logic should catch event window
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  sendResponse({ farewell: "goodbye" });
  console.log(request);
  console.log(sender);
});
