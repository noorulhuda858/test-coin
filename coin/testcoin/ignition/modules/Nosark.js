const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");
const initial_supply = ethers.parseUnits("50000000",18);

//creating deployment module for our smart contract
module.exports = buildModule("Nosarkmodule",(m)=> {
  const nosark = m.contract("Nosark",[initial_supply]); // value=amount of ether to send along with contract deployment
 //console.log("your contract address is ", nosark.address); 
});
