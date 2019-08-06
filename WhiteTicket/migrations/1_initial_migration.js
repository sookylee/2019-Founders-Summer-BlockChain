var Migrations = artifacts.require("./Migrations.sol");
//var GetterSetter = artifacts.require("./GetterSetter.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
   //deployer.deploy(GetterSetter,"hello");
};
