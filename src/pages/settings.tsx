import { Heading } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React from 'react';

import Layout from '../layouts/Layout';
import type { NextPageWithLayout } from './_app';

const Settings: NextPageWithLayout = () => {
  return <Heading>Settings!</Heading>;
};

export default Settings;

Settings.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
