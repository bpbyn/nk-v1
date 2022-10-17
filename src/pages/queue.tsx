import { Box, Heading } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import OrderCards from '../components/OrderCards';
import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import type { NextPageWithLayout } from './_app';

export interface OrderDetails {
  name: string;
  orderId: string;
  status: string;
  order: string[];
  total: number;
  date?: Date;
}

const Queue: NextPageWithLayout = () => {
  const [customerOrders, setCustomerOrders] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'));

    const unsubscribe = onSnapshot(q, (qSnapshots) => {
      const fetchedOrders = qSnapshots.docs.map((doc) => {
        const initDoc = doc.data();
        const completeDoc = {
          id: doc.id,
          ...initDoc,
        };
        return completeDoc;
      });
      setCustomerOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  return (
    // <Flex w="100%" flexDir="column" h="100%">
    <Box p={10}>
      <Heading fontFamily="body" letterSpacing={5} my={5}>
        NEW ORDERS
      </Heading>
      {customerOrders && <OrderCards orders={customerOrders} />}
    </Box>

    // </Flex>
  );
};

export default Queue;

Queue.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
