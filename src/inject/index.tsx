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
  window.phantom.solana
    .connect()
    .then((result) => {
      if (result?.publicKey) {
        const wallet: AnchorWallet = {
          publicKey: result?.publicKey,
          signTransaction: () => window.phantom.solana.signTransaction(),
          signAllTransactions: () =>
            window.phantom.solana.signAllTransactions(),
        };
        console.log(new PublicKey("dsds"));

        buyTweet(wallet, "123");
        // window.phantom.solana.signAllTransactions(result);
        // console.log(window.phantom.solana.signAllTransactions());
      }
    })
    .catch((err) => {});
}

init();
