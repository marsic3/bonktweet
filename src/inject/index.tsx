import { ITransaction } from "../solana/bonktweet";

interface MyTransaction {
  detail: ITransaction;
}

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
          const trx: ITransaction = data.detail;
          console.log("dsaas", trx);
          try {
            const tx = await window.phantom.solana.signTransaction(trx);
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
