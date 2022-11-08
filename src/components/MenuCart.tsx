import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Flex,
  Text,
  Tag,
  VStack,
  Image,
  Heading,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { OrderMenuProps } from '../types';
import { getPrettyName } from '../utils';
import EditableNotes from './EditableNotes';
import MenuNumberInput from './MenuNumberInput';

const MenuCart: React.FC<OrderMenuProps> = ({ menu, cart }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  // console.log('testing selected ', selectedOrdersToCart);
  // console.log('testing orderCart', cart);

  return (
    <Box
      position="sticky"
      zIndex={2}
      bottom={0}
      px={5}
      pt={10}
      mt={10}
      pb={5}
      margin="auto"
    >
      <Button
        colorScheme="orange"
        bg="nk_orange"
        onClick={onOpen}
        justifyContent="center"
        borderRadius="none"
        minW="250px"
        letterSpacing={9}
      >
        CART
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
        isFullHeight={true}
      >
        <DrawerOverlay />
        <DrawerContent w="500px" maxH="900px" left={0} right={0} mx="auto">
          <DrawerHeader bg="nk_orange" color="white">
            <Flex justify="space-between" align="center">
              <Text letterSpacing={3}>CURRENT ORDER</Text>
              <DrawerCloseButton position="unset" />
            </Flex>
          </DrawerHeader>
          <DrawerBody bg="nk_lightOrange" as={Flex} flexDir="column" gap={6}>
            <Flex justify="space-evenly" align="center">
              <EditableNotes />
              <Tag
                pt={0.5}
                color="white"
                bg="nk_orange"
                size={{ base: 'md', lg: 'lg' }}
                boxShadow="md"
              >
                <b>PO-456</b>
              </Tag>
              {/* <Tag size="lg">{moment().format('MM.DD.YYYY')}</Tag> */}
            </Flex>
            <VStack
              spacing={4}
              align="stretch"
              h="400px"
              overflowY="auto"
              px={3}
            >
              {Object.keys(cart).map((product, i) => (
                <Flex
                  key={product}
                  bg="white"
                  borderRadius={15}
                  align="center"
                  justify="space-between"
                  p={5}
                >
                  <Image
                    alt="Coffee"
                    src="/assets/coffee_image.jpg"
                    boxSize="100px"
                    borderRadius={15}
                    // w="2"
                  />
                  <VStack w="200px" justify="center">
                    <Heading size="sm" fontFamily="body">
                      {getPrettyName(product, menu)}
                    </Heading>
                    <Text
                      size="xs"
                      textTransform="capitalize"
                      color="nk_gray.30"
                      fontWeight={100}
                    >
                      {cart[product].size.toLocaleLowerCase()}
                    </Text>
                    <MenuNumberInput
                      onChange={() => i}
                      id={product}
                      initialValue={0}
                    />
                    {/* <Text>{product}</Text>
                    <Text>{cart[product].quantity}</Text>
                    <Text>{cart[product].size}</Text> */}
                  </VStack>
                </Flex>
              ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MenuCart;
