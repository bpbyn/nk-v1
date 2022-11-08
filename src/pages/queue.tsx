import { Box, Heading } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import OrderCards from '../components/OrderCards';
import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import { getDocuments, updateOrderStatus } from '../lib/api/service';
import { OrderDetails } from '../types';
import { sortOrders } from '../utils';
import type { NextPageWithLayout } from './_app';

const Queue: NextPageWithLayout = () => {
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
          orderedProducts: doc.data().orderedProducts,
          orderTimestamp: doc.data().orderTimestamp,
        };
        return completeDoc;
      });

      fetchedOrders = sortOrders(fetchedOrders);
      fetchedOrders = fetchedOrders.filter((x) => x.orderStatus === 'pending');

      setCustomerOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getDocuments('menu').then((documents) => setMenu(documents));
  }, []);

  const handleCompleteTask = (order: OrderDetails) => {
    updateOrderStatus('orders', order.id).then(() => {
      // eslint-disable-next-line no-console
      console.log('update completed');
    });
  };

  return (
    <Box p={{ base: '5', lg: '10' }}>
      <Box>
        <Heading fontFamily="body" letterSpacing={5} my={5}>
          NEW ORDERS
        </Heading>
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
    </Box>
  );
};

export default Queue;

Queue.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
