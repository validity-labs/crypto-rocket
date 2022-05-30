import { task, types } from "hardhat/config";

task(
  "add-liquidity",
  "Adds liquidity to a pair. If the pair doesn't exist will be created by the Router contract."
)
  .addParam(
    "routerAddress",
    "Address of the 'Router' contract.",
    undefined,
    types.string
  )
  .addParam(
    "tokenAAddress",
    "Address of the first token.",
    undefined,
    types.string
  )
  .addParam(
    "tokenBAddress",
    "Address of the second token.",
    undefined,
    types.string
  )
  .addParam(
    "amountADesired",
    "The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).",
    undefined,
    types.string
  )
  .addParam(
    "amountBDesired",
    "The amount of tokenB to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates",
    undefined,
    types.string
  )
  .addParam(
    "amountAMin",
    "Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired.",
    undefined,
    types.string
  )
  .addParam(
    "amountBMin",
    "Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "to",
    "Recipient of the liquidity tokens.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "deadline",
    "Unix timestamp after which the transaction will revert.",
    undefined,
    types.int
  )
  .addOptionalParam(
    "tokenADecimals",
    "Number of decimals for TokenA",
    18,
    types.int
  )
  .addOptionalParam(
    "tokenBDecimals",
    "Number of decimals for TokenB",
    18,
    types.int
  )
  .setAction(async (args, { ethers, run }) => {
    // get router
    let routerFactory = await ethers.getContractFactory("AwinoRouter");
    let routerInstance = routerFactory.attach(args.routerAddress);

    const [account] = await ethers.getSigners();
    const to = args.to ? args.to : account.address;
    const deadline = args.deadline
      ? args.deadline
      : Math.floor(Date.now() / 1000) + 60 * 20; // 20 min

    // ERC20 approve for convenience
    const erc20 = await ethers.getContractFactory("MockERC20");
    const tokenA = erc20.attach(args.tokenAAddress);
    await (
      await tokenA.approve(args.routerAddress, args.amountADesired)
    ).wait(1);
    const tokenB = erc20.attach(args.tokenBAddress);
    await (
      await tokenB.approve(args.routerAddress, args.amountBDesired)
    ).wait(1);

    // send tx
    const tx = await routerInstance.addLiquidity(
      args.tokenAAddress,
      args.tokenBAddress,
      args.amountADesired,
      args.amountBDesired,
      args.amountAMin,
      args.amountBMin,
      to,
      deadline
    );

    await tx.wait(1);

    await run("get-pair-details", {
      factoryAddress: await routerInstance.factory(),
      tokenAAddress: args.tokenAAddress,
      tokenBAddress: args.tokenBAddress,
      tokenADecimals: args.tokenADecimals,
      tokenBDecimals: args.tokenBDecimals,
    });
  });
