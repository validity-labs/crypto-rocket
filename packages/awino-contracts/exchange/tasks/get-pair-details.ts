import { task, types } from "hardhat/config";
import { default as AwinoPairABI } from "../artifacts/contracts/AwinoPair.sol/AwinoPair.json";
import { utils, BigNumber } from "ethers";

task("get-pair-details", "Display the details of a pair.")
  .addParam(
    "factoryAddress",
    "Address of the 'Factory' contract.",
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
  .setAction(async (args, { ethers }) => {
    // display pair details

    // get pair address via the 'Factory' contract
    const factory = await ethers.getContractFactory("AwinoFactory");
    const factoryInstance = factory.attach(args.factoryAddress);

    const pairAddress = await factoryInstance.getPair(
      args.tokenAAddress,
      args.tokenBAddress
    );

    // get pair instance
    const pair = new ethers.Contract(
      pairAddress,
      AwinoPairABI.abi,
      ethers.provider
    );

    // get details i.e reserves, ratio, mid price, execution price etc.
    const reservesResponse = await pair.getReserves();
    const [reserves0, reserves1] =
      args.tokenAAddress === (await pair.token0)
        ? [reservesResponse[0], reservesResponse[1]]
        : [reservesResponse[1], reservesResponse[0]];

    console.log("\nPair:");
    console.log("-------------");
    console.log(`address: ${pairAddress}`);
    console.log(
      `tokenA: ${args.tokenAAddress}, decimals: ${args.tokenADecimals}`
    );
    console.log(
      `tokenB: ${args.tokenBAddress}, decimals: ${args.tokenBDecimals}`
    );

    console.log(`\nReserves:`);
    console.log("-------------");
    console.log(`tokenA: ${utils.formatUnits(reserves0, args.tokenADecimals)}`);
    console.log(`tokenB: ${utils.formatUnits(reserves1, args.tokenBDecimals)}`);
    console.log(`timestamp: ${new Date(reservesResponse[2] * 1000)}`);

    console.log("\nRatio:");
    console.log("-------------");
    console.log("[TBD");
    console.log(
      `tokenA/tokenB:`,
      utils
        .formatUnits(
          BigNumber.from(reserves0.toString())
            .div(BigNumber.from(reserves1).toString())
            .mul(
              Math.pow(
                10,
                args.tokenADecimals !== args.tokenBDecimals
                  ? Math.abs(args.tokenADecimals - args.tokenBDecimals)
                  : args.tokenADecimals
              ).toString()
            )
            .toString(),
          args.tokenADecimals !== args.tokenBDecimals
            ? Math.abs(args.tokenADecimals - args.tokenBDecimals)
            : args.tokenADecimals
        )
        .toString()
    );

    console.log(
      `tokenB/tokenA:`,
      utils
        .formatUnits(
          BigNumber.from(reserves1.toString())
            .div(BigNumber.from(reserves0.toString()))
            .mul(
              Math.pow(
                10,
                args.tokenADecimals !== args.tokenBDecimals
                  ? Math.abs(args.tokenADecimals - args.tokenBDecimals)
                  : args.tokenADecimals
              ).toString()
            )
            .toString(),
          args.tokenADecimals !== args.tokenBDecimals
            ? Math.abs(args.tokenADecimals - args.tokenBDecimals)
            : args.tokenADecimals
        )
        .toString()
    );

    console.log("\n");
  });
