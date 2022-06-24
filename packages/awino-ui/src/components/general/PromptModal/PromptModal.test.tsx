import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import PromptModal from './PromptModal';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<PromptModal />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <PromptModal
        data={{
          title: 'Title',
          message: 'Message',

          onClose: () => {},
          button: 'Button',
        }}
        open={true}
        close={() => {}}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
