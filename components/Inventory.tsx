import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (id: string, newStock: number) => void;
  onAddStock: (id: string, amount: number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onUpdateStock, onAddStock }) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [addStockAmount, setAddStockAmount] = useState<number>(0);

  const handleQuickAdd = (id: string) => {
    if (addStockAmount > 0) {
      onAddStock(id, addStockAmount);
      setAddStockAmount(0);
      setSelectedProductId(null);
    }
  };

  // Group items by name to calculate total stock per brand
  const stockSummary = products.reduce((acc, curr) => {
    if (!acc[curr.name]) acc[curr.name] = 0;
    acc[curr.name] += curr.stock;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-gradient-to-br from-gray-800 to-black text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium opacity-70 mb-2">Total Items in Stock</h3>
          <div className="text-4xl font-bold">
            {products.reduce((acc, curr) => acc + curr.stock, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
           <h3 className="text-sm font-medium text-gray-500 mb-3">Stock by Brand</h3>
           <div className="flex flex-wrap gap-2">
             {Object.entries(stockSummary).map(([name, count]) => (
               <div key={name} className="flex flex-col bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                 <span className="text-xs text-gray-500">{name}</span>
                 <span className="font-bold text-gray-800">{count}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">Size</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{product.size}</span>
                </td>
                <td className="p-4 font-bold text-lg text-gray-800">
                  {product.stock}
                </td>
                <td className="p-4">
                  {product.stock === 0 ? (
                    <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-full">OUT OF STOCK</span>
                  ) : product.stock < 20 ? (
                    <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded-full">LOW STOCK</span>
                  ) : (
                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">IN STOCK</span>
                  )}
                </td>
                <td className="p-4">
                  {selectedProductId === product.id ? (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        autoFocus
                        className="w-20 p-1 border rounded text-center"
                        placeholder="Add"
                        value={addStockAmount || ''}
                        onChange={(e) => setAddStockAmount(parseInt(e.target.value))}
                      />
                      <button 
                        onClick={() => handleQuickAdd(product.id)}
                        className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setSelectedProductId(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setSelectedProductId(product.id); setAddStockAmount(0); }}
                      className="text-cokeRed hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Add Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};