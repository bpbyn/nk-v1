import {
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  StackDivider,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';

import { MenuDetails, OrderDetails } from '../types';
import { getPrettyName } from '../utils';

interface OrderCardsProps {
  customerOrders: OrderDetails[];
  menu: MenuDetails[];
  handleCompleteTask: (order: OrderDetails) => void;
}

const OrderCards: React.FC<OrderCardsProps> = ({
  customerOrders,
  menu,
  handleCompleteTask,
}) => {
  return (
    <SimpleGrid minChildWidth={{ base: '250px', xl: '300px' }} spacing="40px">
      {customerOrders.map((o) => (
        <Box
          key={o.orderId}
          bg="white"
          maxWidth="400px"
          borderRadius={20}
          boxShadow="md"
        >
          <Flex justify="space-between" align="center" py={3} px={5}>
            <Heading
              size="md"
              fontFamily="body"
              bg="nk_orange"
              rounded={10}
              px="1.5"
              py="1"
              pt="1.5"
              color="white"
            >
              {o.customerName?.toLocaleUpperCase()}
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
              {o.orderId}
            </Text>
          </Flex>
          <Divider />
          <VStack
            divider={<StackDivider opacity="0.6" />}
            spacing={1}
            align="stretch"
          >
            {o.orderedProducts.map((p, i) => (
              <Flex
                key={`ordered-products-${i}`}
                justify="space-evenly"
                gap={5}
                py={5}
              >
                <Image
                  alt="Coffee"
                  src="/assets/coffee_image.jpg"
                  boxSize="80px"
                  borderRadius={50}
                />
                <Flex
                  flexDir="column"
                  gap={2}
                  justify="center"
                  align="start"
                  w="200px"
                >
                  <Heading size="sm" fontFamily="body">
                    {getPrettyName(p.productName, menu)}
                  </Heading>
                  <Wrap>
                    <Text
                      w="fit-content"
                      color="white"
                      bg="nk_orange"
                      px="1.5"
                      rounded={5}
                      boxShadow="md"
                      textTransform="capitalize"
                    >
                      {p.productCount}
                    </Text>
                    <Text
                      w="fit-content"
                      color="white"
                      bg="nk_gray.30"
                      px="1.5"
                      rounded={5}
                      boxShadow="md"
                      textTransform="capitalize"
                    >
                      {p.productSize.toLocaleLowerCase()}
                    </Text>
                  </Wrap>
                </Flex>
              </Flex>
            ))}
            {o.orderNotes && (
              <Box>
                <Flex
                  justify="center"
                  py={3}
                  align="center"
                  flexDir="column"
                  gap={2}
                >
                  <Badge colorScheme="green" alignItems="center">
                    NOTES:
                  </Badge>
                  <Code maxW="300px" colorScheme="yellow">
                    {o?.orderNotes}
                  </Code>
                </Flex>
                <Divider />
              </Box>
            )}
          </VStack>
          {!o.orderNotes && <Divider />}
          <Flex justify="center">
            <Button
              colorScheme="green"
              onClick={() => handleCompleteTask(o)}
              fontWeight={500}
              borderRadius={15}
              my={5}
            >
              Serve
            </Button>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default OrderCards;
