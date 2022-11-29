import { Box, Grid } from '@chakra-ui/layout';
import React, { ReactNode } from 'react';

import MobileNavigation from '../components/MobileNavigation';
import Navigation from '../components/Navigation';

interface LayoutProps {
  children?: ReactNode;
  fullHeight?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullHeight }) => (
  <Grid
    gridTemplateColumns={{ base: 'unset', sm: '15vw auto' }}
    gridTemplateRows={{ base: '66px 1fr', sm: 'unset' }}
    h={fullHeight && '100vh'}
    // overflowY={fullHeight ? 'hidden' : 'auto'}
  >
    <MobileNavigation />
    <Navigation />
    <Box as="main" bg="nk_lightOrange">
      {children}
    </Box>
  </Grid>
);

export default Layout;
