pragma solidity >=0.6.12;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ProxyContract.sol";

contract TestPartyJacuzzi {
    function testNonOwnerFails() public {
        PartyJacuzzi jacuzzi = PartyJacuzzi(DeployedAddresses.PartyJacuzzi());
        ProxyContract proxy = new ProxyContract();

        string memory expectedReason = "Ownable: caller is not the owner";

        try proxy.attemptSetWithdrawalFee(jacuzzi) {
            revert("It should fail");
        } catch Error(string memory reason) {
            Assert.equal(reason, expectedReason, "It should fail");
        }
    }
}
