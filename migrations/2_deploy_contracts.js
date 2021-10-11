const PartyJacuzzi = artifacts.require("PartyJacuzzi");
const PARTY = '0x02048Fe5d5849Bfdb0FF2150c443c2a2A28fc0dE'; //FUJI
// const PARTY = '0x3EA3e5C6957581F3e70b2C33721D4E6844f60619'; //MAINNET
module.exports = function (deployer) {
  return deployer.deploy(PartyJacuzzi, PARTY);
};
