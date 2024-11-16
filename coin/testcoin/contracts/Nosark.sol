// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nosark is ERC20 {
    uint256 public mint_limit = 1000;
    uint256 public _supply;
    address public owner;
    uint256 public penaltyfee = 0.001 ether;

    event Mint(address indexed minter, uint256 amount);
    event MintLimitReached(address indexed minter); //It helps the front end detect when minting is restricted for a user,

    mapping(address => uint256) private balances; //for overall users
    mapping(address => uint256) private penaltybalances;
    constructor(uint _supplyy) ERC20("NOSARK", "NK") {
        owner = msg.sender;
        _mint(msg.sender, _supplyy);
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "caller is not the owner");
        _;
    }
    modifier limitchecker() {
        require(
            balances[msg.sender] < mint_limit,
            "Minting limit exceeded. Check penalty button for further guidance."
        );
        _;
    }

    function mint(uint256 amount) public limitchecker {
        uint256 currentbalance = balances[msg.sender];
        uint newbalance = currentbalance + amount;
        require(_supply <= 100_000 ether, "No more tokens available");

        if (newbalance >= mint_limit) {
            uint256 allowedamount = mint_limit - currentbalance;
            balances[msg.sender] += allowedamount;
            emit Mint(msg.sender, allowedamount);
            emit MintLimitReached(msg.sender);
            _supply += allowedamount;
            revert(
                "You have minted up to 1000 tokens and can't mint more. Check penalty button for further guidance."
            );
        } else {
            balances[msg.sender] += amount;
            emit Mint(msg.sender,amount);
            _supply += amount;
        }
    }
    function payPanelty() public payable {
        require(msg.value == penaltyfee, "Incorrect penalty fee");
        require(balances[msg.sender] >= mint_limit,"No penalty due");

        penaltybalances[msg.sender] = mint_limit + 1000;
        payable(address(this)).transfer(msg.value);
    }
    function totalSupply() public view override returns (uint256) {
        return super.totalSupply() + 5 ether;
    }
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function initialsupply(uint _supply1) public onlyOwner returns (uint256) {
        require(_supply <= 100_000_000 ether, "LIMIT EXCEEDED");
        _mint(msg.sender, _supply1);
        _supply = _supply1 + 50_000_000 ether;
        return _supply;
    }
    function _totalsupply() public view returns (uint256) {
        return _supply;
    }
}
