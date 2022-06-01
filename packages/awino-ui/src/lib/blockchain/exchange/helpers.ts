import { Contract, ethers } from 'ethers';

import ERC20_ABI from './abis/ERC20.json';
import AWINO_FACTORY_ABI from './abis/IAwinoFactory.json';
import AWINO_PAIR_ABI from './abis/IAwinoPair.json';
import AWINO_ROUTER_ABI from './abis/IAwinoRouter.json';

// @TODO cleanup this file. Add types.

async function getDecimals(token: Contract) {
  const decimals = await token
    .decimals()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log('No tokenDecimals function for this token, set to 0');
      return 0;
    });
  return decimals;
}

export async function swapTokens(address1, address2, amount, routerContractAddress, accountAddress, signer) {
  try {
    const tokens = [address1, address2];
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = ethers.BigNumber.from(time);

    const token1 = new Contract(address1, ERC20_ABI, signer);
    const tokenDecimals = await getDecimals(token1);

    const amountIn = ethers.utils.parseUnits(amount, tokenDecimals);

    const routerContract = new Contract(routerContractAddress, AWINO_ROUTER_ABI, signer);
    const amountOut = await routerContract.callStatic.getAmountsOut(amountIn, tokens);

    const wethAddress = await routerContract.WETH();

    let tx = null;
    if (address1 === wethAddress) {
      // Eth -> Token
      tx = await routerContract.swapExactETHForTokens(amountOut[1], tokens, accountAddress, deadline, {
        value: amountIn,
      });
    } else if (address2 === wethAddress) {
      // Token -> Eth
      tx = await routerContract.swapExactTokensForETH(amountIn, amountOut[1], tokens, accountAddress, deadline);
    } else {
      tx = await routerContract.swapExactTokensForTokens(amountIn, amountOut[1], tokens, accountAddress, deadline);
    }

    await tx.wait(1);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns the conversion rate between between two tokens.
 *
 */
export async function getAmountOut(
  address1: string,
  address2: string,
  amountIn: string,
  routerContractAddress: string,
  signer: ethers.providers.BaseProvider
): Promise<Number> {
  try {
    const token1 = new Contract(address1, ERC20_ABI, signer);
    const token1Decimals = await getDecimals(token1);

    const token2 = new Contract(address2, ERC20_ABI, signer);
    const token2Decimals = await getDecimals(token2);

    console.log({ address1, address2, amountIn, routerContractAddress, token1Decimals, token2Decimals });
    const routerContract = new Contract(routerContractAddress, AWINO_ROUTER_ABI, signer);
    const values_out = await routerContract.getAmountsOut(ethers.utils.parseUnits(String(amountIn), token1Decimals), [
      address1,
      address2,
    ]);
    const amount_out = values_out[1] * 10 ** -token2Decimals;
    console.log('amount out: ', amount_out);
    return Number(amount_out);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

/** Returns the reserves stored in a the liquidity pool between the token of address1 and the token
 * of address2.
 */
export async function fetchReserves(address1: string, address2: string, pair: Contract, signer: ethers.Signer) {
  try {
    // Get decimals for each coin
    const coin1 = new Contract(address1, ERC20_ABI, signer);
    const coin2 = new Contract(address2, ERC20_ABI, signer);

    const coin1Decimals = await getDecimals(coin1);
    const coin2Decimals = await getDecimals(coin2);

    // Get reserves
    const reservesRaw = await pair.getReserves();

    // Put the results in the right order
    const results = [
      (await pair.token0()) === address1 ? reservesRaw[0] : reservesRaw[1],
      (await pair.token1()) === address2 ? reservesRaw[1] : reservesRaw[0],
    ];

    // Scale each to the right decimal place
    return [results[0] * 10 ** -coin1Decimals, results[1] * 10 ** -coin2Decimals];
  } catch (err) {
    console.log('error!');
    console.log(err);
    return [0, 0];
  }
}

/**
 * Returns the reserves for the given pair.
 */
export async function getReserves(
  address1: string,
  address2: string,
  factoryAddress: string,
  provider: ethers.providers.JsonRpcProvider,
  accountAddress: string
): Promise<string[]> {
  try {
    const factory = new Contract(factoryAddress, AWINO_FACTORY_ABI, await provider.getSigner());
    const pairAddress = await factory.getPair(address1, address2);
    const pair = new Contract(pairAddress, AWINO_PAIR_ABI, await provider.getSigner());

    if (pairAddress !== '0x0000000000000000000000000000000000000000') {
      const reservesRaw = await fetchReserves(address1, address2, pair, await provider.getSigner());
      const liquidityTokens_BN = await pair.balanceOf(accountAddress);
      const liquidityTokens = ethers.utils.formatEther(liquidityTokens_BN).toString();

      return [reservesRaw[0].toPrecision(6), reservesRaw[1].toPrecision(6), liquidityTokens];
    } else {
      console.log('no reserves yet');
      return ['0', '0', '0'];
    }
  } catch (err) {
    console.error(err);
    return ['0', '0', '0'];
  }
}

/**
 * Adds liquidity to the a pool.
 */
export async function addLiquidity(
  address1: string,
  address2: string,
  amount1: string,
  amount2: string,
  amount1min: string,
  amount2min: string,
  routerContractAddress: string,
  account: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<void> {
  console.debug(`>> adding liquidity...`);
  const signer = await provider.getSigner();
  const token1 = new Contract(address1, ERC20_ABI, signer);
  const token2 = new Contract(address2, ERC20_ABI, signer);

  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  const amountIn1 = ethers.utils.parseUnits(amount1, token1Decimals);
  const amountIn2 = ethers.utils.parseUnits(amount2, token2Decimals);

  const amount1Min = ethers.utils.parseUnits(amount1min, token1Decimals);
  const amount2Min = ethers.utils.parseUnits(amount2min, token2Decimals);

  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

  const routerContract = new Contract(routerContractAddress, AWINO_ROUTER_ABI, signer);

  console.log(`waiting approval for token1....`);
  await (await token1.approve(routerContract.address, amountIn1)).wait(1);
  console.log(`waiting approval for token2....`);
  await (await token2.approve(routerContract.address, amountIn2)).wait(1);

  const wethAddress = await routerContract.WETH();

  console.log([address1, address2, amountIn1, amountIn2, amount1Min, amount2Min, account, deadline]);

  if (address1 === wethAddress) {
    // Eth + Token
    await (
      await routerContract.addLiquidityETH(address2, amountIn2, amount2Min, amount1Min, account, deadline, {
        value: amountIn1,
      })
    ).wait(1);
  } else if (address2 === wethAddress) {
    // Token + Eth
    await (
      await routerContract.addLiquidityETH(address1, amountIn1, amount1Min, amount2Min, account, deadline, {
        value: amountIn2,
      })
    ).wait(1);
  } else {
    // Token + Token
    await (
      await routerContract.addLiquidity(
        address1,
        address2,
        amountIn1,
        amountIn2,
        amount1Min,
        amount2Min,
        account,
        deadline
      )
    ).wait(1);
  }
}

/**
 * Removes liquidity from a pool.
 */
export async function removeLiquidity(
  address1: string,
  address2: string,
  liquidity_tokens: string,
  amount1min: string,
  amount2min: string,
  routerContractAddress: string,
  account: string,
  signer: ethers.Signer,
  factoryContractAddress: string
) {
  const token1 = new Contract(address1, ERC20_ABI, signer);
  const token2 = new Contract(address2, ERC20_ABI, signer);

  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  const Getliquidity = (liquidity_tokens) => {
    if (liquidity_tokens < 0.001) {
      return ethers.BigNumber.from(liquidity_tokens * 10 ** 18);
    }
    return ethers.utils.parseUnits(String(liquidity_tokens), 18);
  };

  const liquidity = Getliquidity(liquidity_tokens);
  console.log('liquidity: ', liquidity);

  const amount1Min = ethers.utils.parseUnits(String(amount1min), token1Decimals);
  const amount2Min = ethers.utils.parseUnits(String(amount2min), token2Decimals);

  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

  const routerContract = new Contract(routerContractAddress, AWINO_ROUTER_ABI, signer);
  const wethAddress = await routerContract.WETH();

  const factory = new Contract(factoryContractAddress, AWINO_FACTORY_ABI, signer);
  const pairAddress = await factory.getPair(address1, address2);
  const pair = new Contract(pairAddress, AWINO_PAIR_ABI, signer);

  await pair.approve(routerContract.address, liquidity);

  console.log([address1, address2, Number(liquidity), Number(amount1Min), Number(amount2Min), account, deadline]);

  if (address1 === wethAddress) {
    // Eth + Token
    await routerContract.removeLiquidityETH(address2, liquidity, amount2Min, amount1Min, account, deadline);
  } else if (address2 === wethAddress) {
    // Token + Eth
    await routerContract.removeLiquidityETH(address1, liquidity, amount1Min, amount2Min, account, deadline);
  } else {
    // Token + Token
    await routerContract.removeLiquidity(address1, address2, liquidity, amount1Min, amount2Min, account, deadline);
  }
}

/**
 * Given some amount of an asset and pair reserves, returns an equivalent amount of the other asset.
 */
const quote = (amount1: number, reserve1: number, reserve2: number): number => {
  const amount2 = amount1 * (reserve2 / reserve1);
  return amount2;
};

/**
 * Returns the quote of the minted liquidity.
 */
async function quoteMintLiquidity(
  address1: string,
  address2: string,
  amountA: number,
  amountB: number,
  factory: Contract,
  signer: ethers.Signer
): Promise<Number> {
  const MINIMUM_LIQUIDITY = 1000;
  let _reserveA = 0;
  let _reserveB = 0;
  let totalSupply = 0;
  [_reserveA, _reserveB, totalSupply] = await factory.getPair(address1, address2).then(async (pairAddress) => {
    if (pairAddress !== '0x0000000000000000000000000000000000000000') {
      const pair = new Contract(pairAddress, AWINO_PAIR_ABI, signer);

      const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formated as ethers
      const reserveA = reservesRaw[0];
      const reserveB = reservesRaw[1];

      const _totalSupply = await pair.totalSupply();
      const totalSupply = Number(ethers.utils.formatEther(_totalSupply));
      return [reserveA, reserveB, totalSupply];
    } else {
      return [0, 0, 0];
    }
  });

  const token1 = new Contract(address1, ERC20_ABI, signer);
  const token2 = new Contract(address2, ERC20_ABI, signer);

  // Need to do all this decimals work to account for 0 decimal numbers
  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  const valueA = amountA * 10 ** token1Decimals;
  const valueB = amountB * 10 ** token2Decimals;

  const reserveA = _reserveA * 10 ** token1Decimals;
  const reserveB = _reserveB * 10 ** token2Decimals;

  if (totalSupply == 0) {
    return Math.sqrt(valueA * valueB - MINIMUM_LIQUIDITY) * 10 ** -18;
  }

  return Math.min((valueA * totalSupply) / reserveA, (valueB * totalSupply) / reserveB);
}

/**
 * Returns the quote of the liquidity addition.
 */
export async function quoteAddLiquidity(address1, address2, amountADesired, amountBDesired, factoryAddress, provider) {
  const signer = await provider.getSigner();

  const factory = new Contract(factoryAddress, AWINO_FACTORY_ABI, signer);
  const pairAddress = await factory.getPair(address1, address2);
  const pair = new Contract(pairAddress, AWINO_PAIR_ABI, signer);

  const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  console.log({ reserveA, reserveB });
  if (reserveA === 0 && reserveB === 0) {
    console.log(`reserveA === reserveB === 0`);
    const amountOut = await quoteMintLiquidity(address1, address2, amountADesired, amountBDesired, factory, signer);
    return [amountADesired, amountBDesired, amountOut.toPrecision(8)];
  } else {
    const amountBOptimal = quote(amountADesired, reserveA, reserveB);
    if (amountBOptimal <= amountBDesired) {
      console.log(`amountBOptimal <= amountBDesired`);
      const amountOut = await quoteMintLiquidity(address1, address2, amountADesired, amountBOptimal, factory, signer);
      return [amountADesired, amountBOptimal, amountOut.toPrecision(8)];
    } else {
      console.log(`amountBOptimal > amountBDesired`);
      const amountAOptimal = quote(amountBDesired, reserveB, reserveA);
      const amountOut = await quoteMintLiquidity(address1, address2, amountAOptimal, amountBDesired, factory, signer);
      return [amountAOptimal, amountBDesired, amountOut.toPrecision(8)];
    }
  }
}

/**
 * Returns the quote for the removed liquidity.
 */
export async function quoteRemoveLiquidity(address1, address2, liquidity, factory, signer) {
  const pairAddress = await factory.getPair(address1, address2);
  console.log('pair address', pairAddress);
  const pair = new Contract(pairAddress, AWINO_PAIR_ABI, signer);

  const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formated as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  const feeOn = (await factory.feeTo()) !== 0x0000000000000000000000000000000000000000;

  const _kLast = await pair.kLast();
  const kLast = Number(ethers.utils.formatEther(_kLast));

  const _totalSupply = await pair.totalSupply();
  let totalSupply = Number(ethers.utils.formatEther(_totalSupply));

  if (feeOn && kLast > 0) {
    const feeLiquidity =
      (totalSupply * (Math.sqrt(reserveA * reserveB) - Math.sqrt(kLast))) /
      (5 * Math.sqrt(reserveA * reserveB) + Math.sqrt(kLast));
    totalSupply = totalSupply + feeLiquidity;
  }

  const Aout = (reserveA * liquidity) / totalSupply;
  const Bout = (reserveB * liquidity) / totalSupply;

  return [liquidity, Aout, Bout];
}
