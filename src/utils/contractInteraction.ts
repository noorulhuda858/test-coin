import { ethers, JsonRpcSigner } from "ethers";
import { JsonRpcAccount } from "viem";
import abi from "./abi.json";

const contractAddress = "0x6eaea0a5c1c0bc83b1b648d95f19c5907daea912";

async function initializeContract(signer: JsonRpcSigner) {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  return contract;
}

export const convertToWei = (amountInEther: string | number): bigint => {
  const etherString = amountInEther.toString();
  const weiValue = ethers.parseEther(etherString);
  return weiValue;
};

// Number 10000000000000 Overflow

// BIgint 10000000000000000000000 => {hex: 'a12ha'}
export async function calling(amountInEther: number, signer: JsonRpcSigner) {
  try {
    const amountInWei = convertToWei(amountInEther);
    console.log(`Amount in Wei: ${amountInWei}`);
    console.log("before calling");

    const contract = await initializeContract(signer);
    console.log("amountInWei in string", amountInWei.toString());
    console.log("amountInWei in real", amountInWei);

    // Assuming `initialsupply` is the mint function
    const transactionResponse = await contract.initialsupply(amountInWei); // Pass the wei value
    console.log("Transaction sent, waiting for confirmation...");

    // Wait for the transaction to be mined
    const receipt = await transactionResponse.wait();
    console.log("Transaction confirmed:", receipt);

    //Check for mint event in the receipt logs
    const mintEvent = receipt.events?.find(
      (event: any) => event.event === "Mint"
    );
    if (mintEvent) {
      console.log("Mint event detected:", mintEvent);
    } else {
      console.log("Mint event not detected.");
    }

    console.log("after calling");
  } catch (error) {
    console.error("Error calling initialsupply:", error);
  }
}
