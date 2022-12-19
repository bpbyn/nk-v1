import {
  Box,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import OrderCards from '../components/OrderCards';
import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import { getDocuments, updateOrderStatus } from '../lib/api/service';
import { OrderDetails, OrderStatus } from '../types';
import { sortOrders, toastUtil } from '../utils';
import type { NextPageWithLayout } from './_app';

const Queue: NextPageWithLayout = () => {
  const toast = useToast();
  // const [customerOrders, setCustomerOrders] = useState(null);
  const [ordersToBrew, setOrdersToBrew] = useState(null);
  const [ordersToServe, setOrdersToServe] = useState(null);
  const [menu, setMenu] = useState(null);

  const orderStatusTabs = ['Now Brewing', 'Now Serving'];

  useEffect(() => {
    const orderCollectionRef = collection(db, 'orders');
    const startDay = moment().startOf('day').valueOf();

    const q = query(orderCollectionRef, where('orderTimestamp', '>', startDay));
    const unsubscribe = onSnapshot(q, (qSnapshots) => {
      let fetchedOrders: OrderDetails[] = [];
      fetchedOrders = qSnapshots.docs.map((doc) => {
        const completeDoc: OrderDetails = {
          id: doc.id,
          customerName: doc.data().customerName,
          orderId: doc.data().orderId,
          orderStatus: doc.data().orderStatus,
          orderNotes: doc.data().orderNotes,
          orderedProducts: doc.data().orderedProducts,
          orderTimestamp: doc.data().orderTimestamp,
        };
        return completeDoc;
      });

      fetchedOrders = sortOrders(fetchedOrders);
      // setCustomerOrders(fetchedOrders);

      // NOW BREWING
      const ordersToBrew = fetchedOrders.filter(
        (x) => x.orderStatus === OrderStatus.BREWING
      );
      setOrdersToBrew(ordersToBrew);

      // NOW SERVING
      const ordersToServe = fetchedOrders.filter(
        (x) => x.orderStatus === OrderStatus.SERVING
      );
      setOrdersToServe(ordersToServe);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDocuments('menu').then((documents) => setMenu(documents));
  }, []);

  const handleCompleteTask = (order: OrderDetails, status: OrderStatus) => {
    updateOrderStatus('orders', order.id, status)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('update completed');
        if (status === OrderStatus.SERVING) {
          toast(
            toastUtil(
              `Order (${order.orderId}) by ${order.customerName} is now ready to be served!`,
              'success'
            )
          );
        }

        if (status === OrderStatus.CANCELLED) {
          toast(
            toastUtil(
              `Order (${order.orderId}) by ${order.customerName} is now cancelled.`,
              'error'
            )
          );
        }

        if (status === OrderStatus.COMPLETED) {
          toast(
            toastUtil(
              `Order (${order.orderId}) by ${order.customerName} has been completed.`,
              'success'
            )
          );
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        toast(toastUtil(`Failed to complete order.`, 'error'));
      });
  };

  return (
    <Flex p={{ base: '5', lg: '10' }} h="full" flexDir="column">
      <Tabs variant="soft-rounded" size="md" align="center" h="full">
        <TabList>
          {orderStatusTabs.map((status) => (
            <Tab
              key={status}
              fontWeight="300"
              _selected={{
                bg: 'nk_orange',
                color: 'white',
              }}
            >
              {status}
            </Tab>
          ))}
        </TabList>
        <TabPanels h="90%">
          {[ordersToBrew, ordersToServe].map((orders, i) => (
            <TabPanel key={i} h="full">
              {orders?.length === 0 ? (
                <Box
                  as={Flex}
                  flexFlow="column wrap"
                  justify="center"
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
                    {`You're All Caught Up For Now 🤭`}
                  </Text>
                </Box>
              ) : orders ? (
                <OrderCards
                  customerOrders={orders}
                  menu={menu}
                  handleCompleteTask={handleCompleteTask}
                />
              ) : (
                <LoadingSpinner />
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Queue;

Queue.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight={true}>{page}</Layout>;
};
