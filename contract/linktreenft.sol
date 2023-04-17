// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LINKEE is ERC721, Ownable {
    string public baseURI;
    uint256 public totalTokens;

    constructor() ERC721("LINKEE", "link") {
        baseURI = "";
        totalTokens = 0;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId, "?format=nft"));
    }

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
        totalTokens++;
    }
}