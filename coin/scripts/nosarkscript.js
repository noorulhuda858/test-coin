import { ethers } from "ethers";

const abi = await import("./abi.json", { assert: { type: "json" } });

const contractaddress = "0x6eaea0a5c1c0bc83b1b648d95f19c5907daea912";
const privatekey =
  "744b6a3085083b848b7d84cbfb6c656549e39f9ef5d39f5c21e772cbeec23119";
const provider = new ethers.JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);
const signer = new ethers.Wallet(privatekey, provider);
const contract = new ethers.Contract(contractaddress, abi, signer);

export async function calling() {
  try {
    console.log("before calling");
    const ethValue = "0.00001"; // Ether value as a string
    const weiValue = ethers.parseUnits(ethValue, "ether"); // Convert to wei
    const finalsupply = await contract.initialsupply(weiValue); // Pass the wei value
    console.log("finalsupply", finalsupply);
    console.log("after calling");
  } catch (error) {
    console.error("Error calling initialsupply:", error);
  }
}

document
  .getElementById("callFunctionButton")
  .addEventListener("click", calling);
