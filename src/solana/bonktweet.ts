import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  AccountMeta,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import { IDL } from "./program-idl";
import { Buffer } from "buffer";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
window.Buffer = Buffer;

export const SOLANA_PROGRAM_ID = new PublicKey(
  "AjWzDnEEKPYvANmYvSsmu7LDfATQjHkfjzK1LMDUQSzR"
);

export const SOLANA_ENDPOINT = "https://api.devnet.solana.com";

export type ITransaction = Transaction;

export const RPC_CONNECTION = new Connection(SOLANA_ENDPOINT, "confirmed");

export const programFactory = () => {
  return new Program(
    IDL,
    SOLANA_PROGRAM_ID,
    new AnchorProvider(RPC_CONNECTION, new NodeWallet(Keypair.generate()), {})
  );
};

export const buyTweet = async (
  wallet: PublicKey,
  tweetId = "1234"
): Promise<Transaction> => {
  const bonkMint = new PublicKey("NTRNt4MmibcfkRHww3Y4WXRwFkXWxLvFXhBJ27YUbVN");

  const program = programFactory();

  const [treasury] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), bonkMint.toBuffer()],
    program.programId
  );
  const [tweet] = PublicKey.findProgramAddressSync(
    [Buffer.from("tweet"), Buffer.from(tweetId)],
    program.programId
  );
  console.log(treasury.toString(), "treasury");
  console.log(tweet.toString(), "tweet");

  let remainingAccounts: AccountMeta[] = [];

  // const buyerBonkAcc = getAssociatedTokenAddressSync(
  //   bonkMint,
  //   new PublicKey(wallet)
  // );

  const [buyerBonkAcc] = PublicKey.findProgramAddressSync(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), bonkMint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const buyerBonkTA = await RPC_CONNECTION.getAccountInfo(buyerBonkAcc);
  console.log("eee213", buyerBonkTA);

  // try {
  //   const tweetAccount = await program.account.tweet.fetch(tweet);
  //   if (tweetAccount.owner) {
  //     const ownerBonkAccount = await getOrCreateAssociatedTokenAccount(
  //       RPC_CONNECTION,
  //       wallet,
  //       bonkMint,
  //       tweetAccount.owner
  //     );
  //     remainingAccounts = [
  //       { pubkey: ownerBonkAccount.address, isSigner: false, isWritable: true },
  //     ];
  //   }
  // } catch (error) {}

  const ix = await program.methods
    .buyTweet(tweetId)
    .accounts({
      tweet,
      buyer: wallet,
      buyerBonkAcc: buyerBonkAcc,
      treasury,
      bonkMint,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    // .remainingAccounts(remainingAccounts)
    .instruction();

  console.log(ix, "ix");

  const tx = new Transaction({
    feePayer: wallet,
    recentBlockhash: (await RPC_CONNECTION.getLatestBlockhash()).blockhash,
  });

  // const newTxMessage = new TransactionMessage({
  //   instructions: [ix],
  //   payerKey: wallet,
  //   recentBlockhash: (await RPC_CONNECTION.getLatestBlockhash()).blockhash,
  // }).compileToV0Message();
  // const tx = new VersionedTransaction(newTxMessage);

  tx.add(ix);
  // console.log(tx, "///tasdsad");

  return tx;
};
