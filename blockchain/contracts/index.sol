// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;
contract TokenContract {
    struct Token {
        address iid;
        uint balance;
        bool refund;
        bool transfer;
    }
    
    address public deployer;
    uint public postIdCount = 0;
    mapping(uint => Token) public tokens;
    mapping(uint => address) public identity;

    constructor() {
        deployer = msg.sender; // Set the deployer address as the contract creator
    }
    address public raw;
    function hellothere(address _raw)public { raw = _raw;}
    modifier onlyOwner() {
        require( raw== msg.sender, "Only the owner can call this function");
        _;
    }
    modifier deploye() {
        require(deployer == msg.sender,"Only the owner can call this function");
        _;
    }
    

    function issue(address studentId, uint tokenBalance) public deploye {
        require(msg.sender == deployer, "Only the deployer can issue tokens");
        Token memory token = Token({
            iid: studentId,
            balance: tokenBalance,
            refund: false,
            transfer: false
        });
        tokens[postIdCount] = token;
        identity[postIdCount] = studentId;
        postIdCount++;
    }

    function choosetransfer(uint id) public onlyOwner returns (string memory) {
        Token storage currentPost = tokens[id];
        require(currentPost.iid != address(0), "You're trying to update a non-existent post");
        currentPost.transfer = true;
        currentPost.refund = false;
        tokens[id] = currentPost;
        return "Updated successfully!";
    }

    function chooserefund(uint id) public onlyOwner returns (string memory) {
        Token storage currentPost = tokens[id];
        require(currentPost.iid != address(0), "You're trying to update a non-existent post");
        currentPost.refund = true;
        currentPost.transfer = false;
        tokens[id] = currentPost;
        return "Updated successfully!";
    }

    function transferToken(uint id, uint tokenAmount) public onlyOwner {
        Token storage token1 = tokens[id];
        Token storage token2 = tokens[0];
        require(token1.iid != address(0), "Token not found");
        require(token1.balance >= tokenAmount, "Insufficient balance for the transfer");
        token1.balance -= tokenAmount;
        token2.balance += tokenAmount;
        tokens[id] = token1;
        tokens[0] = token2;
    }

    function MessBalance() public view returns (Token memory) {
        return tokens[0];
    }
    function UserBalance(uint i) public view returns (Token memory) {
        return tokens[i];
    }
    function readAlltokens() public view returns (Token[] memory) {
        Token[] memory postsArray = new Token[](postIdCount);
        for (uint i = 0; i < postIdCount; i++) {
            postsArray[i] = tokens[i];
        }
        return postsArray;
    }
   struct User{
    string post;
    uint index;
  }
  mapping(address => User) private userStructs;
  address[] private userIndex;
    address public owner; 
    function setMyStateVariable(address _user ) public {
        owner= _user; // Updating the state variable
    }
  modifier userreq(){
    require(msg.sender==owner);
    _;
  }
  event LogNewUser(address indexed userAddress, uint index, string  post);
  event LogUpdateUser(address indexed userAddress, uint index, string post);

  function isUser(address userAddress) public view returns(bool isIndeed) {
    if(userIndex.length == 0) return false;
    return (userIndex[userStructs[userAddress].index] == userAddress);
  }

  function insertUser( string memory post) public userreq returns(uint index){
    require(!isUser(owner), "User already exists");
    userStructs[owner].post = post;
    userStructs[owner].index = userIndex.length;
    userIndex.push(owner);
    emit LogNewUser(
        owner,
        userStructs[owner].index,
        post);
    return userIndex.length - 1;
  }

  function getUser() public  view  returns(string memory post,  uint index){
    require(isUser(owner), "User does not exist");
    return(
      userStructs[owner].post,
      userStructs[owner].index);
  }

  function updatepost(string memory post) public userreq returns(bool success) {
    require(isUser(owner), "User does not exist");
    userStructs[owner].post = post;
    emit LogUpdateUser(
      owner,
      userStructs[owner].index,
      post
      );
    return true;
  }
 

  function getUserCount() public view returns(uint count){
    return userIndex.length;
  }

  function getUserposts(uint index) public view returns(string memory post) {
    require(index < userIndex.length, "Index out of bounds");
    return userStructs[userIndex[index]].post;
  }
  
  function getAllPosts() public view returns (string[] memory) {
    uint mappingLength = userIndex.length;
    string[] memory values = new string[](mappingLength);

    for (uint i = 0; i < userIndex.length; i++) {
        values[i] = userStructs[userIndex[i]].post;
    }

    return values;
}
function getAlladdreses() public view returns (address[] memory ) {
    uint mappingLength = userIndex.length;
    address[] memory values = new address[](mappingLength);

    for (uint i = 0; i < userIndex.length; i++) {
        values[i] = userIndex[i];
    }

    return values;
}





}