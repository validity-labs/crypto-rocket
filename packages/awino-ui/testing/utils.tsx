import React, { /* FC, */ ReactElement /* , useMemo */ } from 'react';

import { render, RenderOptions } from '@testing-library/react';

import themeCreator from '@/app/theme';
import { AppStore, makeStore } from '@/app/store';
import { setPageI18nNamespace } from '@/app/state/slices/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { I18nPageNamespace } from '@/types/app';

// // Theme provider component wrapper
// const MuiThemeProvider: FC = ({ children }) => {
//   const theme = useMemo(() => themeCreator('dark'), []);
//   return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
// };

// const withThemeRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
//   render(ui, { wrapper: MuiThemeProvider, ...options });

type StoreCallback = (store: AppStore) => void;
const withStore = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
  storeInjector?: StoreCallback | I18nPageNamespace
) => {
  const store = makeStore();
  if (typeof storeInjector === 'function') {
    storeInjector(store);
  } else if (typeof storeInjector === 'string') {
    store.dispatch(setPageI18nNamespace(storeInjector));
  }
  return render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { withStore as render };
