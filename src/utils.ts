import { MenuDetails, OrderDetails } from './types';

export const generateOrderId = () => {
  const now = Date.now().toString();
  return ['NO', now.slice(10, 14)].join('-');
};

export const getPrettyName = (id: string, menu: MenuDetails[]): string => {
  const product = menu.find((product: MenuDetails) => product.id === id);
  return product ? product.prettyName : '';
};

export const sortOrders = (data: OrderDetails[]) => {
  return data.sort((a, b) => a.orderTimestamp - b.orderTimestamp);
};
