const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");
const initial_supply = ethers.parseUnits("0",18);

//creating deployment module for our smart contract
module.exports = buildModule("Nosarkmodule",(m)=> {
  const nosark = m.contract("Nosark", []);
 console.log("your contract address is ", nosark.address); 
});