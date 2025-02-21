import { FC } from 'react';
import useStore from '../store';
import type { PersonType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const ExpensesChart: FC = () => {
  const theme = useStore(state => state.theme);
  const people = useStore(state => state.people);

  // Find the maximum total expense to scale the bars
  const maxExpense = Math.max(
    ...people.map(person => 
      person.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    )
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Group expenses by category for each person
  const getExpensesByCategory = (person: PersonType) => {
    return person.expenses.reduce((acc, expense) => {
      acc[expense.description] = (acc[expense.description] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  // Get all unique categories
  const allCategories = Array.from(
    new Set(
      people.flatMap(person => 
        person.expenses.map(exp => exp.description)
      )
    )
  );

  // Generate a color for each category
  const categoryColors = {
    'Food/Drinks': theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600',
    'Petrol': theme === 'dark' ? 'bg-green-500' : 'bg-green-600',
    'Car': theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-600',
    'House': theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600',
    'Parking': theme === 'dark' ? 'bg-pink-500' : 'bg-pink-600',
    'Toll': theme === 'dark' ? 'bg-orange-500' : 'bg-orange-600',
    'Others': theme === 'dark' ? 'bg-gray-500' : 'bg-gray-600'
  } as const;

  if (people.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className={`flex items-center gap-2 text-lg font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Expenses Chart
      </h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card space-y-6"
      >
        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <AnimatePresence>
            {allCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2"
              >
                <motion.div 
                  className={`h-3 w-3 rounded-sm ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500'}`}
                  whileHover={{ scale: 1.2 }}
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}>
                  {category}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bars */}
        <div className="space-y-4">
          <AnimatePresence>
            {people.map((person, personIndex) => {
              const totalExpense = person.expenses.reduce((sum, exp) => sum + exp.amount, 0);
              const expensesByCategory = getExpensesByCategory(person);
              
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: personIndex * 0.1 }}
                  className="space-y-2"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-baseline justify-between"
                  >
                    <span className={`font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
                      {person.name}
                    </span>
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-sm ${theme === 'dark' ? 'text-surface-300' : 'text-surface-600'}`}
                    >
                      ¥{formatNumber(totalExpense)}
                    </motion.span>
                  </motion.div>
                  
                  <div className="h-6 w-full overflow-hidden rounded-full bg-surface-700/10">
                    <AnimatePresence>
                      {allCategories.map((category, index) => {
                        const amount = expensesByCategory[category] || 0;
                        const width = (amount / maxExpense) * 100;
                        
                        if (width === 0) return null;
                        
                        return (
                          <motion.div
                            key={category}
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            exit={{ width: 0 }}
                            transition={{ 
                              duration: 0.5,
                              delay: index * 0.1,
                              ease: "easeOut"
                            }}
                            className={`float-left h-full ${categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500'}`}
                            title={`${category}: ¥${formatNumber(amount)}`}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { duration: 0.2 }
                            }}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ExpensesChart; 