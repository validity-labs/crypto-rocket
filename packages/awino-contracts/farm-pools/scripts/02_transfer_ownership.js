const { ethers } = require("hardhat");

// Deploy function
async function deploy() {
  const [account] = await ethers.getSigners();
  const deployerAddress = account.address;
  console.log(`Deploying contracts using ${deployerAddress}`);

  const AWINO_TOKEN_ADDRESS = process.env.AWINO_TOKEN_ADDRESS
    ? process.env.AWINO_TOKEN_ADDRESS
    : "0x32910bEe89ED7267E6Da2bbbB0DAC01C8b2186B8";

  const AWINO_MASTER_CHEF = process.env.AWINO_MASTER_CHEF
    ? process.env.AWINO_MASTER_CHEF
    : "0x05E2469A991772DC29E00C3E2616ab08A0A99f1B";

  const awinoToken = await ethers.getContractFactory("SushiToken");
  const awinoTokenInstance = await awinoToken.attach(AWINO_TOKEN_ADDRESS);

  await (await awinoTokenInstance.transferOwnership(AWINO_MASTER_CHEF)).wait(1);
  console.log(
    `Ownership transferred to master chef contract at ${AWINO_MASTER_CHEF}`
  );
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
