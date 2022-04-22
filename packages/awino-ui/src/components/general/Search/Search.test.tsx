import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render, fireEvent, waitFor } from '@/testing/utils';

// import { cleanup, render, waitFor } from '@/testing/utils';
import Search from './Search';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Switch />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Search onSearch={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should call onSearch method when enter is pressed', async () => {
    const fn = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(<Search onSearch={fn} />);
    const searchInput = getByPlaceholderText('common.search') as HTMLInputElement;

    // make sure that field is valid email on submit
    fireEvent.change(searchInput, { target: { value: 'lorem' } });
    fireEvent.submit(getByTestId('SearchForm'));
    await waitFor(() => {
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(expect.stringContaining('lorem'));
    });
  });
});
