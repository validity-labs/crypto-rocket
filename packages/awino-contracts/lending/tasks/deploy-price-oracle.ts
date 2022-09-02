import { task,types } from "hardhat/config";

task("deploy-price-oracle", "Deploy 'SimplePriceOracle'")
  .setAction(async (args, { ethers }) => {
    const priceOracleFactory = await ethers.getContractFactory("SimplePriceOracle");
    const priceOracle = await priceOracleFactory.deploy();
    await priceOracle.deployed();

    console.log(`PriceOracle deployed at ${priceOracle.address}.`);
  });
