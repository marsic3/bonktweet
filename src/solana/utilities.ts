import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { IDL } from "./program-idl";
import { Buffer } from "buffer";
window.Buffer = Buffer;

export const SOLANA_PROGRAM_ID = new PublicKey(
  process.env.REACT_APP_BONK_TWEET_PROGRAM_ID as string
);

export const SOLANA_ENDPOINT = process.env.REACT_APP_RPC as string;

export const RPC_CONNECTION = new Connection(SOLANA_ENDPOINT, "confirmed");

export const programFactory = (wallet: AnchorWallet) => {
  return new Program(
    IDL,
    SOLANA_PROGRAM_ID,
    new AnchorProvider(RPC_CONNECTION, wallet, {})
  );
};
