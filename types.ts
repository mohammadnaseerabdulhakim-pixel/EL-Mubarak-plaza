export interface Product {
  id: string;
  name: string; // Coca Cola, Fanta, etc.
  size: '50cl' | '35cl' | '60cl' | '33cl' | 'Can' | 'Other';
  price: number;
  stock: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  paymentType: 'Cash' | 'Transfer';
  isPaid: boolean;
  date: string; // ISO string
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  type: 'General' | 'Labour' | 'Restock';
  date: string;
}

export type BottleSize = '50cl' | '35cl' | '60cl' | '33cl';

export const BOTTLE_SIZES: BottleSize[] = ['60cl', '50cl', '35cl', '33cl'];

export const PRODUCT_NAMES = [
  'Coca Cola',
  'Fanta',
  'Sprite',
  '5 Alive Big',
  '5 Alive Small',
  'Predator',
  'Mr V',
  'Water'
];