import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import MenuCards from '../components/MenuCards';
import MenuCart from '../components/MenuCart';
import Layout from '../layouts/Layout';
import { getDocument, getDocuments } from '../lib/api/service';
import { OrderDetails, ProductDetails, SelectedOrderDetails } from '../types';
import { filterMenu, getMenuPrice } from '../utils';
import type { NextPageWithLayout } from './_app';

const Order: NextPageWithLayout = () => {
  const initialCart = {
    customerName: null,
    orderId: null,
    orderStatus: null,
    orderedProducts: [],
    orderTimestamp: null,
    orderNotes: null,
  };

  const [menu, setMenu] = useState(null);
  const [cart, setSelectedOrdersToCart] = useState<OrderDetails>(initialCart);
  const [clearMenuCards, setClearMenuCards] = useState(false);
  const [counter, setCounter] = useState(null);

  useEffect(() => {
    getDocuments('menu').then((documents) =>
      setMenu(
        documents.sort((a, b) => a.prettyName.localeCompare(b.prettyName))
      )
    );
  }, []);

  useEffect(() => {
    getDocument('counter', 'queue').then((doc) =>
      setCounter({ date: doc.data().date, queueCount: doc.data().queueCount })
    );
  }, []);

  const handleOrderFromMenu = (id: string, order: SelectedOrderDetails) => {
    const product = cart.orderedProducts.find((x) => x.productName === id);

    const present = cart.orderedProducts.some((prod) => {
      return prod.productName === id;
    });

    const currentProductDetails: ProductDetails = {
      productName: id,
      productSize: order.size,
      productCount: order.quantity + (product?.productCount ?? 0),
      productCost: getMenuPrice(id, order.size, menu) * order.quantity,
    };

    if (!present) {
      setSelectedOrdersToCart((prevState) => ({
        ...prevState,
        orderedProducts: [
          ...prevState.orderedProducts,
          { ...currentProductDetails },
        ],
      }));
    } else {
      setSelectedOrdersToCart((prevState) => ({
        ...prevState,
        orderedProducts: [
          ...prevState.orderedProducts.map((product) => {
            if (product.productName === id) {
              product.productCount =
                product.productSize === order.size
                  ? product.productCount + order.quantity
                  : order.quantity;
              product.productCost =
                getMenuPrice(id, order.size, menu) * product.productCount;
              product.productSize = order.size;
              return product;
            }
            return product;
          }),
        ],
      }));
    }
  };

  const handleOrderFromCart = (
    id: string,
    order: Partial<SelectedOrderDetails>
  ) => {
    setSelectedOrdersToCart((prevState) => ({
      ...prevState,
      orderedProducts: [
        ...prevState.orderedProducts.map((product) => {
          if (product.productName === id) {
            product.productCount = order.quantity;
            product.productCost =
              getMenuPrice(id, product.productSize, menu) *
              product.productCount;
            return product;
          }
          return product;
        }),
      ],
    }));
  };

  const handleRemoveOrderFromCart = (id: string) => {
    setSelectedOrdersToCart((prevState) => ({
      ...prevState,
      orderedProducts: [
        ...prevState.orderedProducts.filter(
          (product) => product.productName !== id
        ),
      ],
    }));
  };

  const handleUpdatedValueFromCart = (category: string, value: string) => {
    setSelectedOrdersToCart((prevState) => ({
      ...prevState,
      [category]: value,
    }));
  };

  const handleClearCart = () => {
    setSelectedOrdersToCart(initialCart);
    setClearMenuCards(true);
  };

  const menuItems = ['Coffee', 'Non Coffee', 'Snacks'];

  return menu ? (
    <Flex
      flexDir="column"
      justify="space-between"
      h="full"
      position="relative"
      zIndex={1}
    >
      <Tabs variant="soft-rounded" p={{ base: '5', lg: '5' }} h="full">
        <TabList justifyContent={{ base: 'center', md: 'start' }}>
          {menuItems.map((item) => (
            <Tab
              fontWeight={100}
              key={item}
              _selected={{ bg: 'nk_orange', color: 'white' }}
            >
              {item}
            </Tab>
          ))}
        </TabList>
        <TabPanels h="full">
          {menu &&
            menuItems.map((item) => (
              <TabPanel key={item} px={0} pb={0} h="full">
                <MenuCards
                  menu={filterMenu(menu, item)}
                  sendSelectedOrderToCart={handleOrderFromMenu}
                  clearMenuCards={clearMenuCards}
                  clearCart={() => setClearMenuCards(false)}
                />
              </TabPanel>
            ))}
        </TabPanels>
      </Tabs>
      <MenuCart
        menu={menu}
        cart={cart}
        counter={counter}
        sendSelectedOrderToCart={handleOrderFromCart}
        sendUpdatedValueToCart={handleUpdatedValueFromCart}
        removeSelectedOrderToCart={handleRemoveOrderFromCart}
        clearCart={handleClearCart}
      />
    </Flex>
  ) : (
    <LoadingSpinner />
  );
};

export default Order;

Order.getLayout = (page: ReactJSXElement) => {
  return <Layout fullHeight={true}>{page}</Layout>;
};
