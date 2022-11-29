import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';

import SideBarContent from './SideBarContent';

const MobileNavigation: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      justify="space-between"
      align="center"
      bg="nk_orange"
      p={2}
      display={{ base: 'flex', sm: 'none' }}
      h="66px"
    >
      <Box as={Flex}>
        <Image
          src="assets/testproject.png"
          boxSize={['0', '50px', '75px', '100px']}
          minW={50}
          minH={50}
          alt="nk_logo"
        />
        <Flex flexDir="column" alignItems="center" justifyContent="center">
          <Heading fontSize="md" letterSpacing="3px" color="white">
            NORTHERN
          </Heading>
          <Heading
            fontSize="sm"
            letterSpacing="3px"
            color="nk_black"
            fontFamily="body"
          >
            KAFFEINE
          </Heading>
        </Flex>
      </Box>
      <IconButton
        onClick={onOpen}
        color="white"
        variant="outline"
        aria-label="open menu"
        icon={<FaBars />}
      />
      <Drawer
        size="xs"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent
          maxW="200px"
          borderTopLeftRadius={20}
          borderBottomLeftRadius={20}
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">M E N U</DrawerHeader>
          <DrawerBody py={5} px={0}>
            <SideBarContent isMobile={true} onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default MobileNavigation;
