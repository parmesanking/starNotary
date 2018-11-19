var StarNotary = artifacts.require("./StarNotary.sol");

module.exports = function(deployer) {
  deployer.deploy(StarNotary).then(res => {
    console.log("DEPLOYED ON ",res.address)
  });
};