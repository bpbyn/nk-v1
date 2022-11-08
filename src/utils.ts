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

export const filterMenu = (menu: MenuDetails[], product: string) =>
  menu.filter((x) => x.type === product);

export const formatPrice = (price: number) => {
  return isNaN(price) ? `₱ 0` : `₱ ${price}`;
};
