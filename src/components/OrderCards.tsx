import {
  Box,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

import { OrderDetails } from '../pages/queue';

interface OrderCardsProps {
  orders: OrderDetails[];
}

const OrderCards: React.FC<OrderCardsProps> = ({ orders }) => {
  return (
    <SimpleGrid minChildWidth="100px" spacing="40px">
      {orders.map((order) => (
        <Box
          key={order.name}
          bg="white"
          maxHeight="200px"
          borderRadius={20}
          boxShadow="sm"
        >
          <Flex justify="space-between" align="center" py={3} px={5}>
            <Heading size="sm" fontFamily="body">
              {order.name.toLocaleUpperCase()}
            </Heading>
            <Text
              fontSize="xs"
              color="white"
              bg="nk_orange"
              px="1.5"
              py="1"
              rounded={10}
              boxShadow="md"
            >
              {order.orderId}
            </Text>
          </Flex>
          <Divider />
          <Flex justify="space-between" align="center" py={3} px={5}>
            <Text>Iced Caramel Macchiato</Text>

            {/* <Text>Iced Caramel Macchiato</Text> */}
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default OrderCards;
