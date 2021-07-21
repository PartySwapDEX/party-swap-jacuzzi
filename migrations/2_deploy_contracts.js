const PartyJacuzzi = artifacts.require("PartyJacuzzi");
const YAYToken = artifacts.require("YAYToken");

module.exports = function (deployer) {
  // 0xbbfc5d3ca1a21c46096dec7b698f471236b86c4a holds this YAY full supply
  // deployer.deploy(PartyJacuzzis, '0x10b3A2445f29F838ed8D9d61a82205A0436B7F75');

  return deployer.deploy(PartyJacuzzi, '0x0f2D40e9dcaEe7792665a420feB52E76709dC53A');

  // 0x3b73F15142945f260148aDa3Db15b0657D12831C holds the following PUPU full supply
  // deployer.deploy(PartyJacuzzi, '0xcb2367B0eaf443d46bFa48e2Ae9B5388CB4A3dC5');
};
