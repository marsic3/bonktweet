import "../assets/tailwind.css";
import { buyTweet } from "../solana/bonktweet";
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
  var wallet;
  const walletScript = document.createElement("script");
  const injectedScript = document.createElement("script");

  walletScript.src = chrome.runtime.getURL("./wallet.js");
  walletScript.onload = function () {
    walletScript.remove();
  };
  document.body.appendChild(walletScript);

  document.addEventListener("sendWallet", function (data: any) {
    wallet = data.detail;
  });

  for (const tweet of articleList) {
    const spanItem = tweet.querySelector(
      "div > div > div > div.css-1dbjc4n.r-18u37iz > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu > div:nth-child(2) > div.css-1dbjc4n > div.css-901oao"
    );
    const listOfSpans = spanItem.querySelectorAll("span");
    for (const spanItem of listOfSpans) {
      console.log(spanItem.textContent, "spanItem");

      if (spanItem.textContent.toLowerCase().includes("bonk")) {
        var btn = document.createElement("button");
        var img = document.createElement("img");
        img.src = chrome.runtime.getURL("./bonkbtn.png");
        img.style.maxWidth = "100px";
        img.style.height = "auto";
        btn.appendChild(img);
        tweet.setAttribute("name", "Bonk");
        const tweetElement = tweet.querySelector(
          "div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t > div > div.css-1dbjc4n.r-18u37iz.r-1q142lx > a"
        );
        let tweetId;
        if (
          tweetElement &&
          tweetElement.outerHTML &&
          tweetElement.outerHTML.match(/\/status\/([0-9]+)/)
        ) {
          tweetId = tweetElement.outerHTML.match(/\/status\/([0-9]+)/)[1];
        }

        btn.addEventListener("click", async function () {
          injectedScript.src = chrome.runtime.getURL("./script.js");

          injectedScript.onload = function () {
            injectedScript.remove();
          };
          document.body.appendChild(injectedScript);

          const bonktweet = (await buyTweet(
            new PublicKey(wallet),
            tweetId
          )) as any;
          document.dispatchEvent(
            new CustomEvent("getTransaction", { detail: bonktweet })
          );
        });
        tweet.appendChild(btn);
        break;
      }
    }
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation: any) {
      if (mutation.type === "childList") {
        if (mutation.target.style.position === "relative") {
          const articleList = document.querySelectorAll("article");
          for (const tweet of articleList) {
            const spanItem = tweet.querySelector(
              "div > div > div > div.css-1dbjc4n.r-18u37iz > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu > div:nth-child(2) > div.css-1dbjc4n > div.css-901oao"
            );
            const listOfSpans = spanItem.querySelectorAll("span");
            for (const spanItem of listOfSpans) {
              if (spanItem.textContent.toLowerCase().includes("bonk")) {
                let button = tweet.querySelector("button");
                if (!button) {
                  var btn = document.createElement("button");
                  var img = document.createElement("img");
                  img.src = chrome.runtime.getURL("./bonkbtn.png");
                  img.style.maxWidth = "100px";
                  img.style.height = "auto";
                  btn.appendChild(img);
                  tweet.setAttribute("name", "Bonk");
                  const tweetElement = tweet.querySelector(
                    "div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t > div > div.css-1dbjc4n.r-18u37iz.r-1q142lx > a"
                  );
                  let tweetId;
                  if (
                    tweetElement &&
                    tweetElement.outerHTML &&
                    tweetElement.outerHTML.match(/\/status\/([0-9]+)/)
                  ) {
                    tweetId =
                      tweetElement.outerHTML.match(/\/status\/([0-9]+)/)[1];
                  }

                  btn.addEventListener("click", async function () {
                    injectedScript.src = chrome.runtime.getURL("./script.js");

                    injectedScript.onload = function () {
                      injectedScript.remove();
                    };
                    document.body.appendChild(injectedScript);

                    const bonktweet = (await buyTweet(
                      new PublicKey(wallet),
                      tweetId
                    )) as any;
                    document.dispatchEvent(
                      new CustomEvent("getTransaction", { detail: bonktweet })
                    );
                  });
                  tweet.appendChild(btn);
                  break;
                }
              }
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
