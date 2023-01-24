function init() {
  try {
    document.addEventListener("getTransaction", async function (data: any) {
      try {
        console.log("getTransaction");

        const serializedMessage = data.detail;
        console.log(serializedMessage, "SM");
        const signedTransactions = await window.phantom.solana.request({
          method: "signAndSendTransaction",
          params: { message: serializedMessage },
        });
        console.log(signedTransactions, "STX");
        alert("Congrats you bought tweet with bonk successefully");
      } catch (error) {
        console.log("errror", error);
        alert("Fail to bonk tweet");
      }
    });
  } catch (error) {}
}

init();
