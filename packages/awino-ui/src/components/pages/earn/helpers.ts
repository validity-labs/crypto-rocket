/* @ts-nocheck */
import { showMessage } from '@/app/state/slices/app';

export const handleTransactionSubmit = () => {
  // TODO PROROTYPE
  let resError = 0;

  return async (balance: number, setStep, dispatch, t, i18nKey) => {
    if (!(balance > 0)) {
      setStep({ type: 'invalid' });
      return;
    }
    setStep({ type: 'confirmation' });
    dispatch(
      showMessage({
        message: t(`${i18nKey}.confirm`),
        alertProps: {
          severity: 'info',
        },
      })
    );
    const res = await new Promise<{ error: boolean; msg: string }>((res) =>
      // TODO PROTOTYPE
      setTimeout(() => {
        res({ error: !resError++, msg: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' });
      }, 4000)
    );
    if (res.error) {
      setStep({ type: 'error' });
      dispatch(
        showMessage({
          message: t(`${i18nKey}.error`),
          alertProps: {
            severity: 'error',
          },
        })
      );
    } else {
      setStep({ type: 'complete', payload: { address: res.msg } });
      // fetch and set live balance
      // callback();
      dispatch(
        showMessage({
          message: t(`${i18nKey}.success`),
          alertProps: {
            severity: 'success',
          },
        })
      );
    }
  };
};
