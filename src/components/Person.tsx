import { FC, useState, useRef, useEffect } from 'react';
import { PersonType, ExpenseType } from '../types';
import AddExpenseForm from './AddExpenseForm';
import SwipeableExpense from './SwipeableExpense';
import useStore from '../store';
import autoAnimate from '@formkit/auto-animate';

interface PersonProps {
  person: PersonType;
  onEditPerson: (id: string, name: string) => void;
  onDeletePerson: (id: string) => void;
  onAddExpense: (personId: string, expense: Omit<ExpenseType, 'id'>) => void;
  onEditExpense: (personId: string, expenseId: string, expense: Omit<ExpenseType, 'id'>) => void;
  onDeleteExpense: (personId: string, expenseId: string) => void;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const Person: FC<PersonProps> = ({ 
  person, 
  onEditPerson, 
  onDeletePerson, 
  onAddExpense,
  onEditExpense,
  onDeleteExpense 
}) => {
  const theme = useStore(state => state.theme);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const expensesParent = useRef(null);

  useEffect(() => {
    if (expensesParent.current) {
      autoAnimate(expensesParent.current);
    }
  }, [expensesParent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditPerson(person.id, editedName);
    setIsEditing(false);
  };

  const handleEditExpense = (expense: ExpenseType) => {
    setEditingExpense(expense.id);
    setEditedAmount(expense.amount.toString());
    setEditedDescription(expense.description);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      const amount = parseFloat(editedAmount);
      if (!isNaN(amount) && amount > 0 && editedDescription.trim()) {
        onEditExpense(person.id, editingExpense, {
          amount,
          description: editedDescription.trim()
        });
        setEditingExpense(null);
      }
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="input w-full"
              autoFocus
            />
          </form>
        ) : (
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>{person.name}</h3>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-full p-1.5 transition-colors ${
              theme === 'dark' 
                ? 'text-surface-100 hover:bg-surface-700' 
                : 'text-surface-900 hover:bg-surface-200'
            }`}
            title={isEditing ? "Save changes" : "Edit name"}
          >
            {isEditing ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onDeletePerson(person.id)}
            className={`rounded-full p-1.5 transition-colors ${
              theme === 'dark' 
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                : 'text-red-600 hover:bg-red-500/10 hover:text-red-500'
            }`}
            title="Delete person"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <AddExpenseForm personId={person.id} onSubmit={onAddExpense} />

        {person.expenses.length > 0 && (
          <div 
            ref={expensesParent}
            className={`space-y-1 ${theme === 'dark' ? 'divide-surface-700' : 'divide-surface-200'}`}
          >
            {person.expenses.map((expense) => (
              <div key={expense.id}>
                {editingExpense === expense.id ? (
                  <form onSubmit={handleSaveExpense} className="flex gap-3">
                    <input
                      type="text"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="What's the expense for?"
                      className="input flex-1"
                      required
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={editedAmount}
                      onChange={(e) => setEditedAmount(e.target.value)}
                      placeholder="¥ Amount"
                      className="input w-32"
                      min="0"
                      required
                    />
                    <button
                      type="submit"
                      className={`rounded-full p-1.5 transition-colors ${
                        theme === 'dark' 
                          ? 'text-surface-100 hover:bg-surface-700' 
                          : 'text-surface-900 hover:bg-surface-200'
                      }`}
                      title="Save changes"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingExpense(null)}
                      className={`rounded-full p-1.5 transition-colors ${
                        theme === 'dark' 
                          ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                          : 'text-red-600 hover:bg-red-500/10 hover:text-red-500'
                      }`}
                      title="Cancel"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <SwipeableExpense
                    expense={expense}
                    onDelete={() => onDeleteExpense(person.id, expense.id)}
                    onEdit={() => handleEditExpense(expense)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {person.expenses.length === 0 && (
          <p className={`text-center text-sm ${theme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>No expenses yet</p>
        )}
      </div>
    </div>
  );
};

export default Person; 