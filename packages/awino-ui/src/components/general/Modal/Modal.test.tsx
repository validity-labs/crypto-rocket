import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Modal from './Modal';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Modal />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <Modal id="test" title="Test" open={true} close={() => {}}>
        Test
      </Modal>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
