import { Button } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { addDoc, collection } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';

import Layout from '../layouts/Layout';
import { db } from '../lib/api/firebase';
import { generateOrderId } from '../utils';
import type { NextPageWithLayout } from './_app';

const addData = async () => {
  await addDoc(collection(db, 'orders'), {
    customerName: 'ZEZE',
    orderId: generateOrderId(),
    orderStatus: 'pending',
    orderedProducts: [
      {
        productName: 'CARAMEL_MACCHIATO',
        productSize: 'REGULAR',
        productCount: 1,
        productCost: 70,
      },
      {
        productName: 'BUTTERSCOTCH_LATTE',
        productSize: 'REGULAR',
        productCount: 2,
        productCost: 140,
      },
      {
        productName: 'BUTTERSCOTCH_LATTE',
        productSize: 'REGULAR',
        productCount: 2,
        productCost: 140,
      },
    ],
    orderTimestamp: moment().valueOf(),
  });
};

const Order: NextPageWithLayout = () => {
  return <Button onClick={addData}>Add</Button>;
};

export default Order;

Order.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight>{page}</Layout>;
};
