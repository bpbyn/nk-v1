import { Heading } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React from 'react';

import Layout from '../layouts/Layout';
import type { NextPageWithLayout } from './_app';

const Analytics: NextPageWithLayout = () => {
  return <Heading>Analytics Orders</Heading>;
};

export default Analytics;

Analytics.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
