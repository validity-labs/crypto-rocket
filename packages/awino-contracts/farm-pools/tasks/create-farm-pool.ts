import { task, types } from "hardhat/config";

task("create-farm-pool")
  .addParam(
    "masterChef",
    "Address of 'MasterChef contract",
    undefined,
    types.string
  )
  .addParam("allocPoints", "Allocation points", undefined, types.string)
  .addParam("lpToken", "LP token address", undefined, types.string)
  .addOptionalParam("isRegular", "Is regular", true, types.boolean)
  .addOptionalParam("withUpdate", "WithUpdate", true, types.boolean)
  .setAction(async (args, { ethers }) => {
    const masterChefFactory = await ethers.getContractFactory("MasterChefV2");
    const masterChef = masterChefFactory.attach(args.masterChef);

    const tx = await masterChef.add(0, args.lpToken, true, args.withUpdate);

    await tx.wait(1);

    console.log(JSON.stringify(tx, null, 2));
  });
