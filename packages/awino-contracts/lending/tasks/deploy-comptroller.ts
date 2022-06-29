import { task,types } from "hardhat/config";

task("deploy-comptroller", "Deploy 'Comptroller' & 'SimplePriceOracle'")
  .setAction(async (args, { ethers }) => {
    const comptrollerFactory = await ethers.getContractFactory("Comptroller");
    const comptroller = await comptrollerFactory.deploy();
    await comptroller.deployed();

    console.log(`'Compotroller' deployed at ${comptroller.address}.`);
  });
