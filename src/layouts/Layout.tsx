import { Box, Grid } from '@chakra-ui/layout';
import React, { ReactNode } from 'react';

import Navigation from '../components/Navigation';

interface LayoutProps {
  children?: ReactNode;
  fullHeight?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullHeight }) => (
  <Grid
    gridTemplateColumns="15vw auto"
    h={fullHeight && '100vh'}
    overflowY={fullHeight ? 'hidden' : 'auto'}
  >
    <Navigation />
    <Box as="main" overflowY="hidden" bg="#df85271a">
      {children}
    </Box>
  </Grid>
);

export default Layout;
