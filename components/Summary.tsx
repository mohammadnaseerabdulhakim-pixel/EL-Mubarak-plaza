import React, { useMemo, useState } from 'react';
import { Sale, Expense, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { generateBusinessInsight } from '../services/geminiService';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface SummaryProps {
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
}

export const Summary: React.FC<SummaryProps> = ({ sales, expenses, products }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Calculations
  const totalSales = sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalSales - totalExpenses;
  
  // Count total bottles sold by iterating through items in each sale
  const totalItemsSold = sales.reduce((acc, curr) => {
    const transactionItemsCount = curr.items.reduce((sum, item) => sum + item.quantity, 0);
    return acc + transactionItemsCount;
  }, 0);

  // Daily Breakdown Data for Chart
  const dailyData = useMemo(() => {
    const data: Record<string, { name: string; sales: number; expenses: number }> = {};
    
    // Process last 7 days to ensure chart has data points
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        data[dateStr] = { name: d.toLocaleDateString('en-US', { weekday: 'short' }), sales: 0, expenses: 0 };
    }

    sales.forEach(s => {
      const date = s.date.split('T')[0];
      if (data[date]) data[date].sales += s.totalAmount;
    });
    
    expenses.forEach(e => {
      const date = e.date.split('T')[0];
      if (data[date]) data[date].expenses += e.amount;
    });

    return Object.values(data);
  }, [sales, expenses]);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const result = await generateBusinessInsight(sales, expenses, products);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Business Summary</h2>
        <button
          onClick={handleGenerateInsight}
          disabled={loadingInsight}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <SparklesIcon className="w-5 h-5 text-yellow-300" />
          <span>{loadingInsight ? 'Analyzing...' : 'Ask AI Manager'}</span>
        </button>
      </div>

      {/* AI Insight Section */}
      {insight && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm animate-fade-in">
          <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-indigo-600" />
            AI Manager Insights
          </h3>
          <div className="prose text-indigo-800 text-sm whitespace-pre-wrap">
            {insight}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₦{totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 mt-1">₦{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Net Profit</p>
          <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₦{netProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Bottles Sold</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalItemsSold}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="font-semibold text-gray-700 mb-4">Weekly Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <Tooltip cursor={{fill: '#F3F4F6'}} />
              <Bar dataKey="sales" fill="#1E1E1E" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h3 className="font-semibold text-gray-700 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#F40009" strokeWidth={3} dot={{r: 4, fill:'#F40009'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};