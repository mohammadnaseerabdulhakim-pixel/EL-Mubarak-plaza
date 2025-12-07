import { Product } from './types';
import { v4 as uuidv4 } from 'uuid';

// Using a high quality red texture similar to the request's vibe
// Since we can't use the exact uploaded image, we use a thematic placeholder
export const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop"; 

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Coca Cola', size: '50cl', price: 250, stock: 100 },
  { id: '2', name: 'Coca Cola', size: '35cl', price: 150, stock: 100 },
  { id: '3', name: 'Fanta', size: '50cl', price: 250, stock: 100 },
  { id: '4', name: 'Fanta', size: '35cl', price: 150, stock: 100 },
  { id: '5', name: 'Sprite', size: '50cl', price: 250, stock: 100 },
  { id: '6', name: '5 Alive Big', size: '60cl', price: 800, stock: 50 },
  { id: '7', name: '5 Alive Small', size: '35cl', price: 300, stock: 50 },
  { id: '8', name: 'Predator', size: '50cl', price: 200, stock: 80 },
  { id: '9', name: 'Mr V', size: '50cl', price: 200, stock: 80 },
];