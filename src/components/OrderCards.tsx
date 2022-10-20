import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
// import { useState } from 'react';
import {
  FaAngleDoubleRight, // FaArrowRight,
  // FaRegCheckCircle,
} from 'react-icons/fa';

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
  // const [test, setTest] = useState(false);

  // let test = false;

  return (
    <SimpleGrid minChildWidth={{ base: '250px', xl: '300px' }} spacing="40px">
      {customerOrders.map((o) => (
        <Box
          key={o.orderId}
          bg="white"
          maxWidth="400px"
          borderRadius={20}
          boxShadow="sm"
        >
          <Flex
            justify="space-between"
            align="center"
            py={3}
            px={5}
            // direction={{ base: 'column', lg: 'row' }}
          >
            <Heading size="md" fontFamily="body">
              {o.customerName.toLocaleUpperCase()}
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
            divider={<StackDivider borderStyle="dotted" />}
            spacing={1}
            align="stretch"
          >
            {o.orderedProducts.map((p, i) => (
              <Flex key={`ordered-products-${i}`} justify="space-evenly" py={1}>
                <Text fontSize="sm" as="b" textAlign="right">
                  x {p.productCount}
                </Text>
                <Text
                  fontSize="sm"
                  color="white"
                  bg="nk_gray.30"
                  px="1.5"
                  rounded={5}
                  boxShadow="md"
                  textTransform="capitalize"
                >
                  {p.productSize.toLocaleLowerCase()}
                </Text>
                <Text fontSize="sm">{getPrettyName(p.productName, menu)}</Text>
              </Flex>
            ))}
          </VStack>
          <Divider />
          <Flex justify="center">
            <Button
              my={5}
              rightIcon={<FaAngleDoubleRight />}
              colorScheme="green"
              variant="solid"
              onClick={() => handleCompleteTask(o)}
              // isLoading={test}
              // // display={test && 'none'}
              // // onClick={() => {
              // //   setTimeout(() => {
              // //     setTest(true);
              // //   }, 1000);
              // // }}
            >
              Serve
            </Button>

            {/* {test && (
              <Icon as={FaRegCheckCircle} color="green" fontSize="2xl" my={5} />
            )} */}
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default OrderCards;
