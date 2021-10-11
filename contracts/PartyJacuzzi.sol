import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "yay-token/contracts/PartyToken.sol";

pragma solidity >=0.6.12;

// PartyJacuzzi is the coolest bar in town. You come in with some PARTY, and leave
// with more! The longer you stay, the more PARTY you get.
//
// This contract handles swapping to and from xPARTY, PartFinance's staking token.
contract PartyJacuzzi is ERC20("PartyJacuzzi", "xPARTY"), Ownable {
    using SafeMath for uint256;
    PartyToken public party;

    uint256 public constant MAX_EARLY_WITHDRAW_FEE_PERCENTAGE_BASE = 100;
    // This is a variable that can be changed by the owner
    uint256 public earlyWithdrawalFeePortionFromPercentageBase = 5;

    // Start time of when this contract was created
    uint256 public unlockDate;
    uint256 public constant LOCK_PERIOD = 180 days;

    // Make sure that the PartyToken contract we are passing in here
    // has the function `burnOwnTokens` which will burn tokens of your own
    // address.
    constructor(PartyToken _party) public {
        party = _party;
        unlockDate = block.timestamp.add(LOCK_PERIOD);
    }

    // Enter the bar. Pay some PARTY. Earn some shares.
    // Locks PARTY and mints xPARTY
    function enter(uint256 _amount) public {
        // Gets the amount of PARTY locked in the contract
        uint256 totalParty = party.balanceOf(address(this));
        // Gets the amount of xPARTY in existence
        uint256 totalShares = totalSupply();
        // If no xPARTY exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalParty == 0) {
            _mint(msg.sender, _amount);
        }
        // Calculate and mint the amount of xPARTY the PARTY is worth.
        // The ratio will change overtime, as xPARTY is burned/minted and PARTY
        // deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalParty);
            _mint(msg.sender, what);
        }
        // Lock the PARTY in the contract
        party.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your PARTY.
    // Unclocks the staked + gained PARTY and burns xPARTY
    function leave(uint256 _share) public {
        // Gets the amount of xPARTY in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of PARTY the xPARTY is worth
        uint256 what = _share.mul(party.balanceOf(address(this))).div(
            totalShares
        );
        _burn(msg.sender, _share);
        if (block.timestamp >= unlockDate) {
            party.transfer(msg.sender, what);
        } else {
            uint256 toBurn = what
                .mul(earlyWithdrawalFeePortionFromPercentageBase)
                .div(MAX_EARLY_WITHDRAW_FEE_PERCENTAGE_BASE);
            // Send the person's PARTY to their address
            party.transfer(msg.sender, what.sub(toBurn));
            // BURN the PARTY in this address
            party.burnOwnTokens(toBurn);
        }
    }

    // Change the early withdrawal amount
    function setEarlyWithdrawalFee(uint256 _earlyWithdrawalFee)
        external
        onlyOwner
    {
        require(
            _earlyWithdrawalFee <= MAX_EARLY_WITHDRAW_FEE_PERCENTAGE_BASE,
            "Can't have withdrawal fee greater than 100%"
        );
        earlyWithdrawalFeePortionFromPercentageBase = _earlyWithdrawalFee;
    }
}
