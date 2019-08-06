var agencyAddress = artifacts.require("./agencyAddress.sol");

module.exports = function(deployer) {
  deployer.deploy(agencyAddress,'1982bec5Ae61734ffe70D520764Ad39140300F93','1982bec5Ae61734ffe70D520764Ad39140300F93',0,'1982bec5Ae61734ffe70D520764Ad39140300F93');
}