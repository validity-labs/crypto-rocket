/**
 * Returns the current price of any cryptocurrency in any other currency
 *
 * @param fsym The cryptocurrency symbol of interest.
 * @param tsym The symbol of the currency to convert into.
 *
 * @returns The current price of any cryptocurrency in any other currency
 *
 * @todo Missing implementation.
 */
export const getExchangeRate = async (fsym: string, tsym: string): Promise<string> => {
  console.error(`Not implemented yet.`);
  return Promise.resolve('0.00');
};
