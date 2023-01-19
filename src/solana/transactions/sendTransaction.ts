import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  Commitment,
  Connection,
  Keypair,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { RPC_CONNECTION } from "../utilities";

const DEFAULT_TIMEOUT = 30000;

export function getUnixTs() {
  return new Date().getTime() / 1000;
}

export const sleep = (ttl: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ttl));

export async function sendTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
  sendingMessage = "Sending transaction...",
  errorMessage = "Transaction failed",
  timeout = DEFAULT_TIMEOUT,
}: {
  transaction: Transaction;
  wallet: AnchorWallet;
  signers?: Array<Keypair>;
  connection: Connection;
  sendingMessage?: string;
  errorMessage?: string;
  timeout?: number;
}) {
  if (!wallet.publicKey) throw new Error("Wallet not connected!");
  const accountInfo = await RPC_CONNECTION.getParsedAccountInfo(
    wallet.publicKey
  );
  if (!accountInfo.value) throw new Error("You do not have enough SOL.");

  return await sendSignedTransaction({
    signedTransaction: transaction,
    connection,
    sendingMessage,
    errorMessage,
    timeout,
  });
}

/** Copy of Connection.simulateTransaction that takes a commitment parameter. */
export async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  console.log("simulating transaction", transaction);

  const signData = transaction.serializeMessage();

  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString("base64");

  console.log("encoding");
  const config: any = { encoding: "base64", commitment };
  const args = [encodedTransaction, config];
  console.log("simulating data", args);

  // @ts-ignore
  const res = await connection._rpcRequest("simulateTransaction", args);

  console.log("res simulating transaction", res);
  if (res.error) {
    throw new Error("failed to simulate transaction: " + res.error.message);
  }
  return res.result;
}

/**
 * Sends signed transaction
 * @param param0
 * @returns
 */
export async function sendSignedTransaction({
  signedTransaction,
  connection,
  timeout = DEFAULT_TIMEOUT,
  errorMessage,
}: {
  signedTransaction: Transaction;
  connection: Connection;
  sendingMessage?: string;
  sentMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  timeout?: number;
}): Promise<{ txid: string; slot: number }> {
  const rawTransaction = signedTransaction.serialize();
  const startTime = getUnixTs();
  let slot = 0;
  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    }
  );

  console.log("Started awaiting confirmation for", txid);

  let done = false;
  (async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });
      await sleep(500);
    }
  })();
  try {
    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      timeout,
      connection,
      "confirmed",
      true
    );

    if (confirmation.err) {
      console.error(confirmation.err);
      throw new Error("Transaction failed: Custom instruction error");
    }

    slot = confirmation?.slot || 0;
  } catch (error) {
    if (error instanceof Object && error.hasOwnProperty("timeout")) {
      throw new Error("Timed out awaiting confirmation on transaction");
    }
    let simulateResult: SimulatedTransactionResponse | null = null;
    try {
      simulateResult = (
        await RPC_CONNECTION.simulateTransaction(signedTransaction)
      ).value;
    } catch (e) {}

    throw new Error("Transaction failed" + txid);
  } finally {
    done = true;
  }

  console.log("Latency", txid, getUnixTs() - startTime);
  return { txid, slot };
}
/**
 * Awaits for confirmation of transaction signature
 *
 * @param txid
 * @param timeout
 * @param connection
 * @param commitment
 * @param queryStatus
 * @returns
 */
async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection,
  commitment: Commitment = "confirmed",
  queryStatus = false
) {
  let done = false;
  let status: SignatureStatus | null = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  await new Promise((resolve, reject) => {
    const fn = async () => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        reject({ timeout: true });
      }, timeout);
      try {
        subId = connection.onSignature(
          txid,
          (result, context) => {
            done = true;
            status = {
              err: result.err,
              slot: context.slot,
              confirmations: 0,
            };
            if (result.err) {
              console.log("Rejected via websocket", result.err);
              reject(result.err);
            } else {
              console.log("Resolved via websocket", result);
              resolve(result);
            }
          },
          commitment
        );
      } catch (e) {
        done = true;
        console.error("WS error in setup", txid, e);
      }
      while (!done && queryStatus) {
        // eslint-disable-next-line no-loop-func
        const fn = async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ]);
            status = signatureStatuses && signatureStatuses.value[0];
            if (!done) {
              if (!status) {
                console.log("REST null result for", txid, status);
              } else if (status.err) {
                console.log("REST error for", txid, status);
                done = true;
                reject(status.err);
              } else if (!status.confirmations) {
                console.log("REST no confirmations for", txid, status);
              } else {
                console.log("REST confirmation for", txid, status);
                if (status.confirmationStatus === "confirmed") {
                  done = true;
                  resolve(status);
                }
              }
            }
          } catch (e) {
            if (!done) {
              console.log("REST connection error: txid", txid, e);
            }
            throw e;
          }
        };
        await fn();
        await sleep(2000);
      }
    };
    fn();
  })
    .catch((err) => {
      if (err.timeout && status) {
        status.err = { timeout: true };
      }

      connection.removeSignatureListener(subId);
      throw err;
    })
    .then((_) => {
      connection.removeSignatureListener(subId);
    });
  done = true;
  return status;
}
