const PartyJacuzzi = artifacts.require("PartyJacuzzi");
const YAYToken = artifacts.require('YAYToken');

// May want to substitute here this addres with the actual address on your preferred network
const YAY_ADDRESS = '0xEbD7fF328bC30087720e427CB8f11E9Bd8aF7d8A';

// May want to toggle comment on this part if testing next in fuji network, to avoid 'Unfinalized data query errors'.
// contract("PartyJacuzzi", async accounts => {
//   it("Should be an xYAY token named PartyJacuzzi", async () => {
//     const instance = await PartyJacuzzi.deployed();
//     const symbol = await instance.symbol.call();
//     const name = await instance.name.call();
//     const decimals = await instance.decimals.call();
//     assert.equal(symbol.valueOf(), 'xYAY');
//     assert.equal(name.valueOf(), 'PartyJacuzzi');
//     assert.equal(decimals.valueOf(), 18);
//   });

//   it("YAY address must match", async () => {
//     const instance = await PartyJacuzzi.deployed();
//     const JacuzziYAY = await instance.yay.call();
//     assert.equal(YAY_ADDRESS, JacuzziYAY);
//   });

//   it("Initial early withdrawal fee must be 20%", async () => {
//     const instance = await PartyJacuzzi.deployed();
//     const earlyWithdrawalFee = await instance.earlyWithdrawalFeePortionFromPercentageBase.call();
//     const maxFee = await instance.MAX_EARLY_WITHDRAW_FEE_PERCENTAGE_BASE.call();
//     assert.equal(earlyWithdrawalFee.valueOf(), 20);
//     assert.equal(maxFee.valueOf(), 100);
//   });
// });

// Toggle comment if want to skip this part
contract("PartyJacuzzi", async accounts => {
  //costs YAY
  it("Entering with no previous supply should increase balance by 1:1", async () => {
    const instance = await PartyJacuzzi.deployed();
    const yay = await YAYToken.at(YAY_ADDRESS);
    const ammount = web3.utils.toBN(1000);

    const initialAccountBalance = await instance.balanceOf(accounts[0]);
    //approve entering YAY into Jacuzzi
    await yay.approve(instance.address, ammount);
    await instance.enter(ammount);
    const finalAccountBalance = await instance.balanceOf(accounts[0]);

    assert.equal(initialAccountBalance.toString(), finalAccountBalance.sub(ammount).toString());
  });

  // costs YAY
  it("Entering with previous supply and more jacuzzi YAY balance should increase balance with a ratio difference", async () => {
    const instance = await PartyJacuzzi.deployed();
    const yay = await YAYToken.at(YAY_ADDRESS);

    const ammount = web3.utils.toBN(1000);

    //approve entering YAY into Jacuzzi
    await yay.approve(instance.address, ammount);

    //enter and mint 1:1
    await instance.enter(ammount);

    const middleAccountBalance = await instance.balanceOf(accounts[0]);

    //alter YAY / xYAY ratio
    await yay.transfer(instance.address, Math.round(Math.random() * 1000));

    const totalYAY = await yay.balanceOf(instance.address);
    const totalShares = await instance.totalSupply();

    const what = ammount.mul(totalShares).div(totalYAY);

    //approve entering more YAY into Jacuzzi
    await yay.approve(instance.address, ammount);

    //enter and mint with different ratio
    await instance.enter(ammount);

    const finalAccountBalance = await instance.balanceOf(accounts[0]);
    assert.equal("0", finalAccountBalance.sub(what).sub(middleAccountBalance).toString());
  });

  it("Leaving before unlock date, should give us our YAY back minus fees", async () => {
    const instance = await PartyJacuzzi.deployed();
    const yay = await YAYToken.at(YAY_ADDRESS);
    const ammount = web3.utils.toBN(1000);

    const initialYAYBalance = await yay.balanceOf(accounts[0]);
    const initialShares = await instance.balanceOf(accounts[0]);

    //approve entering YAY into Jacuzzi
    await yay.approve(instance.address, ammount);
    //enter
    await instance.enter(ammount);

    const jacuzziYayBalance = await yay.balanceOf(instance.address);
    const instanceTotalShares = await instance.totalSupply();
    const middleShares = await instance.balanceOf(accounts[0]);

    const sharesToTakeBack = middleShares.gte(initialShares) ? middleShares.sub(initialShares) : initialShares.sub(middleShares);
    const what = sharesToTakeBack.mul(jacuzziYayBalance).div(instanceTotalShares);

    const earlyWithdrawalFee = await instance.earlyWithdrawalFeePortionFromPercentageBase();
    const MAX_EARLY_WITHDRAW_FEE = await instance.MAX_EARLY_WITHDRAW_FEE_PERCENTAGE_BASE();
    const toBurn = what.mul(earlyWithdrawalFee).div(MAX_EARLY_WITHDRAW_FEE);

    //attepmt to take your YAYs back
    await instance.leave(sharesToTakeBack);

    const finalYAYBalance = await yay.balanceOf(accounts[0]);

    //tolerate 0.000000000000000001 YAY difference
    if (initialYAYBalance.sub(finalYAYBalance).sub(toBurn).toString() === '0') {
      assert.equal(initialYAYBalance.sub(finalYAYBalance).toString(), toBurn.toString())
    } else {
      assert.equal(initialYAYBalance.sub(finalYAYBalance).toString(), toBurn.add(web3.utils.toBN(1)).toString())
    }

  });
})