import { Flex, Heading } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';

import SideBarContent from './SideBarContent';

// const NAVBAR_HEIGHT = '60px';

const Navigation: React.FC = () => {
  return (
    <Flex
      flexDir="column"
      p="5"
      h="100%"
      alignItems="center"
      gap="10"
      display={{ base: 'none', sm: 'flex' }}
    >
      <Flex flexDir="column" alignItems="center" justifyContent="center">
        <Image
          src="assets/logo.png"
          boxSize={['0', '50px', '75px', '100px']}
          minW={50}
          minH={50}
          alt="nk_logo"
        />
        <Heading
          display={{ base: 'none', lg: 'block' }}
          fontSize="xl"
          letterSpacing="3px"
          color="nk_black"
        >
          NORTHERN
        </Heading>
        <Heading
          display={{ base: 'none', lg: 'block' }}
          fontSize="lg"
          letterSpacing="3px"
          color="nk_orange"
          fontFamily="body"
        >
          KAFFEINE
        </Heading>
      </Flex>
      <SideBarContent isMobile={false} />
    </Flex>
  );
};

export default Navigation;
