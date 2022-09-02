import { task,types } from "hardhat/config";
import {BigNumber as BN} from 'ethers';

task("deploy-interest-rate-model", "Deploy 'WhitePaperInterestRateModel'")
.addOptionalParam('baseRatePerYear', 'The approximate target base APR, as a mantissa (scaled by BASE)',  '20000000000000000', types.string)
.addOptionalParam('multiplierPerYear', 'The rate of increase in interest rate wrt utilization (scaled by BASE)', '100000000000000000', types.string)
  .setAction(async (args, { ethers }) => {
    const irmFactory = await ethers.getContractFactory("WhitePaperInterestRateModel");
    const irm = await irmFactory.deploy(BN.from(args.baseRatePerYear), BN.from(args.multiplierPerYear));
    await irm.deployed();

    console.log(`WhitePaperInterestRateModel deployed at ${irm.address}.`);
  });
