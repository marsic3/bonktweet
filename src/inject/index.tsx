import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { ITransaction } from "../solana/bonktweet";

interface MyTransaction {
  detail: ITransaction;
}

function init() {
  window.phantom.solana
    .connect()
    .then((result) => {
      if (result?.publicKey) {
        document.dispatchEvent(
          new CustomEvent("sendWallet", { detail: result.publicKey.toString() })
        );
        document.addEventListener("getTransaction", async function (data: any) {
          try {
            const serializedMessage = data.detail;
            console.log(serializedMessage, "SM");
            const signedTransactions = await window.phantom.solana.request({
              method: "signAndSendTransaction",
              params: { message: serializedMessage },
            });
            console.log(signedTransactions, "STX");
          } catch (error) {
            console.log("errror", error);
          }
        });
      }
    })
    .catch((err) => {});
}

init();
