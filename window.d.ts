import { Provider } from "@project-serum/anchor";

interface xNFTInterface extends Provider {
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  signAllTransactions<T>(transactions: T[]): Promise<T[]>;
  signTransaction<T>(transaction: T): Promise<T>;
}

declare global {
  interface Window {
    xnft: xNFTInterface;
  }
}
