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
}

export interface ProductSize {
  LARGE: number;
  REGULAR: number;
}
