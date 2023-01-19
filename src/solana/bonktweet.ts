import { programFactory, RPC_CONNECTION } from "./utilities";
import { sendTransaction } from "./transactions/sendTransaction";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
// import * as anchor from "@project-serum/anchor";

// console.log("ee22");
// console.log("ee");

export const buyTweet = async (wallet, tweetId) => {
  console.log(wallet);
  console.log(tweetId);
  // const bonkMint = new PublicKey("NTRNt4MmibcfkRHww3Y4WXRwFkXWxLvFXhBJ27YUbVN");
  // console.log(bonkMint);

  // anchor.workspace.getToken
  // const program = programFactory(wallet);
  // console.log(program);
  // console.log(bonkMint);

  // const [treasury] = PublicKey.findProgramAddressSync(
  //   [Buffer.from("treasury"), bonkMint.toBuffer()],
  //   program.programId
  // );
  // const [tweet] = PublicKey.findProgramAddressSync(
  //   [Buffer.from("tweet"), Buffer.from(tweetId)],
  //   program.programId
  // );
  // let remainingAccounts;
  // const tweetAccount = await program.account.tweet.fetch(tweet);
  // const buyerBonkAcc = await getOrCreateAssociatedTokenAccount(
  //   RPC_CONNECTION,
  //   wallet,
  //   bonkMint,
  //   wallet.publicKey
  // );
  // if (tweetAccount.owner) {
  //   const ownerBonkAccount = await getOrCreateAssociatedTokenAccount(
  //     RPC_CONNECTION,
  //     wallet,
  //     bonkMint,
  //     tweetAccount.owner
  //   );
  //   remainingAccounts = [
  //     { pubkey: ownerBonkAccount, isSigner: false, isWritable: true },
  //   ];
  // }
  // await program.methods
  //   .buyTweet(tweetId)
  //   .accounts({
  //     tweet,
  //     buyer: wallet.publicKey,
  //     buyerBonkAcc: buyerBonkAcc.address,
  //     treasury,
  //     bonkMint,
  //     systemProgram: SystemProgram.programId,
  //     tokenProgram: TOKEN_PROGRAM_ID,
  //   })
  //   .remainingAccounts(remainingAccounts)
  //   .signers([wallet])
  //   .rpc();
};
