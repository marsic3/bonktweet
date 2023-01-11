// // chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
// //   console.log(msg);
// //   console.log(sender);
// //   sendResponse("Front the background Script");
// // });
// // background.js
// chrome.action.onClicked.addListener((tab) => {
//   console.log("executed", window);

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["contentScript.js"],
//   });
// });
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  sendResponse({ farewell: "goodbye" });
  console.log(request);
  console.log(sender);
});
