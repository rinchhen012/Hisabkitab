import { FC, useEffect } from 'react';
import useStore from './store';
import AddPersonForm from './components/AddPersonForm';
import Person from './components/Person';
import ExpensesChart from './components/ExpensesChart';

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const App: FC = () => {
  const {
    theme,
    toggleTheme,
    people,
    addPerson,
    editPerson,
    addExpense,
    editExpense,
    deleteExpense,
    deletePerson,
    resetData,
    calculateBalances,
    calculateSettlements
  } = useStore();

  // Update document theme when theme changes
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const balances = calculateBalances();
  const settlements = calculateSettlements();

  // Test localStorage availability
  const testStorage = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone!')) {
      resetData();
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-surface-900' : 'bg-surface-50'} pb-12`}>
      {!testStorage() && (
        <div className="fixed inset-x-0 top-0 z-50 bg-red-500 p-2 text-center text-sm text-white">
          <svg className="mr-1 -mt-0.5 inline-block h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Your browser is blocking local storage. Data will not persist!
        </div>
      )}

      <header className={`sticky top-0 z-40 border-b ${theme === 'dark' ? 'border-surface-700 bg-surface-800/80' : 'border-surface-200 bg-white/80'} px-4 py-3 backdrop-blur sm:px-6`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
              <svg className="mr-2 inline-block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              HisabKitab
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>Split expenses with friends</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`text-right text-xs ${theme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>
              <p>Made by Tilak Hacker Corporation</p>
              <p>Sponsored by G boi from Lawson</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`rounded-full p-2 transition-colors ${
                  theme === 'dark' 
                    ? 'text-surface-100 hover:bg-surface-700' 
                    : 'text-surface-900 hover:bg-surface-200'
                }`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleReset}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors ${
                  theme === 'dark'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title="Reset all data"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 pt-6 sm:px-6">
        <div className="card">
          <AddPersonForm onSubmit={addPerson} />
        </div>

        {people.length > 0 && (
          <>
            <section className="space-y-4">
              <h2 className={`flex items-center gap-2 text-lg font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                All Expenses
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {people.map(person => (
                  <Person
                    key={person.id}
                    person={person}
                    onEditPerson={editPerson}
                    onDeletePerson={deletePerson}
                    onAddExpense={addExpense}
                    onEditExpense={editExpense}
                    onDeleteExpense={deleteExpense}
                  />
                ))}
              </div>
            </section>

            <ExpensesChart />

            <section className="space-y-4">
              <h2 className={`flex items-center gap-2 text-lg font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Balances
              </h2>
              <div className={`card divide-y ${theme === 'dark' ? 'divide-surface-700' : 'divide-surface-200'}`}>
                {balances.map((balance, i) => (
                  <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className={`font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>{balance.name}</span>
                    <div className="space-x-4">
                      <span className={theme === 'dark' ? 'text-surface-300' : 'text-surface-600'}>¥{formatNumber(balance.total)}</span>
                      <span className={`font-medium ${balance.balance >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                        {balance.balance >= 0 ? '+' : ''}¥{formatNumber(Math.abs(balance.balance))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className={`flex items-center gap-2 text-lg font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Settlements
              </h2>
              <div className={`card divide-y ${theme === 'dark' ? 'divide-surface-700' : 'divide-surface-200'}`}>
                {settlements.length > 0 ? (
                  settlements.map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{s.from}</span>
                        <svg className={`h-4 w-4 ${theme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{s.to}</span>
                      </div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-surface-100' : 'text-surface-900'}`}>¥{formatNumber(parseFloat(s.amount))}</span>
                    </div>
                  ))
                ) : (
                  <p className={`py-3 text-center ${theme === 'dark' ? 'text-surface-400' : 'text-surface-500'}`}>No settlements needed</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default App;