var Ticketing = artifacts.require("./Ticketing.sol");

module.exports = function(deployer) {
  deployer.deploy(Ticketing);
};