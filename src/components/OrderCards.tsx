import {
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  StackDivider, // Tag,
  Text,
  useDisclosure,
  VStack,
  Wrap,
} from '@chakra-ui/react';

import { MenuDetails, OrderDetails, OrderStatus } from '../types';
import { getPrettyName } from '../utils';

interface OrderCardsProps {
  customerOrders: OrderDetails[];
  menu: MenuDetails[];
  handleCompleteTask: (order: OrderDetails, status: OrderStatus) => void;
}

const OrderCards: React.FC<OrderCardsProps> = ({
  customerOrders,
  menu,
  handleCompleteTask,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
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
                p={5}
              >
                <Image
                  alt="Coffee"
                  src="/assets/coffee_image.jpg"
                  boxSize="80px"
                  borderRadius={50}
                />
                <Flex
                  flexDir="column"
                  gap={3}
                  justify="center"
                  align="center"
                  w="200px"
                >
                  {/* <Tag bg="red.500" opacity={0.9} pt={1} color="white">
                    🔥 HOT
                  </Tag> */}
                  {/* <Tag bg="blue.500" opacity={0.9} pt={1} color="white">
                    ❄️ COLD
                  </Tag> */}
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
          <Flex
            justify={
              o.orderStatus === OrderStatus.BREWING ? 'space-around' : 'center'
            }
          >
            <Button
              colorScheme="green"
              onClick={() => {
                if (o.orderStatus === OrderStatus.BREWING) {
                  handleCompleteTask(o, OrderStatus.SERVING);
                } else {
                  handleCompleteTask(o, OrderStatus.COMPLETED);
                }
              }}
              fontWeight={500}
              borderRadius={15}
              my={5}
            >
              {o.orderStatus === OrderStatus.BREWING ? 'Serve' : 'Complete'}
            </Button>
            {o.orderStatus === OrderStatus.BREWING && (
              <>
                <Button
                  colorScheme="red"
                  opacity={0.9}
                  onClick={onToggle}
                  fontWeight={500}
                  borderRadius={15}
                  my={5}
                >
                  Cancel
                </Button>
                <Modal onClose={onClose} isOpen={isOpen} isCentered size="xs">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      Are you sure you want to cancel this order?
                    </ModalBody>
                    <ModalFooter as={Flex} justifyContent="space-around">
                      <Button
                        colorScheme="orange"
                        bg="nk_orange"
                        borderRadius={15}
                        onClick={() => {
                          handleCompleteTask(o, OrderStatus.CANCELLED);
                          onClose();
                        }}
                      >
                        Yes
                      </Button>
                      <Button borderRadius={15} onClick={onClose}>
                        No
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default OrderCards;
