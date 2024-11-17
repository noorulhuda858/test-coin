// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nosark is ERC20 {
    uint256 public mint_limit = 1000 ether;
    uint256 public MAX_SUPPLY = 100_000 ether;
    uint256 public penaltyfee = 0.001 ether;
    address public owner;

    event Mint(address indexed minter, uint256 amount);
    event MintLimitReached(address indexed minter);

    mapping(address => uint256) private balances;
    mapping(address => uint256) private penaltybalances;

    constructor() ERC20("NOSARK", "NK") {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can Call");
        _;
    }
    function mint(uint256 amount) public {
        uint256 currentBalance = balances[msg.sender];
        uint256 effectiveLimit = mint_limit + penaltybalances[msg.sender];
        uint256 newBalance = currentBalance + amount;

        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "No more tokens available"
        );
        require(newBalance <= effectiveLimit, "Exceeding supply");

        balances[msg.sender] += amount;
        _mint(msg.sender, amount);

        emit Mint(msg.sender, amount);
    }

    function payPenalty() public payable {
        require(msg.value == penaltyfee, "Incorrect penalty fee");
        penaltybalances[msg.sender] += 1000 ether;
        MAX_SUPPLY += 1000 ether;
    }

    //function setMaxSUpply
    function SetMaxSupply(uint newsupply) public onlyOwner {
        MAX_SUPPLY = newsupply;
    }

    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
