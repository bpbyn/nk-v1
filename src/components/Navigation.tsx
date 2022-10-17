// import { Avatar } from '@chakra-ui/avatar';
import { Flex, Heading } from '@chakra-ui/layout';
// import { Menu, MenuItem, MenuList } from '@chakra-ui/menu';
import { Link, Icon, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
// import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import { FaCoffee, FaClipboardList, FaChartLine, FaCog } from 'react-icons/fa';

interface LinkItemProps {
  name: string;
  icon: IconType;
}

// const NAVBAR_HEIGHT = '60px';

const Navigation: React.FC = () => {
  const LinkItems: Array<LinkItemProps> = [
    { name: 'Get Orders', icon: FaClipboardList },
    { name: 'Queue', icon: FaCoffee },
    { name: 'Analytics', icon: FaChartLine },
    { name: 'Settings', icon: FaCog },
  ];

  // const router = useRouter();
  // const name = 'lorem.ipsum';
  // const { isOpen, onOpen, onClose } = useDisclosure({
  // defaultIsOpen: true
  // })

  return (
    <Flex flexDir="column" p="5" h="100%" alignItems="center" gap="10">
      <Flex flexDir="column" alignItems="center" justifyContent="center">
        <Image src="assets/logo.png" boxSize={['0', '50px', '75px', '150px']} />
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
        {LinkItems.map((link) => {
          return (
            <Flex
              key={link.name}
              gap="15px"
              alignItems="flex-start"
              justifyContent={{ base: 'center', xl: 'flex-start' }}
              p={3}
              w="100%"
              // opacity="0.5"
              _hover={{
                bg: '#df85271a',
                color: 'nk_black',
                // opacity: "1",
                borderRadius: '10px',
                cursor: 'pointer',
                transitionDuration: '.4s',
                transitionTimingFunction: 'linear',
              }}
            >
              <Icon
                boxSize={[0, 8, 8, 5, 5]}
                as={link.icon}
                _hover={{
                  color: 'nk_black',
                }}
              />
              <Link
                as={NextLink}
                display={['none', 'none', 'none', 'block']}
                fontSize="md"
                fontWeight="bold"
                // letterSpacing="1px"
                href="/order"
                _hover={{
                  textDecoration: 'none',
                }}
              >
                {/* <NextLink
                        href="/order"> */}
                {link.name}
                {/* </NextLink> */}
              </Link>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Navigation;
