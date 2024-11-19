import { ethers } from "ethers";
import abi from "./abi.json" assert { type: "json" };

//console.log("ABI structure:", abi);
const contractaddress = "0x4781b344c1441dbFBAba2b2E85ba4eb7901D5fE7";
const privatekey =
  "744b6a3085083b848b7d84cbfb6c656549e39f9ef5d39f5c21e772cbeec23119";
const provider = new ethers.JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);
const signer = new ethers.Wallet(privatekey, provider);
const contract = new ethers.Contract(contractaddress, abi.abi, signer);

export async function minting() {
  try {
    const totalSupply = await contract.totalSupply();
    console.log("Total Supply:", ethers.formatUnits(totalSupply, "ether"));
    const userBalance = await contract.balanceOf(signer.address);
    console.log("User Balance:", ethers.formatUnits(userBalance, "ether"));
    const mintLimit = await contract.mint_limit;
    console.log("Mint Limit:", ethers.formatUnits(mintLimit, "ether"));
    const maxSupply = await contract.MAX_SUPPLY();
    console.log("Max Supply:", ethers.formatUnits(maxSupply, "ether"));
    const penaltyBalance = await contract.penaltybalances(signer.address);
    console.log("Penalty Balance:", ethers.formatUnits(penaltyBalance, "ether"));
    console.log("Starting minting process...");

    const ethValue = "0.00001"; // Ether value to mint
    const weivalue = ethers.parseUnits(ethValue, "ether"); // Convert to wei

    // Initiating mint transaction
    const AfterMint = await contract.mint(weivalue, { gasLimit: 500000 });
    console.log("Transaction sent. Hash:", AfterMint.hash);

    // Waiting for the transaction to be mined
    const receipt = await AfterMint.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Minting completed successfully!");

  } catch (error) {
    console.error("Error during minting:", error);
  }
}
export async function penalty(){
  try {
    console.log("paying penalty");
    const penaltyValue = ethers.parseUnits("0.001", "ether");
    const penaltyTransaction = await contract.payPenalty({ value: penaltyValue });
    console.log("Penalty Transaction now", penaltyTransaction);
  } catch (error) {
    console.error("Error Calling Penalty function", error);
  }
}
export async function maxsupply()
{
  try {
    console.log("Max Supply now..");
    const maxSupply = await contract.MAX_SUPPLY();
    console.log("Max Supply now :",maxSupply.toString());
  }
  catch {
    console.error("Max_Supply error calling", error);
  }
}

export async function newsupply(){
  try {
    const newSupply = ethers.parseUnits("200000","ether");
    console.log ("Setting new max supply...");
    const setmaxSupplyTx = await contract.SetMaxSupply(newSupply);
    await setmaxSupplyTx.wait();
    console.log("Max supply updated successfully:", newSupply.toString());
  }
  catch (error) {
    console.error("Error calling SetMaxSupply:", error);
  }
}

//minting();
//penalty();
//maxsupply();
//newsupply();