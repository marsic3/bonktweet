import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  AccountMeta,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import { IDL } from "./program-idl";
import { Buffer } from "buffer";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
window.Buffer = Buffer;
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

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

export const buyTweet = async (wallet: PublicKey, tweetId = "1234") => {
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

  let remainingAccounts: AccountMeta[] = [];

  const [buyerBonkAcc] = PublicKey.findProgramAddressSync(
    [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), bonkMint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const tx = new Transaction({
    feePayer: wallet,
    recentBlockhash: (await RPC_CONNECTION.getLatestBlockhash()).blockhash,
  });

  try {
    const tweetAccount = await program.account.tweet.fetch(tweet);
    if (tweetAccount.owner) {
      const [sellerTokenAcc] = PublicKey.findProgramAddressSync(
        [
          tweetAccount.owner.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          bonkMint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const sellerAcc = await RPC_CONNECTION.getAccountInfo(sellerTokenAcc);
      if (!sellerAcc.data) {
        const ownerBonkAccount = createAssociatedTokenAccountInstruction(
          wallet,
          tweetAccount.owner,
          wallet,
          bonkMint
        );
        tx.add(ownerBonkAccount);
      }
      remainingAccounts = [
        { pubkey: sellerTokenAcc, isSigner: false, isWritable: true },
      ];
    }
  } catch (error) {}

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
    .remainingAccounts(remainingAccounts)
    .instruction();

  tx.add(ix);

  const simulateTx = await RPC_CONNECTION.simulateTransaction(tx);
  console.log(simulateTx, "SIM TX");

  return bs58.encode(tx.serializeMessage());
};
