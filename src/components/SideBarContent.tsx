import { Box, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { FaChartLine, FaClipboardList, FaCoffee, FaCog } from 'react-icons/fa';

interface SideBarProps {
  isMobile: boolean;
  onClose?: () => void;
}

interface LinkItemProps {
  name: string;
  route: string;
  icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'My Orders', route: '/order', icon: FaClipboardList },
  { name: 'Queue', route: '/queue', icon: FaCoffee },
  { name: 'Analytics', route: '/analytics', icon: FaChartLine },
  { name: 'Settings', route: '/settings', icon: FaCog },
];

const SideBarContent: React.FC<SideBarProps> = ({ onClose, isMobile }) => {
  const router = useRouter();
  const [nav, setNav] = useState(router.pathname);

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      w="100%"
      pl={5}
    >
      <VStack spacing={4} align="stretch" w="full">
        {LinkItems.map((link) => {
          return (
            <NextLink key={link.name} href={link.route}>
              <Box
                as={Flex}
                align="center"
                justify="start"
                gap="15px"
                p={3}
                w="100%"
                onClick={() => {
                  isMobile && onClose();
                  setNav(link.route);
                }}
                color={nav === link.route ? 'nk_black' : 'nk_gray.30'}
                bg={{
                  base: nav === link.route && 'nk_lightOrange',
                }}
                borderTopLeftRadius={50}
                borderBottomLeftRadius={50}
                _hover={{
                  bg: 'nk_lightOrange',
                  color: 'nk_black',
                  cursor: 'pointer',
                  transitionDuration: '.4s',
                  transitionTimingFunction: 'linear',
                }}
              >
                <Icon boxSize={[7, 7, 8, 5]} as={link.icon} />
                <Text
                  display={['block', 'none', 'none', 'block']}
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
  );
};

export default SideBarContent;
