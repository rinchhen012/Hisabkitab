import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, PersonType, Theme } from '../types';

const LOCAL_STORAGE_KEY = 'hisabkitab-data-v2';

const initialState = {
  theme: 'dark' as Theme,
  people: []
};

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      theme: initialState.theme,
      toggleTheme: () => set(state => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setPeople: (people) => set({ people }),
      
      addPerson: (name) => {
        const newPerson: PersonType = {
          id: Date.now().toString(),
          name,
          expenses: []
        };
        set((state) => ({ people: [...state.people, newPerson] }));
      },

      editPerson: (id, name) => {
        set((state) => ({
          people: state.people.map(person => 
            person.id === id ? { ...person, name } : person
          )
        }));
      },

      addExpense: (personId, expense) => {
        set((state) => ({
          people: state.people.map(person => {
            if (person.id === personId) {
              return {
                ...person,
                expenses: [...person.expenses, {
                  ...expense,
                  id: Date.now().toString()
                }]
              };
            }
            return person;
          })
        }));
      },

      editExpense: (personId, expenseId, expense) => {
        set((state) => ({
          people: state.people.map(person => {
            if (person.id === personId) {
              return {
                ...person,
                expenses: person.expenses.map(exp => 
                  exp.id === expenseId ? { ...exp, ...expense } : exp
                )
              };
            }
            return person;
          })
        }));
      },

      deleteExpense: (personId, expenseId) => {
        set((state) => ({
          people: state.people.map(person => {
            if (person.id === personId) {
              return {
                ...person,
                expenses: person.expenses.filter(exp => exp.id !== expenseId)
              };
            }
            return person;
          })
        }));
      },

      deletePerson: (id) => {
        set((state) => ({
          people: state.people.filter(person => person.id !== id)
        }));
      },

      resetData: () => {
        const theme = get().theme;
        set({ ...initialState, theme });
      },

      calculateBalances: () => {
        const { people } = get();
        if (people.length === 0) return [];

        const totals = people.map(person => ({
          name: person.name,
          total: person.expenses.reduce((sum, expense) => sum + expense.amount, 0),
          balance: 0
        }));
      
        const totalSpent = totals.reduce((sum, t) => sum + t.total, 0);
        const average = totalSpent / people.length;
      
        return totals.map(t => ({
          ...t,
          balance: Number((t.total - average).toFixed(2))
        }));
      },

      calculateSettlements: () => {
        const balances = get().calculateBalances();
        if (balances.length === 0) return [];

        const settlements: Array<{ from: string; to: string; amount: string }> = [];
        
        // Create a copy of balances to mutate
        const workingBalances = [...balances];
      
        workingBalances.forEach((debtor, i) => {
          workingBalances.forEach((creditor, j) => {
            if (i !== j && debtor.balance < 0 && creditor.balance > 0) {
              const amount = Math.min(-debtor.balance, creditor.balance);
              if (amount > 0) {
                settlements.push({
                  from: debtor.name,
                  to: creditor.name,
                  amount: amount.toFixed(2)
                });
                workingBalances[i].balance += amount;
                workingBalances[j].balance -= amount;
              }
            }
          });
        });
      
        return settlements;
      }
    }),
    {
      name: LOCAL_STORAGE_KEY,
    }
  )
);

export default useStore; 