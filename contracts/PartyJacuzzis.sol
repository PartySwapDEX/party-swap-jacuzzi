
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./YAYToken.sol";

pragma solidity >=0.6.12;

// PartyJacuzzis is the coolest bar in town. You come in with some YAY, and leave
// with more! The longer you stay, the more YAY you get.
//
// This contract handles swapping to and from xYAY, PartFinance's staking token.
contract PartyJacuzzis is ERC20("PartyJacuzzis", "xYAY"), Ownable {
    using SafeMath for uint256;
    YAYToken public yay;

    uint256 public constant MAX_EARLY_WITHDRAW_FEE = 10000;
    // This is a variable that can be changed by the owner 
    uint256 public earlyWithdrawalFee = 2500;

    // Start time of when this contract was created
    uint256 public unlockDate;
    uint256 public constant LOCK_PERIOD = 180 days;

    // Make sure that the YAYToken contract we are passing in here
    // has the function `burnOwnTokens` which will burn tokens of your own
    // address.
    constructor(YAYToken _yay) public {
        yay = _yay;
        unlockDate = block.timestamp.add(LOCK_PERIOD);
    }

    // Enter the bar. Pay some YAY. Earn some shares.
    // Locks YAY and mints xYay
    function enter(uint256 _amount) public {
        // Gets the amount of YAY locked in the contract
        uint256 totalYay = yay.balanceOf(address(this));
        // Gets the amount of xYAY in existence
        uint256 totalShares = totalSupply();
        // If no xYAY exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalYay == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xYAY the YAY is worth.
        // The ratio will change overtime, as xYAY is burned/minted and YAY
        // deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalYay);
            _mint(msg.sender, what);
        }
        // Lock the YAY in the contract
        yay.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your YAY.
    // Unclocks the staked + gained Pefi and burns xYay
    function leave(uint256 _share) public {
        // Gets the amount of xYay in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Pefi the xYay
         is worth
        uint256 what = _share.mul(yay.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        if (block.timestamp >= unlockDate) {
            yay.transfer(msg.sender, what);
        } else {
            uint256 toBurn = what.mul(earlyWithdrawalFee).div(MAX_EARLY_WITHDRAW_FEE);
            // Send the person's YAY to their address
            yay.transfer(msg.sender, what.sub(toBurn));
            // BURN the YAY in this address
            yay.burnOwnTokens(toBurn);
        }
    }

    // Change the early withdrawal amount
    function setEarlyWithdrawalFee(uint256 _earlyWithdrawalFee) external onlyOwner {
        require(_earlyWithdrawalFee <= MAX_EARLY_WITHDRAW_FEE, "Can't have withdrawal fee greater than 100%");
        earlyWithdrawalFee = _earlyWithdrawalFee;
    }
}
