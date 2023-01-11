import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import React, { FC, useCallback } from "react";

export const About: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    const lamports = await connection.getMinimumBalanceForRentExemption(0);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports,
      })
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, {
      minContextSlot,
    });

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
  }, [publicKey, sendTransaction, connection]);

  return (
    <button onClick={onClick} disabled={!publicKey}>
      Send SOL to a random address!
    </button>
  );
};

// import React from "react";
// import { createRoot } from "react-dom/client";
// import "../assets/tailwind.css";
// import ContentScript from "./contentScript";

// function init() {
//   const appContainer = document.createElement("div");
//   if (!appContainer) {
//     throw new Error("Cannot find app container");
//   }

//   const articleList = document.querySelectorAll("article");
//   const root = createRoot(appContainer);

//   for (const element of articleList) {
//     var btn = document.createElement("button");
//     btn.appendChild(document.createTextNode("Bonk tweet"));
//     btn.addEventListener("click", function () {
//       console.log(window);
//     });
//     element.appendChild(btn);
//     // element.innerHTML = `${element.innerHTML}${btn}`;
//     element.style.color = "white";
//   }
//   root.render(<ContentScript />);
// }

// setTimeout(init, 4000);
