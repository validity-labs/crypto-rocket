const { ethers } = require("hardhat");

// Deploy function
async function deploy() {
  const [account] = await ethers.getSigners();
  const deployerAddress = account.address;
  console.log(`Deploying contracts using ${deployerAddress}`);

  // Sushi Token
  const awinoToken = await ethers.getContractFactory("SushiToken");
  const awinoTokenInstance = await awinoToken.deploy();
  await awinoTokenInstance.deployed();

  console.log(`Awino Token deployed to :  ${awinoTokenInstance.address}`);

  // Mint to Owner. For dev only
  const mintAmount = "10000";

  await awinoTokenInstance.mint(
    account.address,
    ethers.utils.parseEther(mintAmount, "ether")
  );
  console.log(`Mint to ${account.address} ${mintAmount} AWI.`);
  // Chef
  const masterChef = await ethers.getContractFactory("MasterChef");
  const masterChefInstance = await masterChef.deploy(
    awinoTokenInstance.address,
    account.address,
    100,
    1,
    10
  );
  await masterChefInstance.deployed();
  console.log(`MasterChef deployed to :  ${masterChefInstance.address}`);

  // Bar
  const bar = await ethers.getContractFactory("SushiBar");
  const barInstance = await bar.deploy(awinoTokenInstance.address);
  await barInstance.deployed();
  console.log(`Bar deployed to :  ${barInstance.address}`);

  // Maker
  const maker = await ethers.getContractFactory("SushiMaker");
  const makerInstance = await maker.deploy(
    "0xCf1d959a77c1708fAF33a1a9eD0bb265d2b24447", // factory
    barInstance.address,
    awinoTokenInstance.address,
    "0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3" // WCRO
  );
  await makerInstance.deployed();
  console.log(`Maker deployed to :  ${makerInstance.address}`);

  //
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
