const PartyJacuzzi = artifacts.require("PartyJacuzzi");

module.exports = function (deployer) {
  return deployer.deploy(PartyJacuzzi, '0x15957be9802B50c6D66f58a99A2a3d73F5aaf615');
};
