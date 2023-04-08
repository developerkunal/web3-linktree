// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Linktree is ERC721URIStorage, Ownable {
    string private domainSuffix = ".link";
    mapping(string => bool) private domainExists;
    mapping(string => address) private domainToOwner;
    mapping(string => mapping(string => string)) private socialLinks;
    mapping(address => string[]) private ownerToDomain;
    mapping(uint256 => string) private tokenIdToDomain;
    uint256 public counter = 0;

    constructor() ERC721("Linkee", "Link") {}

    function mint(string memory _domain,string memory _uri) public {
    require(!_exists(_domain), "Domain already exists");
    require(bytes(_domain).length > bytes(domainSuffix).length && 
        bytes(_domain)[bytes(_domain).length - bytes(domainSuffix).length] == bytes(domainSuffix)[0],
        "Invalid domain format");

    _safeMint(msg.sender, counter);

    string memory tokenURI = _uri;
    _setTokenURI(counter, tokenURI);

    domainExists[_domain] = true;
    domainToOwner[_domain] = msg.sender;
    tokenIdToDomain[counter] = _domain;
    ownerToDomain[msg.sender].push(_domain);
    counter++;
    }


function addSocialLinks(string memory _domain, string[] memory _platforms, string[] memory _links) public {
    require(_exists(_domain), "Domain does not exist");
    require(domainToOwner[_domain] == msg.sender, "Not domain owner");
    require(_platforms.length == _links.length, "Array length mismatch");

    for (uint i = 0; i < _platforms.length; i++) {
        socialLinks[_domain][_platforms[i]] = _links[i];
    }
}
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    require(_exists(tokenId), "ERC721: nonexistent token");
    require(from != address(0), "ERC721: transfer from the zero address");
    require(to != address(0), "ERC721: transfer to the zero address");

    // Get the domain associated with the token
    string memory domain = tokenIdToDomain[tokenId];

    // Transfer the token
    super.transferFrom(from, to, tokenId);

    // Update domain ownership
    domainToOwner[domain] = to;

    // Remove domain from the old owner's list of domains
    string[] storage domains = ownerToDomain[from];
    for (uint i = 0; i < domains.length; i++) {
        if (keccak256(bytes(domains[i])) == keccak256(bytes(domain))) {
            if (i != domains.length - 1) {
                domains[i] = domains[domains.length - 1];
            }
            domains.pop();
            break;
        }
    }

    // Add domain to the new owner's list of domains
    ownerToDomain[to].push(domain);
}

function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    require(_exists(tokenId), "ERC721: nonexistent token");
    require(from != address(0), "ERC721: transfer from the zero address");
    require(to != address(0), "ERC721: transfer to the zero address");

    // Get the domain associated with the token
    string memory domain = tokenIdToDomain[tokenId];

    // Transfer the token
    super.safeTransferFrom(from, to, tokenId, _data);

    // Update domain ownership
    domainToOwner[domain] = to;

    // Remove domain from the old owner's list of domains
    string[] storage domains = ownerToDomain[from];
    for (uint i = 0; i < domains.length; i++) {
        if (keccak256(bytes(domains[i])) == keccak256(bytes(domain))) {
            if (i != domains.length - 1) {
                domains[i] = domains[domains.length - 1];
            }
            domains.pop();
            break;
        }
    }

    // Add domain to the new owner's list of domains
    ownerToDomain[to].push(domain);
}

    function removeSocialLink(string memory _domain, string memory _platform) public {
        require(_exists(_domain), "Domain does not exist");
        require(domainToOwner[_domain] == msg.sender, "Not domain owner");

        delete socialLinks[_domain][_platform];
    }

    function getSocialLink(string memory _domain, string memory _platform) public view returns (string memory) {
        require(_exists(_domain), "Domain does not exist");

        return socialLinks[_domain][_platform];
    }

function getSocialLinks(string memory _domain, string[] memory _platforms) public view returns (string[] memory) {
    require(_exists(_domain), "Domain does not exist");

    string[] memory links = new string[](_platforms.length);

    for (uint i = 0; i < _platforms.length; i++) {
        links[i] = socialLinks[_domain][_platforms[i]];
    }

    return links;
}
    function domainExistsMap(string memory _domain) public view returns (bool) {
        return domainExists[_domain];
    }

    function getDomainOwner(string memory _domain) public view returns (address) {
        require(_exists(_domain), "Domain does not exist");

        return domainToOwner[_domain];
    }

    function _exists(string memory _domain) internal view returns (bool) {
        return domainExists[_domain];
    }
function getOwnerDomains(address _owner) public view returns (string[] memory) {
        return ownerToDomain[_owner];
    }
    function getTokenidDomain(uint256 tokenid) public view returns (string memory) {
        return tokenIdToDomain[tokenid];
    }
    function getUserTokenIds(address _user) public view returns (uint256[] memory) {
    uint256[] memory tokenIds = new uint256[](balanceOf(_user));
    uint256 counters = 0;
    for (uint256 i = 0; i < totalSupply(); i++) {
        if (ownerOf(i) == _user) {
            tokenIds[counters] = i;
            counters++;
        }
    }
    return tokenIds;
}
function totalSupply() public view returns (uint256) {
    return counter;
}
}
