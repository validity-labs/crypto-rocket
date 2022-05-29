export async function getDecimals(token) {
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
