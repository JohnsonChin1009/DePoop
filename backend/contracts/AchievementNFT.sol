// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AchievementNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    // Pass arguments to the ERC721 constructor
    constructor() ERC721("AchievementNFT", "ACHV") Ownable(msg.sender) {}

    // Mint an achievement NFT (only owner can call)
    function mintAchievement(address to, string memory tokenURI) external onlyOwner {
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;
    }

    // Get total minted achievements
    function totalMinted() external view returns (uint256) {
        return nextTokenId;
    }
}
