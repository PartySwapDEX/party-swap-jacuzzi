pragma solidity >=0.6.12;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PartyJacuzzi.sol";

contract ProxyContract {
    function attemptSetWithdrawalFee(PartyJacuzzi _contract) public {
        _contract.setEarlyWithdrawalFee(5500);
    }
}
