function wallet() {
  console.log("log from wallet");

  window.phantom.solana
    .connect()
    .then((result) => {
      if (result?.publicKey) {
        document.dispatchEvent(
          new CustomEvent("sendWallet", {
            detail: result.publicKey.toString(),
          })
        );
      }
    })
    .catch((err) => {});
}

wallet();
