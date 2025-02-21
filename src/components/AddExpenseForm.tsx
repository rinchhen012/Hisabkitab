import { FC, useState } from 'react';
import type { ExpenseType } from '../types';
import useStore from '../store';

interface AddExpenseFormProps {
  personId: string;
  onSubmit: (personId: string, expense: Omit<ExpenseType, 'id'>) => void;
}

const EXPENSE_CATEGORIES = [
  {
    id: 'food-drinks',
    label: 'Food/Drinks',
    color: 'blue',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    id: 'petrol',
    label: 'Petrol',
    color: 'green',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3v12c0 1.1.9 2 2 2h3v-3a2 2 0 012-2h2a2 2 0 012 2v3h1V8.4c.6-.3 1-.9 1-1.7V4c0-1.1-.9-2-2-2H6zm12 3h-2M9 8h6m-6 3h6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 6v7c0 .6-.4 1-1 1h-1v3c0 1.1-.9 2-2 2h-1v-5c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v5H7c-1.1 0-2-.9-2-2V6" />
      </svg>
    )
  },
  {
    id: 'car',
    label: 'Car',
    color: 'yellow',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l2-6h10l2 6M4 10h16M6 14h12M7 10v4m10-4v4" />
        <circle cx="7" cy="15" r="2" strokeWidth={2} />
        <circle cx="17" cy="15" r="2" strokeWidth={2} />
      </svg>
    )
  },
  {
    id: 'house',
    label: 'House',
    color: 'purple',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'parking',
    label: 'Parking',
    color: 'pink',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16V8h4a2 2 0 110 4h-4" />
      </svg>
    )
  },
  {
    id: 'toll',
    label: 'Toll',
    color: 'orange',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'others',
    label: 'Others',
    color: 'gray',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    )
  }
] as const;

const getColorClasses = (color: string, theme: 'dark' | 'light') => {
  const colorMap: Record<string, { icon: string, bg: string }> = {
    blue: {
      icon: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      bg: theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
    },
    green: {
      icon: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      bg: theme === 'dark' ? 'bg-green-500' : 'bg-green-600'
    },
    yellow: {
      icon: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      bg: theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-600'
    },
    purple: {
      icon: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      bg: theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'
    },
    pink: {
      icon: theme === 'dark' ? 'text-pink-400' : 'text-pink-600',
      bg: theme === 'dark' ? 'bg-pink-500' : 'bg-pink-600'
    },
    orange: {
      icon: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      bg: theme === 'dark' ? 'bg-orange-500' : 'bg-orange-600'
    },
    gray: {
      icon: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      bg: theme === 'dark' ? 'bg-gray-500' : 'bg-gray-600'
    }
  };
  return colorMap[color] || colorMap.gray;
};

const AddExpenseForm: FC<AddExpenseFormProps> = ({ personId, onSubmit }) => {
  const theme = useStore(state => state.theme);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    
    if (selectedCategory && !isNaN(parsedAmount) && parsedAmount > 0) {
      onSubmit(personId, {
        amount: parsedAmount,
        description: selectedCategory
      });
      setAmount('');
      setSelectedCategory('');
    }
  };

  const handleCategorySelect = (value: string) => {
    const category = EXPENSE_CATEGORIES.find(cat => cat.id === value);
    if (category) {
      setSelectedCategory(category.label);
    }
  };

  const selectedCategoryObj = EXPENSE_CATEGORIES.find(cat => cat.label === selectedCategory);
  const colorClasses = selectedCategoryObj 
    ? getColorClasses(selectedCategoryObj.color, theme)
    : { icon: '', bg: '' };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4">
      <div className="relative w-40">
        <select
          value={EXPENSE_CATEGORIES.find(cat => cat.label === selectedCategory)?.id || ''}
          onChange={(e) => handleCategorySelect(e.target.value)}
          className={`input w-full appearance-none py-1.5 pl-7 pr-6 text-sm ${
            !selectedCategory ? 'text-surface-400' : ''
          }`}
          required
        >
          <option value="" disabled>Category</option>
          {EXPENSE_CATEGORIES.map((category) => {
            const { icon: iconColor } = getColorClasses(category.color, theme);
            return (
              <option 
                key={category.id} 
                value={category.id}
                className={iconColor}
              >
                {category.label}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5">
          {selectedCategory ? (
            <div className={colorClasses.icon}>
              {EXPENSE_CATEGORIES.find(cat => cat.label === selectedCategory)?.icon}
            </div>
          ) : (
            <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
          <svg className="h-3.5 w-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="¥ Amount"
        className="input w-32 py-1.5 text-sm text-surface-100 placeholder:text-surface-400"
        min="0"
        required
      />
      <button
        type="submit"
        className={`flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-white transition-colors ${
          theme === 'dark'
            ? 'bg-primary-500 hover:bg-primary-600'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
        title="Add expense"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </form>
  );
};

export default AddExpenseForm; 