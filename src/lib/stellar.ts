import { Horizon, Networks, TransactionBuilder, Operation, Asset, Memo } from "@stellar/stellar-sdk";

const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

export const server = new Horizon.Server(HORIZON_URL);
export const networkPassphrase = NETWORK;

/** Fetch XLM balance for an account */
export async function getXLMBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey);
  const xlm = account.balances.find((b) => b.asset_type === "native");
  return xlm?.balance ?? "0";
}

/** Submit a signed XDR transaction */
export async function submitTx(signedXDR: string) {
  const tx = TransactionBuilder.fromXDR(signedXDR, NETWORK);
  return server.submitTransaction(tx);
}

/** Sign a transaction via Freighter */
export async function signWithFreighter(xdr: string): Promise<string> {
  if (typeof window === "undefined" || !window.freighter) {
    throw new Error("Freighter not installed");
  }
  return window.freighter.signTransaction(xdr, { network: "TESTNET" });
}

/** Build a simple XLM payment for P2P settlement */
export async function buildPayment(from: string, to: string, xlmAmount: string, memo?: string) {
  const account = await server.loadAccount(from);
  const fee = await server.fetchBaseFee();
  const builder = new TransactionBuilder(account, { fee: String(fee), networkPassphrase: NETWORK })
    .addOperation(Operation.payment({ destination: to, asset: Asset.native(), amount: xlmAmount }))
    .setTimeout(180);
  if (memo) builder.addMemo(Memo.text(memo));
  return builder.build().toXDR();
}
