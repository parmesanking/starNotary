pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
import 'openzeppelin-solidity/contracts/access/roles/MinterRole.sol';

contract StarNotary is ERC721, MinterRole { 

    struct Star { 
        string name;
        string ra;
        string dec;
        string mag;
        string story;
    }

    uint256 public tokenCounter;
    mapping(bytes32 => uint256) public knownStars;
    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, string _ra, string _dec, string _mag,  string _story) public { 

        require(checkIfStarExist(_ra, _dec, _mag) == false, "Star already exists!");

        Star memory newStar = Star(_name, _ra, _dec, _mag, _story);
        bytes32 hash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        uint256 _tokenId = ++tokenCounter;
        knownStars[hash] = _tokenId;
        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }



    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender, "That star is not owned by you!");

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0, "That star is not on sale!");
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost, "That star is too expensive for you!");

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns (bool){
        bytes32 hash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        return knownStars[hash]>0;
    }
}