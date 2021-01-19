// Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/examples/SimpleToken.test.js
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');

const { expect } = require('chai');
require('chai').should();

const { expectEvent, singletons, constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const SettleToken = contract.fromArtifact('SettleToken');

describe('SettleToken', function () {
  const [registryFunder, creator, operator] = accounts;

  beforeEach(async function () {
    this.erc1820 = await singletons.ERC1820Registry(registryFunder);
    this.token = await SettleToken.new({ from: creator });
  });

  it('has a name', async function () {
    (await this.token.name()).should.equal('SettleToken');
  });

  it('has a symbol', async function () {
    (await this.token.symbol()).should.equal('SETTLE');
  });

  it('has 10,000,000 creator balance', async function () {
    (await await this.token.balanceOf(creator)).should.be.bignumber.equal('10000000000000000000000000');
  });


  it('assigns the initial total supply to the creator', async function () {
    const totalSupply = await this.token.totalSupply();
    const creatorBalance = await this.token.balanceOf(creator);

    creatorBalance.should.be.bignumber.equal(totalSupply);

    await expectEvent.inConstruction(this.token, 'Transfer', {
      from: ZERO_ADDRESS,
      to: creator,
      value: totalSupply,
    });
  });

  it('allows burn', async function () {
    var creatorBalance = await this.token.balanceOf(creator);
    creatorBalance = 1000000000000;

    await this.token.burn(creatorBalance, { from: operator });
    (await this.token.balanceOf(creator)).should.be.bignumber.equal("0");

  });


});
