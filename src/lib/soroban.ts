import { Contract, rpc, TransactionBuilder, Networks, scValToNative, nativeToScVal } from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";
const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

export const sorobanClient = new rpc.Server(RPC_URL, { allowHttp: false });

async function simulateContractCall(
  caller: string,
  contractId: string,
  method: string,
  args: ReturnType<typeof nativeToScVal>[]
) {
  const account = await sorobanClient.getAccount(caller);
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, { fee: "1000000", networkPassphrase: NETWORK })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();
  const simResult = await sorobanClient.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(simResult.error);
  }
  return { simResult, tx };
}

/** Mint kWh tokens for a producer */
export async function mintEnergyCredits(caller: string, kWh: number) {
  const contractId = process.env.NEXT_PUBLIC_ENERGY_TOKEN_CONTRACT!;
  return simulateContractCall(caller, contractId, "mint", [
    nativeToScVal(caller, { type: "address" }),
    nativeToScVal(BigInt(kWh * 1000), { type: "i128" }),
  ]);
}

/** List energy credits on marketplace contract */
export async function createListing(caller: string, kWh: number, pricePerKWhStroops: bigint) {
  const contractId = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!;
  return simulateContractCall(caller, contractId, "create_listing", [
    nativeToScVal(caller, { type: "address" }),
    nativeToScVal(BigInt(kWh * 1000), { type: "i128" }),
    nativeToScVal(pricePerKWhStroops, { type: "i128" }),
  ]);
}

/** Initiate a buy — locks XLM in escrow */
export async function buyListing(caller: string, listingId: string, kWh: number) {
  const contractId = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT!;
  return simulateContractCall(caller, contractId, "buy_listing", [
    nativeToScVal(listingId, { type: "string" }),
    nativeToScVal(caller, { type: "address" }),
    nativeToScVal(BigInt(kWh * 1000), { type: "i128" }),
  ]);
}

/** Retire (burn) consumed energy credits */
export async function retireCredits(caller: string, kWh: number) {
  const contractId = process.env.NEXT_PUBLIC_ENERGY_TOKEN_CONTRACT!;
  return simulateContractCall(caller, contractId, "retire", [
    nativeToScVal(caller, { type: "address" }),
    nativeToScVal(BigInt(kWh * 1000), { type: "i128" }),
  ]);
}

/** Read token balance in kWh */
export async function getTokenBalance(caller: string, address: string): Promise<number> {
  const contractId = process.env.NEXT_PUBLIC_ENERGY_TOKEN_CONTRACT!;
  const { simResult } = await simulateContractCall(caller, contractId, "balance", [
    nativeToScVal(address, { type: "address" }),
  ]);
  if (!rpc.Api.isSimulationSuccess(simResult) || !simResult.result) return 0;
  const raw = scValToNative(simResult.result.retval) as bigint;
  return Number(raw) / 1000;
}
