import React, { useState } from 'react';
import { Expense } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
}

export const Expenses: React.FC<ExpensesProps> = ({ expenses, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'General' | 'Labour' | 'Restock'>('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense: Expense = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    setDescription('');
    setAmount('');
    setType('General');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Expenses Log</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 text-cokeRed">Record Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Shop Cleaning, Fuel"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cokeRed outline-none"
                >
                  <option value="General">General</option>
                  <option value="Labour">Labour</option>
                  <option value="Restock">Restock Inventory</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all mt-4"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Expense History</h3>
              <div className="text-sm font-bold text-cokeRed">
                Total: ₦{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">No expenses recorded</td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-500">
                           {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium text-gray-800">{expense.description}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            expense.type === 'Labour' ? 'bg-blue-100 text-blue-700' :
                            expense.type === 'Restock' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {expense.type}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-gray-900">
                          -₦{expense.amount.toLocaleString()}
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