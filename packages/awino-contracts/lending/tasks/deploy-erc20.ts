import { task } from "hardhat/config";

task("deploy-erc20")
  .addParam("name", "Name of the ERC20 token")
  .addParam("symbol", "Symbol of the ERC20 token")
  .setAction(async ({ name, symbol }, { ethers }) => {
    const erc20Factory = await ethers.getContractFactory("MockERC20");
    const erc20 = await erc20Factory.deploy(
      name,
      symbol.toUpperCase(),
      ethers.utils.parseUnits("1000000000", 18)
    );
    await erc20.deployed();
    console.log(`${symbol.toUpperCase()} deployed at ${erc20.address} `);
  });
