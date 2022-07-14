/* eslint-disable prefer-const */
import { BigDecimal, Address } from "@graphprotocol/graph-ts/index";
import { Pair, Token, Bundle } from "../generated/schema";
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD } from "./utils";

let WCRO_ADDRESS = "0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3";
let DAI_WCRO_PAIR = "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16"; // created block ....
let USDT_WCRO_PAIR = "0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae"; // created block ....

export function getWcroPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let usdtPair = Pair.load(USDT_WCRO_PAIR); // usdt is token0
  let busdPair = Pair.load(DAI_WCRO_PAIR); // busd is token1

  if (busdPair !== null && usdtPair !== null) {
    let totalLiquidityCRO = busdPair.reserve0.plus(usdtPair.reserve1);
    if (totalLiquidityCRO.notEqual(ZERO_BD)) {
      let busdWeight = busdPair.reserve0.div(totalLiquidityCRO);
      let usdtWeight = usdtPair.reserve1.div(totalLiquidityCRO);
      return busdPair.token1Price.times(busdWeight).plus(usdtPair.token0Price.times(usdtWeight));
    } else {
      return ZERO_BD;
    }
  } else if (busdPair !== null) {
    return busdPair.token1Price;
  } else if (usdtPair !== null) {
    return usdtPair.token0Price;
  } else {
    return ZERO_BD;
  }
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  "0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3", // WCRO
  "0x8aBE5006Ac9f44f814621cB3BaE36E4b49393c69", // DAI
  "0x5a15259B0F448596f503978D14143fA643356552", // USDC
  "0xeb5b2B71b34B49bA88E18d37E58B26cD56D44870", // USDT
  "0x1E967ad1929579b0248CdB437E4628558282e910", // WETH
  "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // AWI
];

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_CRO = BigDecimal.fromString("10");

/**
 * Search through graph to find derived CRO per token.
 * @todo update to be derived CRO (add stablecoin estimates)
 **/
export function findWcroPerToken(token: Token): BigDecimal {
  if (token.id == WCRO_ADDRESS) {
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
    if (pairAddress.toHex() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHex());
      if (pair.token0 == token.id && pair.reserveCRO.gt(MINIMUM_LIQUIDITY_THRESHOLD_CRO)) {
        let token1 = Token.load(pair.token1);
        return pair.token1Price.times(token1.derivedCRO as BigDecimal); // return token1 per our token * CRO per token 1
      }
      if (pair.token1 == token.id && pair.reserveCRO.gt(MINIMUM_LIQUIDITY_THRESHOLD_CRO)) {
        let token0 = Token.load(pair.token0);
        return pair.token0Price.times(token0.derivedCRO as BigDecimal); // return token0 per our token * CRO per token 0
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedCRO.times(bundle.croPrice);
  let price1 = token1.derivedCRO.times(bundle.croPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedCRO.times(bundle.croPrice);
  let price1 = token1.derivedCRO.times(bundle.croPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
