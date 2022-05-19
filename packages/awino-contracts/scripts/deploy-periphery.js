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
  const router = await ethers.getContractFactory("UniswapV2Router02");
  const routerInstance = await router.deploy(
    "0x5216e93a2Baf9d86fF0ddfb70c9DeA930AbFA743",
    "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa"
  );
  await routerInstance.deployed();

  console.log(`Router V02 deployed to :  ${routerInstance.address}`);

  //Deploy Multicall (needed for Interface)
  const multicall = await ethers.getContractFactory("Multicall");
  const multicallInstance = await multicall.deploy();
  await multicallInstance.deployed();

  console.log(`Multicall deployed to : ${multicallInstance.address}`);

  const awinoERC20 = await ethers.getContractFactory("UniswapV2ERC20");
  const awinoERC20Instance = await awinoERC20.deploy();
  await awinoERC20Instance.deployed();
  console.log(`Awino ERC20 deployed to : ${awinoERC20Instance.address}`);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
