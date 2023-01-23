import { AnchorWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import { buyTweet } from "../solana/bonktweet";
import {
  AccountMeta,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";

function init() {
  // document.addEventListener("callPhantom", function (data) {
  //   console.log("received", data);
  // });

  window.phantom.solana
    .connect()
    .then((result) => {
      console.log("result", result);

      if (result?.publicKey) {
        document.dispatchEvent(
          new CustomEvent("sendWallet", { detail: result.publicKey.toString() })
        );
        document.addEventListener("getTransaction", async function (data: any) {
          console.log("received", data.detail);
          try {
            const tx = await window.phantom.solana.signAllTransactions([
              data.detail,
            ]);
            console.log(tx, "txxxxx");
          } catch (error) {
            console.log("errror", error);
          }
        });
        // console.log(window.phantom.solana.signAllTransactions());
      }
    })
    .catch((err) => {});
}

init();
