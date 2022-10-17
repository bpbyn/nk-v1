import { Box, SimpleGrid } from '@chakra-ui/react';

import { OrderDetails } from '../pages/queue';

interface OrderCardsProps {
  orders: OrderDetails[];
}

const OrderCards: React.FC<OrderCardsProps> = ({ orders }) => {
  return (
    <SimpleGrid minChildWidth="100px" spacing="40px">
      {orders.map((order) => (
        <Box key={order.name} bg="white" height="80px">
          {order.name}
          {order.status}
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default OrderCards;
