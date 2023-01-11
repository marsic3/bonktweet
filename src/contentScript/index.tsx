import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import ContentScript from "./contentScript";

function init() {
  const appContainer = document.createElement("div");
  if (!appContainer) {
    throw new Error("Cannot find app container");
  }

  const articleList = document.querySelectorAll("article");
  // const root = createRoot(appContainer);

  for (const element of articleList) {
    var btn = document.createElement("button");
    btn.appendChild(document.createTextNode("Bonk tweet"));
    btn.addEventListener("click", function () {
      // this function should catch the window object
      chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
        console.log(response.farewell);
        console.log(window);
      });
    });

    element.appendChild(btn);
  }
  // root.render(<ContentScript />);
}

setTimeout(init, 4000);
