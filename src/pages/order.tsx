import { Button } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React from 'react';

import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import { generateOrderId } from '../utils';
import type { NextPageWithLayout } from './_app';

const addData = async () => {
  await addDoc(collection(db, 'orders'), {
    name: 'Test5',
    orderId: generateOrderId(),
    status: 'pending',
    order: ['BC-M', 'BC-M'],
    total: 12,
    date: Timestamp.now().seconds * 1000,
  });
};

const Order: NextPageWithLayout = () => {
  return <Button onClick={addData}>Add</Button>;
};

export default Order;

Order.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
