const PartyJacuzzi = artifacts.require("PartyJacuzzi");
// const PARTY = '0x02048Fe5d5849Bfdb0FF2150c443c2a2A28fc0dE'; //FUJI
const PARTY = '0x25afD99fcB474D7C336A2971F26966da652a92bc'; //MAINNET
module.exports = function (deployer) {
  return deployer.deploy(PartyJacuzzi, PARTY);
};
