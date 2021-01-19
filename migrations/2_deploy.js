const SettleToken = artifacts.require('SettleToken');

module.exports = async function (deployer) {
  await deployer.deploy(SettleToken);
};
