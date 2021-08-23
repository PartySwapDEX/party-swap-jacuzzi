const PartyJacuzzi = artifacts.require("PartyJacuzzi");
// const PARTY = '0xb68Dd903198339f1818Fb3710AB4Ea2Ff85231B8'; //FUJI
const PARTY = '0x69A61f38Df59CBB51962E69C54D39184E21C27Ec'; //MAINNET
module.exports = function (deployer) {
  return deployer.deploy(PartyJacuzzi, PARTY);
};
