// import { Avatar } from '@chakra-ui/avatar';
import { Flex, Heading } from '@chakra-ui/layout';
// import { Menu, MenuItem, MenuList } from '@chakra-ui/menu';
import {
  Icon,
  Image,
  Text,
  VStack,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
// import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import { FaCoffee, FaClipboardList, FaChartLine, FaCog } from 'react-icons/fa';

interface LinkItemProps {
  name: string;
  route: string;
  icon: IconType;
}

// const NAVBAR_HEIGHT = '60px';

const Navigation: React.FC = () => {
  const LinkItems: Array<LinkItemProps> = [
    { name: 'Get Orders', route: '/order', icon: FaClipboardList },
    { name: 'Queue', route: '/queue', icon: FaCoffee },
    { name: 'Analytics', route: '/analytics', icon: FaChartLine },
    { name: 'Settings', route: '/settings', icon: FaCog },
  ];

  // const router = useRouter();
  // const name = 'lorem.ipsum';
  const { isOpen, onOpen } = useDisclosure();
  const [nav, setNav] = useState(null);
  // defaultIsOpen: true
  // })

  return (
    <Flex flexDir="column" p="5" h="100%" alignItems="center" gap="10">
      <Flex flexDir="column" alignItems="center" justifyContent="center">
        <Image
          src="assets/logo.png"
          boxSize={['0', '50px', '75px', '150px']}
          alt="nk_logo"
        />
        <Heading
          display={['none', 'none', 'none', 'block']}
          fontSize="xl"
          letterSpacing="3px"
          color="nk_black"
        >
          NORTHERN
        </Heading>
        <Heading
          display={['none', 'none', 'none', 'block']}
          fontSize="lg"
          letterSpacing="3px"
          color="nk_orange"
          fontFamily="body"
        >
          KAFFEINE
        </Heading>
      </Flex>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        w="100%"
      >
        <VStack spacing={4} align="stretch">
          {LinkItems.map((link) => {
            return (
              <NextLink key={link.name} href={link.route}>
                <Box
                  as={Flex}
                  align="flex-start"
                  gap="15px"
                  p={3}
                  w="100%"
                  onClick={() => {
                    onOpen();
                    setNav(link.name);
                  }}
                  color={{
                    sm: isOpen && nav === link.name ? 'nk_black' : 'nk_gray.30',
                    md: isOpen && nav === link.name ? 'nk_black' : 'nk_gray.30',
                    lg: isOpen && nav === link.name ? 'nk_black' : 'nk_gray.30',
                    xl: isOpen && nav === link.name ? 'nk_black' : 'nk_gray.30',
                  }}
                  bg={{
                    sm: 'none',
                    md: isOpen && nav === link.name && '#df85271a',
                    lg: isOpen && nav === link.name && '#df85271a',
                    xl: isOpen && nav === link.name && '#df85271a',
                  }}
                  borderRadius={10}
                  _hover={{
                    bg: '#df85271a',
                    color: 'nk_black',
                    cursor: 'pointer',
                    transitionDuration: '.4s',
                    transitionTimingFunction: 'linear',
                  }}
                >
                  <Icon boxSize={[0, 7, 8, 5, 5]} as={link.icon} />
                  <Text
                    display={['none', 'none', 'none', 'block']}
                    fontSize="md"
                    fontWeight="bold"
                  >
                    {link.name}
                  </Text>
                </Box>
              </NextLink>
            );
          })}
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Navigation;
