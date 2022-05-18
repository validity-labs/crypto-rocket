import React from 'react';

import { Formik } from 'formik';

import { cleanup, render } from '@/testing/utils';

import FieldSelect from './FieldSelect';

afterEach(cleanup);

describe('<FieldSelect />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <Formik initialValues={{ test: '' }} onSubmit={() => {}}>
        <FieldSelect name="test" required label="Input Label" options={[{ label: 'First', value: 'first' }]} />
      </Formik>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
