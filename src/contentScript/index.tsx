import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import { buyTweet } from "../solana/bonktweet";
import ContentScript from "./bonkButton";
import { PublicKey } from "@solana/web3.js";
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
    btn.addEventListener("click", async function () {
      var s = document.createElement("script");
      s.src = chrome.runtime.getURL("./script.js");

      s.onload = function () {
        s.remove();
      };
      document.body.appendChild(s);
      document.addEventListener("sendWallet", async function (data: any) {
        console.log(data, "dataaaaaa");

        const bonktweet = await buyTweet(new PublicKey(data.detail));
        console.log(bonktweet, "bonktweet");

        document.dispatchEvent(
          new CustomEvent("getTransaction", { detail: bonktweet })
        );
      });
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
