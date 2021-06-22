const YAYToken = artifacts.require("YAYToken");
const PartyJacuzzis = artifacts.require("PartyJacuzzis");

module.exports = function (deployer) {
  deployer.deploy(YAYToken).then(
    function () {
      return deployer.deploy(PartyJacuzzis, YAYToken.address);
    }
  );
};
