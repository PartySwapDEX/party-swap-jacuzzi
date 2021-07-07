const YAYToken = artifacts.require("YAYToken");
const PartyJacuzzi = artifacts.require("PartyJacuzzi");

module.exports = function (deployer) {
  // 0xbbfc5d3ca1a21c46096dec7b698f471236b86c4a holds this YAY full supply
  // deployer.deploy(PartyJacuzzis, '0x10b3A2445f29F838ed8D9d61a82205A0436B7F75');

  // 0x3b73F15142945f260148aDa3Db15b0657D12831C holds the following PUPU full supply
  deployer.deploy(PartyJacuzzi, '0x3d3D4D81D4D702e791480cD782C55B19A506b849');
};
