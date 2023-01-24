function init() {
  try {
    document.addEventListener("getTransaction", async function (data: any) {
      try {
        const serializedMessage = data.detail;
        const signedTransactions = await window.phantom.solana.request({
          method: "signAndSendTransaction",
          params: { message: serializedMessage },
        });
        alert("Congrats you bought tweet with bonk successefully");
      } catch (error) {
        console.log("errror", error);
        alert("Fail to bonk tweet");
      }
    });
  } catch (error) {}
}

init();
