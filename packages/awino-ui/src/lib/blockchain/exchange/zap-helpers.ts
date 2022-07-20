import { Provider } from '@ethersproject/providers';
import { Contract, ethers } from 'ethers';

import { CHAIN_ID } from '@/app/constants';
import { Address } from '@/types/app';

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

export async function zapTokens(address1, address2, amount, routerContractAddress, accountAddress, signer) {
  console.log(`=== SWAP TOKENS ===`);
  try {
    const tokens = [address1, address2];
    const time = Math.floor(Date.now() / 1000) + 60 * 20;
    const deadline = ethers.BigNumber.from(time).toNumber();

    const token1 = new Contract(address1, ERC20_ABI, signer);
    const tokenDecimals = await getDecimals(token1);

    const amountIn = ethers.utils.parseUnits(amount, tokenDecimals);

    const routerContract = new Contract(routerContractAddress, AWINO_ROUTER_ABI, signer);
    const amountOut = await routerContract.callStatic.getAmountsOut(amountIn, tokens); // BigNumber

    const wethAddress = await routerContract.WETH();

    let tx = null;
    if (address1 === wethAddress) {
      console.log(`** swapping exact CRO for tokens....`);
      console.log({
        payload: {
          amountOutMin: amountOut[1].toString(),
          tokens,
          accountAddress,
          deadline,
          amountIn: amountIn.toString(),
        },
      });
      // Eth -> Token
      tx = await routerContract.swapExactETHForTokens('1000000000000000000', tokens, accountAddress, deadline, {
        value: '1000000000000000000',
      });
    } else if (address2 === wethAddress) {
      console.log(`** swapping exact tokens for CRO....`);
      // Token -> Eth
      tx = await routerContract.swapExactTokensForETH(amountIn, amountOut[1], tokens, accountAddress, deadline);
    } else {
      console.log(`** swapping exact tokens for tokens....`);
      tx = await routerContract.swapExactTokensForTokens(amountIn, amountOut[1], tokens, accountAddress, deadline);
    }

    await tx.wait(1);
  } catch (error) {
    console.error(error);
  }
}
