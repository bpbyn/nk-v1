export interface OrderDetails {
  id: string;
  customerName: string;
  orderId: string;
  orderStatus: string;
  orderedProducts: ProductDetails[];
  orderTimestamp: number;
}

export interface ProductDetails {
  productName: string;
  productSize: string;
  productCount: number;
  productCost: number;
}

export interface MenuDetails {
  id: string;
  prettyName: string;
  price: ProductSize;
  type: string;
}

export interface OrderDetails {
  quantity: number;
  size: string;
}

export interface ProductSize {
  LARGE: number;
  REGULAR: number;
}

export interface OrderMenuProps {
  menu: MenuDetails[];
  sendSelectedOrderToCart?: (id: string, order: OrderDetails) => void;
  cart?: any;
}
