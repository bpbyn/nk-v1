export interface OrderDetails {
  id?: string;
  customerName: string;
  orderId: string;
  orderStatus: string;
  orderedProducts: ProductDetails[];
  orderTimestamp: number;
  orderNotes: string;
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

export interface SelectedOrderDetails {
  quantity: number;
  size: string;
}

export interface CounterDetails {
  date: number;
  queueCount: number;
}

export interface ProductSize {
  LARGE: number;
  REGULAR: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  LOADING = 'loading',
  COMPLETED = 'completed',
}

export interface OrderMenuProps {
  menu: MenuDetails[];
  sendSelectedOrderToCart?: (
    id: string,
    order: Partial<SelectedOrderDetails>
  ) => void;
  removeSelectedOrderToCart?: (id: string) => void;
  sendUpdatedValueToCart?: (category: string, value: string) => void;
  clearCart?: () => void;
  clearMenuCards?: boolean;
  cart?: OrderDetails;
  counter?: CounterDetails;
}
