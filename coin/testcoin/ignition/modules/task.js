const { ethers } = require("ethers");
//const fs = require ('fs');

const abi = require("../../../scripts/abi.json");

const contractaddress = "0x6eAEA0a5c1C0Bc83b1b648d95F19c5907DAea912";
const privatekey  =  "744b6a3085083b848b7d84cbfb6c656549e39f9ef5d39f5c21e772cbeec23119";
const privatekey1 = "a372a1909eb02576273d12aefb4c72f1177f1967b6b5819b764565ebde175cb4";
const privatekey2 = "3cea089c9a4e4310e73d2501b49a7b656e6cb171f28700826e57e27babc51f58";
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
const owner = new ethers.Wallet(privatekey, provider); 
const Signer1 = new ethers.Wallet(privatekey1, provider);
const signer2 = new ethers.Wallet(privatekey2, provider);  
const contract = new ethers.Contract(contractaddress, abi,owner);
async function sendtoken(toAddress, amount) {
  try {
    console.log("before transfer");
    const tx = await contract.transfer(
      toAddress,
      ethers.parseUnits(amount.toString(), 18)
    );
    const receipt = await tx.wait();
    console.log("after transfer",receipt);
  } catch (error) {
    console.error("Error sending tokens:", error);
  }
}
async function MintWithPenalty(amount) {
  try {
    console.log("Step 1: paying penalty...");
    const penaltyFee = await contract.penaltyfee(); 
    const txPayPenalty = await contract.payPenalty({ value: penaltyFee }); 
    console.log("Penalty paid successfully.");

    console.log("Step 2: Minting tokens...");
    const txMint = await contract.mint(ethers.parseUnits(amount.toString(), 18)); // Mint tokens
    const receiptMint = await txMint.wait(); // Wait for the mint transaction to be confirmed
    console.log(`Successfully minted ${amount} tokens.`, receiptMint);
  } catch (error) {
    console.error("Error during minting with penalty:", error);
  }
}
async function showbalance(address){
try{
  //const contract = new ethers.Contract(contractaddress, abi,provider);
  console.log("before displaying");
  const account=await contract.balanceOf(address);
  console.log("account",account);
  const formattedbalance = ethers.formatUnits(account,18);
  console.log("after displaying",formattedbalance);
  return formattedbalance;
}catch (error) {
  console.error("Error Displaying:", error);
}
}
//ERC20 approve method. This method enables you to specify how many tokens the other user (or contract) can transfer on your behalf.
async function approveuser(toAddress,amount){
  try{
    console.log("before approving");
    const accessto = await contract.approve(toAddress,amount);
    const receipt = await accessto.wait();
    console.log("after approving",receipt);
  }catch (error){
    console.error("Error Approving:", error);
  }
}
/*async function calling(){
  console.log("before calling");
  const weivalue = 10000000000000;
  const ethervalue = ethers.formatEther(weivalue,18);
  const finalsupply = await contract.initialsupply(ethervalue);
  console.log("finalsupply",finalsupply);  
  console.log("after calling");
}*/
export async function calling() {
  try {
    console.log("before calling");
    const ethValue = "1"; // Ether value as a string
    const weiValue = ethers.parseUnits(ethValue, "ether"); // Convert to wei
    const finalsupply = await contract.initialsupply(weiValue); // Pass the wei value
    const totalsupply = await contract._totalsupply();
    const mybalance = await showbalance(signer.address);
    console.log("finalsupply", ethers.formatUnits(totalsupply,18));
    console.log("mybalance",mybalance);
    console.log("after calling");
  } catch (error) {
    console.error("Error calling initialsupply:", error);
  }
}
calling();
//balanceof,approve,
//showbalance('0xc15cE62eF504BA013c40b052c2cca0aC6658A90B');
//sendtoken('0x424252E96bEf400487B6602923bbe5E7eC16fa80', 1);
//approveuser('0x424252E96bEf400487B6602923bbe5E7eC16fa80', 10);
