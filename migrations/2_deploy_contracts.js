const YAYToken = artifacts.require("YAYToken");
const PartyJacuzzis = artifacts.require("PartyJacuzzis");

module.exports = function (deployer) {
  // 0xbbfc5d3ca1a21c46096dec7b698f471236b86c4a holds this YAY full supply
  return deployer.deploy(PartyJacuzzis, '0x10b3A2445f29F838ed8D9d61a82205A0436B7F75');
};
