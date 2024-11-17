const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Minting Tests", function () {
  let signer1;
  let owner;
  let signer2;
  let final_contractfactory_nosark;

  beforeEach(async function () {
    const contractfactory_of_nosark = await ethers.getContractFactory("Nosark");
    [owner,signer1, signer2] = await ethers.getSigners();
    const initialSupply = ethers.parseEther("0");
    final_contractfactory_nosark = await contractfactory_of_nosark.connect(owner).deploy();
    await ethers.provider.send("hardhat_setBalance", [
      signer1.address,
      ethers.toBeHex(ethers.parseEther("10"))
    ]);
  
    await ethers.provider.send("hardhat_setBalance", [
      signer2.address,
      ethers.toBeHex(ethers.parseEther("10"))
    ]);
    const balance1 = await ethers.provider.getBalance(signer1.address);
    const balance2 = await ethers.provider.getBalance(signer2.address);
    console.log("Signer1 balance:", ethers.formatEther(balance1), "ETH");
    console.log("Signer2 balance:", ethers.formatEther(balance2), "ETH");
  });

  it("should allow any user to mint tokens", async function () {
    await final_contractfactory_nosark.mint(ethers.parseUnits("500", 18));
    const newSupply = await final_contractfactory_nosark.totalSupply();
    expect(newSupply).to.equal(ethers.parseUnits("500", 18));
  });

  it("should revert when trying to mint more than 1000 tokens", async function() {
    const initialSupply = await final_contractfactory_nosark.totalSupply();
    console.log("Initial Supply:", initialSupply.toString());
    await final_contractfactory_nosark.mint(ethers.parseUnits("1000", 18));
    await expect(
      final_contractfactory_nosark.mint(ethers.parseUnits("1500", 18))
    ).to.be.revertedWith("Exceeding supply");
  });

  it("try to mint without paying penalty", async function() {
    await final_contractfactory_nosark.mint(ethers.parseUnits("1000", 18));

    await expect(final_contractfactory_nosark.mint(ethers.parseUnits("1", 18)))
        .to.be.revertedWith("Exceeding supply");
  });

  it("should allow minting after paying penalty", async function() {

    const penaltyFee = await final_contractfactory_nosark.penaltyfee();
    console.log("Expected Penalty Fee:", penaltyFee.toString());
    // const balance = await final_contractfactory_nosark.balanceOf(signer1.address);
    // console.log("balance of user1 is" ,ethers.formatUnits(balance,18));
    await final_contractfactory_nosark.connect(signer1).payPenalty({ value: penaltyFee });
    
    await expect(final_contractfactory_nosark.connect(signer1).mint(ethers.parseUnits("1", 18)))
        .to.not.be.reverted;
});

  // Uncomment this test if you want to check the initial supply
  // it("initialsupply should be correct", async function () {
  //   const totalsupply = await final_contractfactory_nosark._totalsupply();
  //   expect(totalsupply).to.equal(ethers.parseUnits("50000000", 18));
  // });
});