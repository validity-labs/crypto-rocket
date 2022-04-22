import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import AssetSection from './AssetSection';

// export * from '@testing-library/react';
// export { withThemeRender as render };

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<AssetSection />', () => {
  it('has valid snapshot', () => {
    /*     const { asFragment } = withStore(<AssetSection />, {}, (store: Store) => {
      store.dispatch(setPageI18nNamespace('market'));
    }); */
    const { asFragment } = render(<AssetSection />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
