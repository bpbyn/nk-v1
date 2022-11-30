import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';

import { OrderMenuProps } from '../types';
import { formatPrice } from '../utils';
import MenuNumberInput from './MenuNumberInput';
import RadioCards from './RadioCards';

const MenuCards: React.FC<OrderMenuProps> = ({
  menu,
  sendSelectedOrderToCart,
  clearMenuCards,
  clearCart,
}) => {
  const [listOfOrders, setListOfOrders] = useState({});

  useEffect(() => {
    if (clearMenuCards) {
      setListOfOrders({});
      clearCart();
    }
  }, [clearCart, clearMenuCards]);

  const handleMenuChange = (value: any, id: string, category: string) => {
    setListOfOrders({
      ...listOfOrders,
      [id]: {
        ...listOfOrders[id],
        [category]: value,
      },
    });
  };

  return menu.length > 0 ? (
    <SimpleGrid minChildWidth="300px" spacing="40px">
      {menu.map((item) => (
        <Box
          key={item.id}
          bg="white"
          maxWidth={{ md: '400px' }}
          boxShadow="md"
          borderRadius={15}
        >
          <Flex h="100%">
            <Box w="200px">
              <VStack p={5} h="100%" as={Flex} justify="space-evenly" gap={2}>
                <Image
                  borderRadius={15}
                  alt="Coffee"
                  src="/assets/coffee_image.jpg"
                  boxSize="120px"
                />
                <MenuNumberInput
                  onChange={handleMenuChange}
                  id={item.id}
                  initialValue={listOfOrders[item.id]?.quantity ?? 0}
                />
              </VStack>
            </Box>
            <Box w={{ base: '190px', md: 'unset' }}>
              <Flex
                direction="column"
                justify="space-evenly"
                align="center"
                gap={3}
                h="100%"
                py={5}
                pr={5}
              >
                <Heading size="md" textAlign={{ base: 'center', md: 'unset' }}>
                  {item.prettyName}
                </Heading>
                <RadioCards
                  menu={item}
                  onChange={handleMenuChange}
                  initialValue={listOfOrders[item.id]?.size ?? ''}
                />
                <HStack align="stretch" w="100%">
                  <Tag
                    size="md"
                    flex={1}
                    bg="nk_lightOrange"
                    w="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <b>
                      {formatPrice(
                        item.price[listOfOrders[item.id]?.size] *
                          listOfOrders[item.id]?.quantity
                      )}
                    </b>
                  </Tag>
                  <IconButton
                    disabled={
                      listOfOrders[item.id]?.size &&
                      listOfOrders[item.id]?.quantity > 0
                        ? false
                        : true
                    }
                    onClick={() =>
                      sendSelectedOrderToCart(item.id, listOfOrders[item.id])
                    }
                    type="submit"
                    boxShadow="md"
                    background="nk_orange"
                    colorScheme="orange"
                    variant="solid"
                    aria-label="Search database"
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    _active={{
                      transform: 'scale(1.09)',
                    }}
                    _hover={{
                      backgroundColor: 'none',
                    }}
                    icon={<AiOutlineShoppingCart />}
                  />
                </HStack>
              </Flex>
            </Box>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  ) : (
    <Box
      as={Flex}
      flexFlow="column wrap"
      justify="start"
      mt={20}
      alignItems="center"
      h="full"
    >
      <Image
        src="assets/no_data.svg"
        alt="no_data"
        boxSize="200px"
        background="nk_gray.20"
        borderRadius="full"
      />
      <Text color="nk_gray.30" p={5}>
        Coming Soon! 😉
      </Text>
    </Box>
  );
};

export default MenuCards;
