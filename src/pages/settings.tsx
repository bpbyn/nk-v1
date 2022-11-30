import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React from 'react';

import Layout from '../layouts/Layout';
import type { NextPageWithLayout } from './_app';

const Settings: NextPageWithLayout = () => {
  return (
    <Box
      as={Flex}
      flexFlow="column wrap"
      justify="center"
      pb={10}
      alignItems="center"
      h="full"
    >
      <Image
        src="assets/work_in_progress.svg"
        alt="no_data"
        boxSize="250px"
        background="nk_gray.20"
        borderRadius="full"
      />
      <Text color="nk_gray.30" p={5}>
        Work in Progress 🤔
      </Text>
    </Box>
  );
};

export default Settings;

Settings.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
