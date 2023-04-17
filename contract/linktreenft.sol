// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LINKEE is ERC721, Ownable {
    string public baseURI;
    uint256 public totalTokens;
    mapping(uint256 => bool) private _mintedTokens;

    constructor() ERC721("LINKEE", "link") {
        baseURI = "";
        totalTokens = 0;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        string memory tokenIdStr = uintToString(tokenId);
        return string(abi.encodePacked(baseURI, tokenIdStr, "?format=nft"));
    }

    function uintToString(uint256 v) private pure returns (string memory str) {
        uint256 len = 0;
        uint256 temp = v;
        while (temp > 0) {
            len++;
            temp /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 i = len;
        temp = v;
        while (temp > 0) {
            bstr[--i] = bytes1(uint8(48 + (temp % 10)));
            temp /= 10;
        }
        str = string(bstr);
    }

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
        _mintedTokens[tokenId] = true;
        totalTokens++;
    }

    function isTokenMinted(uint256 tokenId) public view returns (bool) {
        return _mintedTokens[tokenId];
    }
}
