import { UseToastOptions } from '@chakra-ui/react';
import moment from 'moment';

import { MenuDetails, OrderDetails, ProductDetails } from './types';

export const generateOrderId = () => {
  const now = Date.now().toString();
  return ['NO', now.slice(10, 14)].join('-');
};

export const isValidDate = (lastUpdatedDate: number) => {
  const dateNow = moment().date();
  const dateLastUpdated = moment(lastUpdatedDate).date();

  return dateNow === dateLastUpdated;
};

export const getPrettyName = (id: string, menu: MenuDetails[]): string => {
  const product = menu.find((product: MenuDetails) => product.id === id);
  return product ? product.prettyName : '';
};

export const sortOrders = (data: OrderDetails[]) => {
  return data.sort((a, b) => a.orderTimestamp - b.orderTimestamp);
};

export const filterMenu = (menu: MenuDetails[], product: string) =>
  menu.filter((x) => x.type === product);

export const getProductPrice = (
  menu: MenuDetails[],
  product: string,
  size: string
) => menu.find((x) => x.id === product)?.price[size];

export const formatPrice = (price: number) => {
  return isNaN(price) ? `₱ 0` : `₱ ${price}`;
};

export const formatSize = (size: string) =>
  size === 'REGULAR' ? '12 oz' : '24 oz';

export const pad = (n: number) => {
  const s = '000' + n;
  return s.substring(s.length - 4);
};

export const getMenuPrice = (
  id: string,
  size: string,
  menu: MenuDetails[]
): number => {
  const product = menu.find((product: MenuDetails) => product.id === id);
  return product.price[size];
};

export const toastUtil = (title: string, status: UseToastOptions['status']) => {
  return {
    title: title,
    status: status,
    duration: 3000,
    isClosable: true,
    containerStyle: {
      fontFamily: 'body',
    },
  };
};

export const orderedProductsToString = (orders: ProductDetails[]) => {
  const orderedProducts = orders.map(
    (order) =>
      `${order.productCount}-${order.productSize}-${order.productName}-${order.productCost}`
  );

  return orderedProducts.join(', ');
};
