pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nosark is ERC20 {
    uint256 public _supply = 50_000_000 ether;
    address public owner;

    constructor(uint _supplyy) ERC20("NOSARK", "NK") {
        owner = msg.sender;
        _mint(msg.sender, _supplyy);
    }
    modifier onlyowner() {
        require(owner == msg.sender,"caller is not the owner");
        _;
    }

    function initialsupply(uint _supply1) public onlyowner {
        require(_supply <= 100_000_000 ether, "LIMIT EXCEEDED");
        _mint(msg.sender, _supply1);
        _supply = _supply1 + 50_000_000 ether;
    }
    function _totalsupply() public view returns(uint256)
    {
        return _supply;
    }
}
