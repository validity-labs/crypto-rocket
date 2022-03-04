import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Typography } from '@mui/material';

const IndexPage: NextPage = () => {
  return (
    <>
      <Typography>Index Page</Typography>
    </>
  );
};

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      // ns,
      // common,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default IndexPage;
