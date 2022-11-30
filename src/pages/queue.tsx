import { Box, Flex, Heading, Image, Text, useToast } from '@chakra-ui/react';
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
  const [customerOrders, setCustomerOrders] = useState(null);
  const [menu, setMenu] = useState(null);

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
      fetchedOrders = fetchedOrders.filter(
        (x) => x.orderStatus === OrderStatus.PENDING
      );

      setCustomerOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDocuments('menu').then((documents) => setMenu(documents));
  }, []);

  const handleCompleteTask = (order: OrderDetails) => {
    updateOrderStatus('orders', order.id)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('update completed');
        toast(
          toastUtil(`Order (${order.orderId}) has been completed.`, 'success')
        );
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        toast(toastUtil(`Failed to complete order.`, 'error'));
      });
  };

  return (
    <Flex p={{ base: '5', lg: '10' }} h="full" flexDir="column">
      <Heading
        fontFamily="body"
        letterSpacing={10}
        my={5}
        textAlign={{ base: 'center', sm: 'left' }}
      >
        NEW ORDERS
      </Heading>
      {customerOrders?.length === 0 && (
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
            {`You're All Caught Up For Now 🤭`}
          </Text>
        </Box>
      )}
      <Box h="full">
        {customerOrders ? (
          <OrderCards
            customerOrders={customerOrders}
            menu={menu}
            handleCompleteTask={handleCompleteTask}
          />
        ) : (
          <LoadingSpinner />
        )}
      </Box>
    </Flex>
  );
};

export default Queue;

Queue.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight={true}>{page}</Layout>;
};
