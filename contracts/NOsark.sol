pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nosark is ERC20 {
    uint256 _supply = 50_000_000 ether;
    address owner;

    constructor() ERC20("NOSARK", "NK") {
        owner = msg.sender;
        _mint(msg.sender, _supply);
    }
    modifier onlyowner() {
        require(owner == msg.sender);
        _;
    }

    function initialsupply(uint _supply1) public onlyowner {
        require(_supply <= 100_000_000 ether, "LIMITED EXCEEDED");
        _mint(msg.sender, _supply1);
        _supply = _supply1 + 50_000_000 ether;
    }
}
