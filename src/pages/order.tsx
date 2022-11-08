import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
// import { addDoc, collection } from 'firebase/firestore';
// import moment from 'moment';
import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import MenuCards from '../components/MenuCards';
import MenuCart from '../components/MenuCart';
// import MenuCart from '../components/MenuCart';
// import MenuTable from '../components/MenuTable';
import Layout from '../layouts/Layout';
// import { db } from '../lib/api/firebase';
import { getDocuments } from '../lib/api/service';
import { OrderDetails } from '../types';
import { filterMenu } from '../utils';
import type { NextPageWithLayout } from './_app';

// const addData = async () => {
//   await addDoc(collection(db, 'orders'), {
//     customerName: 'ZEZE',
//     orderId: generateOrderId(),
//     orderStatus: 'pending',
//     orderedProducts: [
//       {
//         productName: 'CARAMEL_MACCHIATO',
//         productSize: 'REGULAR',
//         productCount: 1,
//         productCost: 70,
//       },
//       {
//         productName: 'BUTTERSCOTCH_LATTE',
//         productSize: 'REGULAR',
//         productCount: 2,
//         productCost: 140,
//       },
//       {
//         productName: 'BUTTERSCOTCH_LATTE',
//         productSize: 'REGULAR',
//         productCount: 2,
//         productCost: 140,
//       },
//     ],
//     orderTimestamp: moment().valueOf(),
//   });
// };

const Order: NextPageWithLayout = () => {
  const [menu, setMenu] = useState(null);
  const [cart, setSelectedOrdersToCart] = useState({});

  useEffect(() => {
    getDocuments('menu').then((documents) => setMenu(documents));
  }, []);

  const handleOrderCart = (id: string, order: OrderDetails) => {
    setSelectedOrdersToCart({
      ...cart,
      [id]: {
        ...cart[id],
        ...order,
        quantity: order.quantity + (cart[id]?.quantity ?? 0),
      },
    });
  };

  const menuItems = ['Coffee', 'Non Coffee', 'Snacks'];
  // console.log('order', cart);

  return (
    <Flex
      flexDir="column"
      justify="space-between"
      h="full"
      position="relative"
      zIndex={1}
    >
      <Tabs
        variant="soft-rounded"
        p={{ base: '5', lg: '5' }}
        // display={{ md: 'flex' }}
        // flexDir="column"
        // align="center"
      >
        <TabList>
          {menuItems.map((item) => (
            <Tab
              // borderTopRadius={15}
              fontWeight={100}
              key={item}
              _selected={{ bg: 'nk_orange', color: 'white' }}
            >
              {item}
            </Tab>
          ))}
        </TabList>
        {menu ? (
          <TabPanels>
            {menu &&
              menuItems.map((item) => (
                <TabPanel key={item} px={0} pb={0}>
                  <MenuCards
                    menu={filterMenu(menu, item)}
                    sendSelectedOrderToCart={handleOrderCart}
                  />
                </TabPanel>
              ))}
          </TabPanels>
        ) : (
          <LoadingSpinner />
        )}
      </Tabs>
      <MenuCart menu={menu} cart={cart} />
    </Flex>
  );
};

export default Order;

Order.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight={true}>{page}</Layout>;
};
