import React, { useState, useEffect, useMemo } from 'react';
import { Product, Sale, SaleItem, PRODUCT_NAMES, BOTTLE_SIZES } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircleIcon, XCircleIcon, PrinterIcon, PlusCircleIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface SalesProps {
  products: Product[];
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
}

export const Sales: React.FC<SalesProps> = ({ products, sales, onAddSale }) => {
  // Transaction State
  const [customerName, setCustomerName] = useState('');
  const [paymentType, setPaymentType] = useState<'Cash' | 'Transfer'>('Cash');
  const [isPaid, setIsPaid] = useState(true);
  const [cart, setCart] = useState<SaleItem[]>([]);
  
  // Item Entry State
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_NAMES[0]);
  const [selectedSize, setSelectedSize] = useState(BOTTLE_SIZES[1]);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);

  // Find the matching inventory product to get default price/ID
  const matchedProduct = useMemo(() => {
    return products.find(p => p.name === selectedProduct && p.size === selectedSize);
  }, [products, selectedProduct, selectedSize]);

  // Update default unit price when product selection changes
  useEffect(() => {
    if (matchedProduct) {
      setUnitPrice(matchedProduct.price);
    } else {
      setUnitPrice(0);
    }
  }, [matchedProduct]);

  const addToCart = () => {
    if (quantity <= 0) return;

    const newItem: SaleItem = {
      productId: matchedProduct ? matchedProduct.id : `temp-${Date.now()}`,
      name: selectedProduct,
      size: selectedSize,
      quantity: quantity,
      unitPrice: unitPrice,
      subtotal: unitPrice * quantity
    };

    setCart(prev => [...prev, newItem]);
    // Reset minimal item fields for next entry
    setQuantity(1);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);

  const handleCompleteTransaction = () => {
    if (cart.length === 0) return;

    const newSale: Sale = {
      id: uuidv4(),
      customerName: customerName || 'Walk-in Customer',
      items: cart,
      totalAmount: cartTotal,
      paymentType,
      isPaid,
      date: new Date().toISOString(),
    };

    onAddSale(newSale);
    setReceiptSale(newSale);
    
    // Clear Form
    setCustomerName('');
    setCart([]);
    setIsPaid(true);
    setPaymentType('Cash');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sales Point</h2>
        <div className="text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Item Entry & Cart Building */}
        <div className="space-y-6">
          
          {/* Item Entry Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-cokeRed flex items-center">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Product to Order
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                >
                  {PRODUCT_NAMES.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                >
                  {BOTTLE_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
               <div className="col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                 <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                />
              </div>
              <div className="col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (₦)</label>
                 <input
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                />
              </div>
              <div className="col-span-1 flex flex-col justify-end">
                <button
                  onClick={addToCart}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {matchedProduct && (
              <div className="text-xs text-gray-500">
                Stock Available: <span className="font-semibold">{matchedProduct.stock}</span>
              </div>
            )}
          </div>

          {/* Current Cart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Current Order
              </h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{cart.length} items</span>
            </div>
            
            <div className="overflow-y-auto max-h-[300px]">
              {cart.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Cart is empty</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium sticky top-0">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="p-3">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.size}</div>
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">₦{item.unitPrice}</td>
                        <td className="p-3 text-right font-bold">₦{item.subtotal}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-lg font-medium text-gray-600">Total</span>
                 <span className="text-2xl font-bold text-cokeRed">₦{cartTotal.toLocaleString()}</span>
               </div>
               
               <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name (Optional)"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-3"
                    />
                    <div className="flex space-x-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType('Cash')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          paymentType === 'Cash' ? 'bg-green-600 text-white' : 'bg-white border text-gray-600'
                        }`}
                      >
                        Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType('Transfer')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          paymentType === 'Transfer' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'
                        }`}
                      >
                        Transfer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPaid(!isPaid)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                          isPaid ? 'bg-green-100 text-green-800 border-green-200 border' : 'bg-red-100 text-red-800 border-red-200 border'
                        }`}
                      >
                        {isPaid ? <CheckCircleIcon className="w-4 h-4"/> : <XCircleIcon className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCompleteTransaction}
                    disabled={cart.length === 0}
                    className="w-full bg-cokeRed hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all transform active:scale-95"
                  >
                    Complete Transaction
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Receipt & History */}
        <div className="space-y-6">
           {/* Receipt Preview Area */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
            {receiptSale ? (
              <div className="w-full max-w-sm bg-white p-6 shadow-lg border border-gray-100 text-center relative receipt-print">
                <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                  <h2 className="text-xl font-bold uppercase tracking-wider">Elmubarak Plaza</h2>
                  <p className="text-xs text-gray-500">Wholesale & Retail • Gombe State</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(receiptSale.date).toLocaleString()}</p>
                </div>
                
                <div className="text-left space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-semibold">{receiptSale.customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold">{receiptSale.paymentType}</span>
                  </div>
                </div>

                <div className="border-b border-gray-100 mb-4 pb-2">
                   <table className="w-full text-xs text-left">
                     <thead>
                       <tr className="text-gray-500 border-b border-gray-200">
                         <th className="pb-1">Item</th>
                         <th className="pb-1 text-center">Qty</th>
                         <th className="pb-1 text-right">Price</th>
                         <th className="pb-1 text-right">Amt</th>
                       </tr>
                     </thead>
                     <tbody>
                       {receiptSale.items.map((item, idx) => (
                         <tr key={idx}>
                           <td className="py-1">{item.name} {item.size}</td>
                           <td className="py-1 text-center">{item.quantity}</td>
                           <td className="py-1 text-right">{item.unitPrice}</td>
                           <td className="py-1 text-right font-medium">{item.subtotal}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>

                <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>TOTAL</span>
                    <span>₦{receiptSale.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className={`mt-2 text-xs font-bold px-2 py-1 rounded inline-block ${receiptSale.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {receiptSale.isPaid ? 'PAID' : 'NOT PAID'}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 italic">
                  Refresh your shopping!<br/>
                  Thanks for your patronage!
                </div>

                <button 
                  onClick={handlePrint}
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-cokeRed hover:text-red-700 font-medium print:hidden"
                >
                  <PrinterIcon className="w-5 h-5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <PrinterIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Complete a sale to generate receipt</p>
              </div>
            )}
          </div>

          {/* Recent Sales List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="p-4">Time</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">No sales yet</td>
                    </tr>
                  ) : (
                    sales.slice(0, 10).map((sale) => (
                      <tr key={sale.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-500">
                          {new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="p-4 font-medium">{sale.customerName}</td>
                        <td className="p-4 text-gray-600">
                           {sale.items.length} item(s)
                           <div className="text-xs text-gray-400 truncate max-w-[150px]">
                             {sale.items.map(i => i.name).join(', ')}
                           </div>
                        </td>
                        <td className="p-4 font-bold text-gray-800">₦{sale.totalAmount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            sale.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {sale.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};