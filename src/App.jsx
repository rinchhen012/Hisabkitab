
import { useState } from 'react';
import './App.css';

const Person = ({ person, onEditPerson, onDeletePerson, onEditExpense }) => (
  <div className="person-card">
    <div className="person-header">
      {person.editing ? (
        <input
          type="text"
          value={person.editName}
          onChange={(e) => onEditPerson(person.id, 'editName', e.target.value)}
          placeholder="Name"
          className="edit-input"
        />
      ) : (
        <h3 className="person-name">{person.name}</h3>
      )}
      <div className="person-actions">
        <button 
          onClick={() => person.editing ? onEditPerson(person.id, 'save') : onEditPerson(person.id, 'edit')}
          className="icon-btn"
        >
          {person.editing ? '💾' : '✏️'}
        </button>
        <button 
          onClick={() => onDeletePerson(person.id)}
          className="icon-btn danger"
        >
          🗑️
        </button>
      </div>
    </div>
    
    <ul className="expense-list">
      {person.expenses.map((expense, index) => (
        <li key={index} className="expense-item">
          {expense.editing ? (
            <div className="expense-edit">
            <input
              type="number"
              value={expense.editAmount}
              onChange={(e) => onEditExpense(person.id, index, 'editAmount', e.target.value)}
              placeholder="¥ Amount"
              className="number-input"
              inputMode="decimal"
            />
            <input
              type="text"
              value={expense.editDescription}
              onChange={(e) => onEditExpense(person.id, index, 'editDescription', e.target.value)}
              placeholder="Description"
              className="text-input"
            />
            <div className="expense-actions">
              <button 
                onClick={() => onEditExpense(person.id, index, 'save')}
                className="save-btn"
              >
                Save
              </button>
            </div>
          </div>
          ) : (
            <div className="expense-display">
  <div className="expense-info">
    <span className="expense-amount">¥{expense.amount}</span>
    <span className="expense-description">
      {expense.description || 'No description'}
    </span>
  </div>
  <div className="expense-actions">
    <button 
      onClick={() => onEditExpense(person.id, index, 'edit')}
      className="icon-btn small"
    >
      ✏️
    </button>
    <button 
      onClick={() => onEditExpense(person.id, index, 'delete')}
      className="icon-btn small danger"
    >
      🗑️
    </button>
  </div>
</div>
          )}
        </li>
      ))}
    </ul>
  </div>
);

function App() {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const newPerson = {
      id: Date.now(),
      name: newName,
      editing: false,
      editName: '',
      expenses: [{
        amount: parseFloat(newAmount),
        description: newDescription,
        editing: false,
        editAmount: '',
        editDescription: ''
      }]
    };

    setPeople([...people, newPerson]);
    setNewName('');
    setNewAmount('');
    setNewDescription('');
  };

  const handleEditPerson = (id, action, value) => {
    setPeople(people.map(person => {
      if (person.id === id) {
        if (action === 'edit') {
          return { ...person, editing: true, editName: person.name };
        }
        if (action === 'editName') {
          return { ...person, editName: value };
        }
        if (action === 'save') {
          return { ...person, name: person.editName, editing: false };
        }
      }
      return person;
    }));
  };

  const handleEditExpense = (personId, expenseIndex, action, value) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        const updatedExpenses = person.expenses.map((expense, index) => {
          if (index === expenseIndex) {
            switch(action) {
              case 'edit':
                return { ...expense, 
                  editing: true,
                  editAmount: expense.amount,
                  editDescription: expense.description
                };
              case 'editAmount':
                return { ...expense, editAmount: value };
              case 'editDescription':
                return { ...expense, editDescription: value };
              case 'save':
                return {
                  ...expense,
                  amount: parseFloat(expense.editAmount),
                  description: expense.editDescription,
                  editing: false
                };
              case 'delete':
                return null;
              default:
                return expense;
            }
          }
          return expense;
        }).filter(Boolean);
        
        return { ...person, expenses: updatedExpenses };
      }
      return person;
    }));
  };

  // Calculate balances and settlements
  const calculateBalances = () => {
    const totals = people.map(person => ({
      name: person.name,
      total: person.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    }));
  
    const totalSpent = totals.reduce((sum, t) => sum + t.total, 0);
    const average = totalSpent / people.length || 0;
  
    return totals.map(t => ({
      ...t,
      balance: t.total - average
    }));
  };
  
  const balances = calculateBalances();
  const settlements = [];
  
  balances.forEach((debtor) => {
    balances.forEach((creditor) => {
      if (debtor.balance < 0 && creditor.balance > 0) {
        const amount = Math.min(-debtor.balance, creditor.balance);
        if (amount > 0) {
          settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: amount.toFixed(2)
          });
          debtor.balance += amount;
          creditor.balance -= amount;
        }
      }
    });
  });  

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">🚗 HisabKitab 💸</h1>
        <h5>🪛🔧Made by Tilak Hacker Corporation🪛🔧</h5>
        <h5>Sponsored by G boi from Lawson</h5>
      </header>

      <form onSubmit={handleAddPerson} className="input-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Mf's Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <input
              type="number"
              placeholder="¥ Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="form-input number-input"
              required
              inputMode="decimal"
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <button type="submit" className="primary-btn">
          ➕ Add Expense
        </button>
      </form>

      {people.length > 0 && (
        <div className="content-section">
          <h2 className="section-title">All Expenses</h2>
          <div className="people-list">
            {people.map(person => (
              <Person
                key={person.id}
                person={person}
                onEditPerson={handleEditPerson}
                onDeletePerson={(id) => setPeople(people.filter(p => p.id !== id))}
                onEditExpense={handleEditExpense}
              />
            ))}
          </div>

          <h2 className="section-title">Settlements</h2>
          <div className="settlements-list">
            {settlements.length > 0 ? (
              settlements.map((s, i) => (
                <div key={i} className="settlement-item">
                  <span className="from-person">{s.from}</span>
                  <span className="arrow">→</span>
                  <span className="to-person">{s.to}</span>
                  <span className="settlement-amount">¥{s.amount}</span>
                </div>
              ))
            ) : (
              <div className="no-settlements">
                🎉 No settlements needed! Everything is balanced.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;