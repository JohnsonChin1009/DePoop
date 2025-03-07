// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoopCoin is ERC20, Ownable {
    address public poopTracker;

    constructor(address initialOwner) ERC20("PoopCoin", "PC") Ownable(initialOwner) {}

    function setPoopTracker(address _poopTracker) external onlyOwner {
        poopTracker = _poopTracker;
    }

    function rewardUser(address user) external {
        require(msg.sender == poopTracker, "Not authorized");

        uint256 rewardAmount = getRandomReward(user);
        _mint(user, rewardAmount * 10**18);
    }

    function getRandomReward(address user) internal view returns (uint256) {
        uint256 randomHash = uint256(keccak256(abi.encodePacked(block.timestamp, user, block.prevrandao)));
        return (randomHash % 41) + 10; // Generates a number between 10 and 50
    }
}
