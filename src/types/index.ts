export interface ExpenseType {
  id: string;
  amount: number;
  description: string;
}

export interface PersonType {
  id: string;
  name: string;
  expenses: ExpenseType[];
}

export interface Balance {
  name: string;
  total: number;
  balance: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: string;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  people: PersonType[];
  setPeople: (people: PersonType[]) => void;
  addPerson: (name: string) => void;
  editPerson: (id: string, name: string) => void;
  addExpense: (personId: string, expense: Omit<ExpenseType, 'id'>) => void;
  editExpense: (personId: string, expenseId: string, expense: Omit<ExpenseType, 'id'>) => void;
  deleteExpense: (personId: string, expenseId: string) => void;
  deletePerson: (id: string) => void;
  calculateBalances: () => Balance[];
  calculateSettlements: () => Settlement[];
  resetData: () => void;
} 