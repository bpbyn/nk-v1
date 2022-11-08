import { Box, Grid } from '@chakra-ui/layout';
import React, { ReactNode } from 'react';

import Navigation from '../components/Navigation';

interface LayoutProps {
  children?: ReactNode;
  fullHeight?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullHeight }) => (
  <Grid
    gridTemplateColumns={{ base: '1fr', sm: '15vw auto' }}
    h={fullHeight && '100vh'}
    // overflowY={fullHeight ? 'hidden' : 'auto'}
  >
    <Navigation />
    <Box as="main" bg="nk_lightOrange">
      {children}
    </Box>
  </Grid>
);

export default Layout;
