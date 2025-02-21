import { FC } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import type { ExpenseType } from '../types';
import useStore from '../store';

interface SwipeableExpenseProps {
  expense: ExpenseType;
  onDelete: () => void;
  onEdit: () => void;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const getColorClasses = (category: string, theme: 'dark' | 'light') => {
  const categoryColorMap: Record<string, { text: string, bg: string }> = {
    'Food/Drinks': {
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      bg: theme === 'dark' ? 'bg-blue-400/10' : 'bg-blue-600/10'
    },
    'Petrol': {
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      bg: theme === 'dark' ? 'bg-green-400/10' : 'bg-green-600/10'
    },
    'Car': {
      text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      bg: theme === 'dark' ? 'bg-yellow-400/10' : 'bg-yellow-600/10'
    },
    'House': {
      text: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      bg: theme === 'dark' ? 'bg-purple-400/10' : 'bg-purple-600/10'
    },
    'Parking': {
      text: theme === 'dark' ? 'text-pink-400' : 'text-pink-600',
      bg: theme === 'dark' ? 'bg-pink-400/10' : 'bg-pink-600/10'
    },
    'Toll': {
      text: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      bg: theme === 'dark' ? 'bg-orange-400/10' : 'bg-orange-600/10'
    },
    'Others': {
      text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      bg: theme === 'dark' ? 'bg-gray-400/10' : 'bg-gray-600/10'
    }
  };
  return categoryColorMap[category] || categoryColorMap['Others'];
};

const SwipeableExpense: FC<SwipeableExpenseProps> = ({ expense, onDelete, onEdit }) => {
  const theme = useStore(state => state.theme);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0.5, 1]);
  const background = useTransform(
    x,
    [-100, -50, 0],
    theme === 'dark' 
      ? ['rgb(239 68 68)', 'rgb(239 68 68 / 0.5)', 'transparent']  // red-500
      : ['rgb(220 38 38)', 'rgb(220 38 38 / 0.5)', 'transparent']  // red-600
  );

  const { text: categoryTextColor, bg: categoryBgColor } = getColorClasses(expense.description, theme);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 80;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Only delete on left swipes (negative x values)
    if ((offset < -threshold || velocity < -500) && x.get() < 0) {
      onDelete();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete Background */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-600/10'}`} />

      {/* Swipeable Content */}
      <motion.div
        style={{ x, opacity, background }}
        drag="x"
        dragDirectionLock
        dragElastic={{ left: 0.7, right: 0.2 }} // More elastic on left swipe
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className={`relative z-10 flex items-center justify-between rounded-lg py-2.5 px-3 touch-pan-y ${
          theme === 'dark' ? 'bg-surface-800 hover:bg-surface-700/50' : 'bg-white hover:bg-surface-100/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`inline-flex rounded-md px-2 py-1 text-sm font-medium ${categoryTextColor} ${categoryBgColor}`}>
            {expense.description}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
            ¥{formatNumber(expense.amount)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={`rounded-full p-1.5 transition-colors hover:bg-primary-500/10 ${
              theme === 'dark' ? 'text-surface-100' : 'text-surface-900'
            }`}
            title="Edit expense"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`rounded-full p-1.5 transition-colors hover:bg-red-500/10 ${
              theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'
            }`}
            title="Delete expense"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeableExpense; 