import { ethers, JsonRpcSigner } from "ethers";
import { JsonRpcAccount } from "viem";
import abi from "./abi.json" 

const contractAddress = "0x4781b344c1441dbFBAba2b2E85ba4eb7901D5fE7";

async function initializeContract(signer: JsonRpcSigner) {
  const contract = new ethers.Contract(contractAddress, abi.abi, signer);
  return contract;
}

export const convertToWei = (amountInEther: string | number): bigint => {
  const etherString = amountInEther.toString();
  const weiValue = ethers.parseEther(etherString);
  return weiValue;
};

// Number 10000000000000 Overflow

// BIgint 10000000000000000000000 => {hex: 'a12ha'}
export async function callingmint(
  amountInEther: number,
  signer: JsonRpcSigner
) {
  try {
    const amountInWei = convertToWei(amountInEther);
    console.log(`Amount in Wei: ${amountInWei}`);
    console.log("before calling");

    const contract = await initializeContract(signer);
    console.log("amountInWei in string", amountInWei.toString());
    console.log("amountInWei in real", amountInWei);

    const mintResponse = await contract.mint(amountInWei); // Pass the wei value
    console.log("Mint in process, waiting for confirmation...");

    // Wait to be mined
    const receipt = await mintResponse.wait();
    console.log("Mint confirmed:", receipt);

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
    console.error("Error calling Mint:", error);
  }
}
export async function callingPayPenalty(
  amountInEther: number,
  signer: JsonRpcSigner
) {
  if (signer) {
    try {
      const contract = await initializeContract(signer); // Function to initialize contract
      const penaltyFee = ethers.parseEther("0.001"); // Penalty fee in Ether
      const transaction = await contract.payPenalty({
        value: penaltyFee, // Sending Ether
        gasLimit: 500000, // Optional gas limit
      });

      console.log("Pay penalty transaction sent:", transaction.hash);
      await transaction.wait();
      alert("Penalty paid successfully! Your minting limit has increased.");
    } catch (error) {
      console.error("Penalty payment failed:", error);
      alert("Failed to pay the penalty. Please try again.");
    }
  } else {
    alert("Please connect your wallet first.");
  }
}
