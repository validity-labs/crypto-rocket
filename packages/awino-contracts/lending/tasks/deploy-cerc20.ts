import { task,types } from "hardhat/config";
import {BigNumber as BN} from 'ethers';

task("deploy-cerc20", 'Deploys CErc-20')
  .addParam("underlying", "The address of the 'Underlying' token", undefined, types.string)
  .addParam("comptroller", "The address of the 'Comptroller", undefined, types.string)
  .addParam("interestRateModel", "The address of the 'interest rate model'", undefined, types.string)
  .addOptionalParam("initialExchangeRateMantissa", "The initial exchange rate, scaled by 1e18", '200000000000000000000000000', types.string)
  .addParam("name", "ERC-20 name of this token", undefined, types.string)
  .addParam("symbol", "ERC-20 symbol of this token", undefined, types.string)
  .addOptionalParam("decimals", "ERC-20 decimal precision of this token", 18, types.int)
  .setAction(async (args, { ethers }) => {
    const cErc20Factory = await ethers.getContractFactory("CErc20");
    const cErc20 = await cErc20Factory.deploy();
    await cErc20.deployed();
    await cErc20["initialize(address,address,address,uint256,string,string,uint8)"]()
    
    // cErc20["initialize(address,address,address,uint256,string,string,uint8)"](
    //   args.underlying,
    //   args.comptroller,
    //   args.interestRateModel,
    //   BN.from(args.initialExchangeRateMantissa),
    //   args.name,
    //   args.symbol,
    //   args.decimals);

    console.log(`${args.symbol} deployed at ${cErc20.address} `);
  });
