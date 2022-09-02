const { ethers } = require("hardhat");

// Deploy function
async function deploy() {
  const [account] = await ethers.getSigners();
  const deployerAddress = account.address;
  console.log(`Deploying contracts using ${deployerAddress}`);

  // //Deploy WCRO
  // const wcro = await ethers.getContractFactory("WCRO");
  // const wcroInstance = await wcro.deploy();
  // await wcroInstance.deployed();
  // console.log(`WRO deployed to : ${wcroInstance.address}`);

  //Deploy Router passing Factory Address and WCRO Address
  const router = await ethers.getContractFactory("AwinoRouter");
  const routerInstance = await router.deploy(
    process.env.AWINO_FACTORY_CONTRACT_ADDRESS
      ? process.env.AWINO_FACTORY_CONTRACT_ADDRESS
      : "0xbEAea7b8eE6555902C0D8d461D31E6bCf862a4b0",
    process.env.WCRO_CONTRACT_ADDRESS
      ? process.env.WCRO_CONTRACT_ADDRESS
      : "0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3"
  );
  await routerInstance.deployed();

  console.log(`Router V02 deployed to :  ${routerInstance.address}`);

  //Deploy Multicall (needed for Interface)
  const multicall = await ethers.getContractFactory("Multicall");
  const multicallInstance = await multicall.deploy();
  await multicallInstance.deployed();

  console.log(`Multicall deployed to : ${multicallInstance.address}`);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
