import { BigNumber, ethers } from 'ethers';

import { AssetInfo } from '@/components/pages/swap/SwapSection/SwapSection';

import AWINO_ROUTER_ABI from './abis/IAwinoRouter.json';
import { AWINO_ROUTER_MAP, ChainId, FACTORY_ADDRESS_MAP, TradeType } from './constants';
import { Percent, Route, Token, TokenAmount, Trade } from './entities';
import { Fetcher } from './fetcher';

export async function swapTokens(
  chainId: number,
  provider: ethers.providers.JsonRpcProvider,
  tokenA: AssetInfo,
  tokenB: AssetInfo,
  amount,
  slippage = '50'
) {
  try {
    const token1 = new Token(chainId, tokenA.address, tokenA.decimals);
    const token2 = new Token(chainId, tokenB.address, tokenB.decimals);

    console.log({ amount, token1, token2 });

    console.log({ provider });

    console.log(`fetching pair data...`);

    const pair = await Fetcher.fetchPairData(token1, token2, provider); //creating instances of a pair
    console.log({ pair });

    const route = await new Route([pair], token2); // a fully specified path from input token to output token
    let amountIn: string = BigNumber.from(amount).toString(); //helper function to convert ETH to Wei
    const amountInHex = ethers.BigNumber.from(amountIn).toHexString();
    const slippageTolerance = new Percent(slippage, '10000'); // 50 bips, or 0.50% - Slippage tolerance

    const trade = new Trade(route, new TokenAmount(token2, amountIn), TradeType.EXACT_INPUT); //information necessary to create a swap transaction.

    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
    const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
    const path = [token1.address, token2.address]; //An array of token addresses

    console.log(`Route path:${path}`);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex
    const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string

    console.log({ amountIn, amountOut: trade.minimumAmountOut(slippageTolerance) });

    console.log({
      AWINO_ROUTER_ADDRESS: AWINO_ROUTER_MAP[ChainId.TESTNET],
      AWINO_ROUTER_ABI,
    });

    console.log(path);
    console.log(`Constructing transaction...`);
    console.log({
      amountIn: amountIn,
      amountOutMin: trade.minimumAmountOut(slippageTolerance).toFixed(),
      amountOutMinHex,
      deadline,
    });

    // Return a copy of transactionRequest, The default implementation calls checkTransaction and resolves to if it is an ENS name, adds gasPrice, nonce, gasLimit and chainId based on the related operations on Signer.
    const rawTxn = await new ethers.Contract(
      AWINO_ROUTER_MAP[ChainId.TESTNET],
      AWINO_ROUTER_ABI,
      provider.getSigner()
    ).populateTransaction.swapExactTokensForTokens(
      amountInHex,
      amountOutMinHex,
      path,
      provider.getSigner().getAddress(),
      deadline
    ); // @TODO amountIn, amountOut are hardcoded at the moment

    //Returns a Promise which resolves to the transaction.
    let tx = await provider.getSigner().sendTransaction(rawTxn);

    //Resolves to the TransactionReceipt once the transaction has been included in the chain for x confirms blocks.
    let reciept = await tx.wait(1);

    //Logs the information about the transaction it has been mined.
    if (reciept) {
      console.log(
        ' - Transaction is mined - ' + '\n' + 'Transaction Hash:',
        (await tx).hash +
          '\n' +
          'Block Number: ' +
          (await reciept).blockNumber +
          '\n' +
          'Navigate to https://rinkeby.etherscan.io/txn/' +
          (await tx).hash,
        'to see your transaction'
      );
    } else {
      console.log('Error submitting transaction');
    }
  } catch (e) {
    console.log(e);
  }
}
