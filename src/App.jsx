import { useState } from 'react';
import './App.css';

const Person = ({ person, onEditPerson, onDeletePerson, onEditExpense }) => (
  <tr>
    <td>
      {person.editing ? (
        <input
          type="text"
          value={person.editName}
          onChange={(e) => onEditPerson(person.id, 'editName', e.target.value)}
        />
      ) : (
        person.name
      )}
    </td>
    <td>
      <ul>
        {person.expenses.map((expense, index) => (
          <li key={index}>
            {expense.editing ? (
              <>
                <input
                  type="number"
                  value={expense.editAmount}
                  onChange={(e) => onEditExpense(person.id, index, 'editAmount', e.target.value)}
                  style={{ width: '60px' }}
                />
                <input
                  type="text"
                  value={expense.editDescription}
                  onChange={(e) => onEditExpense(person.id, index, 'editDescription', e.target.value)}
                  style={{ marginLeft: '5px' }}
                />
              </>
            ) : (
              <>
                ¥{expense.amount} - {expense.description || 'No description'}
              </>
            )}
            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
              {expense.editing ? (
                <button onClick={() => onEditExpense(person.id, index, 'save')}>💾</button>
              ) : (
                <button onClick={() => onEditExpense(person.id, index, 'edit')}>✏️</button>
              )}
              <button onClick={() => onEditExpense(person.id, index, 'delete')}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </td>
    <td>
      {person.editing ? (
        <button onClick={() => onEditPerson(person.id, 'save')}>💾</button>
      ) : (
        <button onClick={() => onEditPerson(person.id, 'edit')}>✏️</button>
      )}
      <button onClick={() => onDeletePerson(person.id)}>🗑️</button>
    </td>
  </tr>
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
      <h1>HisabKitab 💸</h1>
      <h3>🪛🔧By Tilak Hacker Corporation🪛🔧</h3>
      
      <form onSubmit={handleAddPerson} className="form">
        <input
          type="text"
          placeholder="Mf Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount(¥)"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expense description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit">Add mf</button>
      </form>

      {people.length > 0 && (
        <div className="results">
          <h2>All Expenses</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Expenses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map(person => (
                <Person
                  key={person.id}
                  person={person}
                  onEditPerson={handleEditPerson}
                  onDeletePerson={(id) => setPeople(people.filter(p => p.id !== id))}
                  onEditExpense={handleEditExpense}
                />
              ))}
            </tbody>
          </table>

          {/* Keep the existing settlements display */}
          <h2>Settlements</h2>
          <div className="settlements">
            {settlements.length > 0 ? (
              settlements.map((s, i) => (
                <p key={i}>
                  {s.from} owes {s.to} ¥{s.amount}
                </p>
              ))
            ) : (
              <p>No settlements needed! Everything is balanced. 🎉</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;