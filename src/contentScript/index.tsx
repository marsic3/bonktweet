import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import ContentScript from "./bonkButton";

declare global {
  interface Window {
    phantom: any;
    foo: any;
  }
}

function init() {
  const articleList = document.querySelectorAll("article");
  const articleContainer = document.querySelector(
    "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div"
  );

  for (const tweet of articleList) {
    var btn = document.createElement("button");
    btn.appendChild(document.createTextNode("Bonk tweet"));
    btn.style.color = "white";
    tweet.setAttribute("name", "Bonk");
    btn.addEventListener("click", function () {
      var s = document.createElement("script");
      s.src = chrome.runtime.getURL("./script.js");
      s.onload = function () {
        s.remove();
      };
      document.body.appendChild(s);
      var solana = document.createElement("script");
      solana.src = chrome.runtime.getURL(
        "https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"
      );
      solana.onload = function () {
        solana.remove();
      };
      document.body.appendChild(solana);
    });
    // const root = createRoot(tweet);
    // root.render(<ContentScript />);
    tweet.appendChild(btn);
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        // @ts-ignore
        if (mutation.target.style.position === "relative") {
          const articleList = document.querySelectorAll("article");
          for (const tweet of articleList) {
            let button = tweet.querySelector("button");
            if (!button) {
              var btn = document.createElement("button");
              btn.appendChild(document.createTextNode("Bonk tweet"));
              btn.style.color = "white";
              tweet.setAttribute("name", "Bonk");
              btn.addEventListener("click", function () {
                var s = document.createElement("script");
                s.src = chrome.runtime.getURL("./script.js");
                s.onload = function () {
                  s.remove();
                };
                document.body.appendChild(s);
              });
              tweet.appendChild(btn);
            }
          }
        }
      }
    });
  });
  var config = { attributes: false, childList: true, subtree: true };
  observer.observe(articleContainer, config);
}

setTimeout(init, 4000);
