const PartyJacuzzi = artifacts.require("PartyJacuzzi");

module.exports = function (deployer) {
  return deployer.deploy(PartyJacuzzi, '0xEbD7fF328bC30087720e427CB8f11E9Bd8aF7d8A');
};
