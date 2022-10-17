import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import OrderCards from '../components/OrderCard';
import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import type { NextPageWithLayout } from './_app';

export interface OrderDetails {
  name: string;
  date?: Date;
  order: string[];
  status: string;
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
      // eslint-disable-next-line no-console
      console.log(fetchedOrders);
      setCustomerOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, []);

  return (
    // <Flex w="100%" flexDir="column" h="100%">
    customerOrders && <OrderCards orders={customerOrders} />

    // </Flex>
  );
};

export default Queue;

Queue.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
