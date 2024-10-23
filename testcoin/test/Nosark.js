const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("we are creating a Token", function () {
  let owner;
  let user1;
  let contractfactory_of_nosark;
  let final_contractfactory_nosark;

  beforeEach(async function () {
    contractfactory_of_nosark = await ethers.getContractFactory("Nosark"); //retrieves the contract factory for the Nosark contract,pauses the execution until the contract factory is fully ready
    [owner, user1] = await ethers.getSigners(); //retrieves a list of available Ethereum accounts (signers)
    /*first two accounts from the list would be given to these two arguments*/
    const initial_supply = ethers.parseUnits("50000000",18);
    final_contractfactory_nosark = await contractfactory_of_nosark.deploy(initial_supply); //final creation of contractfactory
    //await final_contractfactory_nosark.deploy();//waiting for the deployment of final nosark
  });
  it("initialsupply should be correct", async function () {
    const totalsupply = await final_contractfactory_nosark._totalsupply();
    expect(totalsupply).to.equal(ethers.parseUnits("50000000", 18));
  });
  it("it  should not exceed maximum supply limit", async function () {
    //attempt to mint more than the limit
    await final_contractfactory_nosark.initialsupply(
      ethers.parseUnits("100000000", 18)
    );
    await expect(
      final_contractfactory_nosark.initialsupply(
        ethers.parseUnits("1000000000", 18)
      )
    ).to.be.revertedWith("LIMIT EXCEEDED");
  });

  it("Only allow owner to mint", async function () {

    await expect(final_contractfactory_nosark.connect(user1).initialsupply(ethers.parseUnits("50000000",18))).to.be.revertedWith("caller is not the owner");
    /*await expect(
        final_contractfactory_nosark.connect(user1).initialsupply(ethers.parseUnits("50000000", 18))
    ).to.be.revertedWith("caller is not the owner");*/
});     
});
