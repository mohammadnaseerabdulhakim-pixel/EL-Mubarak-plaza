import React, { useState, useEffect } from 'react';
import { Sales } from './components/Sales';
import { Inventory } from './components/Inventory';
import { Expenses } from './components/Expenses';
import { Summary } from './components/Summary';
import { Product, Sale, Expense } from './types';
import { INITIAL_PRODUCTS, BACKGROUND_IMAGE } from './constants';
import { ChartBarIcon, CurrencyDollarIcon, CubeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'expenses' | 'summary'>('sales');
  
  // State initialization with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('elmubarak_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('elmubarak_sales');
    if (!saved) return [];
    
    // Migration: Convert old single-item sales to new multi-item structure if necessary
    const parsedData = JSON.parse(saved);
    return parsedData.map((s: any) => {
      if (!s.items) {
        // Create a synthetic item for old records
        return {
          id: s.id,
          customerName: s.customerName,
          items: [{
            productId: 'legacy', 
            name: s.product, 
            size: s.size, 
            quantity: s.quantity, 
            unitPrice: s.totalAmount / (s.quantity || 1),
            subtotal: s.totalAmount
          }],
          totalAmount: s.totalAmount,
          paymentType: s.paymentType,
          isPaid: s.isPaid,
          date: s.date
        } as Sale;
      }
      return s as Sale;
    });
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('elmubarak_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('elmubarak_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('elmubarak_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('elmubarak_expenses', JSON.stringify(expenses)); }, [expenses]);

  // Handlers
  const handleAddSale = (newSale: Sale) => {
    // Deduct inventory for each item in the cart
    setProducts(prevProducts => {
      let updatedProducts = [...prevProducts];
      
      newSale.items.forEach(item => {
        updatedProducts = updatedProducts.map(p => {
          // Try to match by ID first, otherwise fallback to name/size match for legacy/manual safety
          if (p.id === item.productId || (p.name === item.name && p.size === item.size)) {
            return { ...p, stock: Math.max(0, p.stock - item.quantity) };
          }
          return p;
        });
      });
      
      return updatedProducts;
    });

    setSales(prev => [newSale, ...prev]);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleAddStock = (productId: string, amountToAdd: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + amountToAdd } : p));
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <div 
      className="min-h-screen w-full bg-fixed bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 glass-panel shadow-md p-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cokeRed tracking-tight uppercase">Elmubarak Plaza</h1>
            <p className="text-xs text-gray-600 font-medium">Wholesale & Retail • Gombe State</p>
          </div>
          <div className="hidden md:block">
            <span className="bg-cokeRed text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              SHOP MANAGER
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="glass-panel rounded-2xl shadow-xl min-h-[80vh] flex flex-col md:flex-row overflow-hidden">
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-between bg-white border-b overflow-x-auto p-2">
            {[
              { id: 'sales', icon: CurrencyDollarIcon, label: 'Sales' },
              { id: 'inventory', icon: CubeIcon, label: 'Inventory' },
              { id: 'expenses', icon: ClipboardDocumentListIcon, label: 'Expenses' },
              { id: 'summary', icon: ChartBarIcon, label: 'Summary' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center min-w-[70px] p-2 rounded-lg transition-colors ${
                  activeTab === tab.id ? 'bg-cokeRed text-white' : 'text-gray-500'
                }`}
              >
                <tab.icon className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-200">
            <div className="p-4 space-y-2">
              {[
                { id: 'sales', icon: CurrencyDollarIcon, label: 'Sales Point' },
                { id: 'inventory', icon: CubeIcon, label: 'Inventory' },
                { id: 'expenses', icon: ClipboardDocumentListIcon, label: 'Expenses' },
                { id: 'summary', icon: ChartBarIcon, label: 'Daily Summary' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all font-medium ${
                    activeTab === tab.id 
                      ? 'bg-white shadow-md text-cokeRed border border-gray-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-white/50 p-4 md:p-8">
            {activeTab === 'sales' && (
              <Sales 
                products={products} 
                sales={sales} 
                onAddSale={handleAddSale} 
              />
            )}
            {activeTab === 'inventory' && (
              <Inventory 
                products={products} 
                onUpdateStock={handleUpdateStock} 
                onAddStock={handleAddStock}
              />
            )}
            {activeTab === 'expenses' && (
              <Expenses 
                expenses={expenses} 
                onAddExpense={handleAddExpense} 
              />
            )}
            {activeTab === 'summary' && (
              <Summary 
                sales={sales} 
                expenses={expenses} 
                products={products} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;