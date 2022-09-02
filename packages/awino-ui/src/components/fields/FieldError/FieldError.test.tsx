import React from 'react';

import { cleanup, render } from '@/testing/utils';

import FieldError from './FieldError';

afterEach(cleanup);

describe('<FieldError />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<FieldError id="firstName" message="First name is required" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
