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
  Textarea,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';

import { addOrder, updateCounter } from '../lib/api/service';
import {
  OrderDetails,
  OrderMenuProps,
  ProductDetails,
  SelectedOrderDetails,
} from '../types';
import {
  formatPrice,
  formatSize,
  getPrettyName,
  getProductPrice,
  isValidDate,
  toastUtil,
} from '../utils';
import EditableNotes from './EditableNotes';
import MenuNumberInput from './MenuNumberInput';

const MenuCart: React.FC<OrderMenuProps> = ({
  menu,
  sendSelectedOrderToCart,
  sendUpdatedValueToCart,
  removeSelectedOrderToCart,
  clearCart,
  cart,
  counter,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLoader, setOrderLoader] = useState(false);
  const btnRef = useRef();
  const toast = useToast();

  const processOrder = (orderDetails: OrderDetails) => {
    setOrderNotes('');
    setOrderLoader(true);
    if (isValidDate(counter.date)) {
      // do update transaction
      addOrder(orderDetails)
        .then((order: OrderDetails) => {
          setOrderLoader(false);
          clearCart();
          onClose();
          toast(
            toastUtil(`Order (${order.orderId}) has been placed.`, 'success')
          );
        })
        .catch(() => {
          toast(toastUtil(`Failed to place order.`, 'error'));
        });
    } else {
      updateCounter(0);
      addOrder(orderDetails)
        .then((order: OrderDetails) => {
          setOrderLoader(false);
          clearCart();
          onClose();
          toast(
            toastUtil(`Order (${order.orderId}) has been placed.`, 'success')
          );
        })
        .catch(() => {
          toast(toastUtil(`Failed to place order.`, 'error'));
        });
    }
  };

  const handleMenuChange = (value: number, id: string) => {
    const orderPayload: Partial<SelectedOrderDetails> = {
      quantity: value,
    };
    sendSelectedOrderToCart(id, orderPayload);
  };

  const totalPrice = useMemo(
    () =>
      cart.orderedProducts.reduce((a, b) => {
        return a + b.productCost;
      }, 0),
    [cart]
  );

  const totalProductCount = useMemo(
    () =>
      cart.orderedProducts.reduce((a, b) => {
        return a + b.productCount;
      }, 0),
    [cart]
  );

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
        borderRadius={15}
        minW="250px"
        visibility={cart.orderedProducts.length === 0 ? 'hidden' : 'visible'}
      >
        <Flex
          align="center"
          justify="space-between"
          w="full"
          fontWeight={500}
          gap={2}
        >
          <Text pt={1} letterSpacing={9}>
            <b>CART</b>
          </Text>
          <Box
            borderRadius="50%"
            w="25px"
            lineHeight="20px"
            letterSpacing="-1px"
            h="25px"
            pt="3.5px"
            pr="1px"
            border="1px solid white"
            fontSize="md"
          >
            {totalProductCount}
          </Box>
        </Flex>
      </Button>

      <Drawer
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
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
            <Flex justify="space-between" align="center">
              <EditableNotes
                onChange={sendUpdatedValueToCart}
                value={cart.customerName}
              />
              <Box></Box>
            </Flex>
            <VStack
              spacing={4}
              align="stretch"
              maxH="474px"
              overflowY="auto"
              pr={8}
              pt={4}
            >
              {cart.orderedProducts.map((order: ProductDetails, i) => (
                <Box key={`${order.productName}-${i}`} position="relative">
                  <Button
                    size="xs"
                    fontSize="lg"
                    colorScheme="red"
                    bg="red.300"
                    borderRadius={100}
                    position="absolute"
                    right="-10px"
                    top="-10px"
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    _active={{
                      transform: 'scale(1.09)',
                    }}
                    _hover={{
                      backgroundColor: 'none',
                    }}
                    onClick={() => removeSelectedOrderToCart(order.productName)}
                  >
                    -
                  </Button>
                  <Flex
                    bg="white"
                    borderRadius={15}
                    align="center"
                    justify="space-evenly"
                    p={5}
                    gap={5}
                  >
                    <Image
                      alt="Coffee"
                      src="/assets/coffee_image.jpg"
                      boxSize="100px"
                      borderRadius={15}
                    />
                    <VStack w="200px" justify="center" align="start">
                      <Heading size="sm" fontFamily="body">
                        {getPrettyName(order.productName, menu)}
                      </Heading>
                      <Flex>
                        <Text fontSize={14} color="nk_gray.30" fontWeight={100}>
                          {`${order.productSize} |
                          ${formatSize(order.productSize)}`}
                        </Text>
                      </Flex>
                      <Flex gap={3}>
                        <Tag size="md" flex={1} bg="nk_gray.10" w="100%" pt={1}>
                          <b>
                            {formatPrice(
                              getProductPrice(
                                menu,
                                order.productName,
                                order.productSize
                              ) * order.productCount
                            )}
                          </b>
                        </Tag>
                        <MenuNumberInput
                          onChange={handleMenuChange}
                          id={order.productName}
                          initialValue={order.productCount}
                        />
                      </Flex>
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
            <Divider borderColor="nk_gray.30" borderStyle="dashed" />
            <Flex w="full" justify="space-between">
              <Heading size="md" fontFamily="body">
                Total:
              </Heading>
              <Heading size="md" fontFamily="body" color="nk_orange">
                {formatPrice(totalPrice)}
              </Heading>
            </Flex>
            <Textarea
              bg="white"
              placeholder="Notes.."
              focusBorderColor="nk_gray.30"
              value={orderNotes}
              onBlur={() => sendUpdatedValueToCart('orderNotes', orderNotes)}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </DrawerBody>
          <DrawerFooter bg="nk_lightOrange" justifyContent="center">
            <Button
              colorScheme="orange"
              bg="nk_orange"
              fontWeight={500}
              borderRadius={15}
              isDisabled={!cart.customerName}
              isLoading={orderLoader}
              onClick={() => processOrder(cart)}
            >
              Place Order
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default MenuCart;
