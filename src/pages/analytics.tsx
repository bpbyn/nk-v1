import { Box, Text } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React from 'react';

import Layout from '../layouts/Layout';
import type { NextPageWithLayout } from './_app';

const Analytics: NextPageWithLayout = () => {
  return (
    <Box>
      <Text fontSize="sm" color="black" fontFamily="body">
        Size
      </Text>
      <Text fontSize="lg" color="black" fontFamily="body">
        Small
      </Text>
      <Text fontSize="lg" color="black" fontFamily="body">
        Medium
      </Text>
      <Text fontSize="lg" color="black" fontFamily="body">
        Large
      </Text>
    </Box>
  );
};

export default Analytics;

Analytics.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
