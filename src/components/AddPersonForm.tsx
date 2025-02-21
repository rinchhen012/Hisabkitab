import { FC, useState, useEffect } from 'react';
import useStore from '../store';

interface AddPersonFormProps {
  onSubmit: (name: string) => void;
}

const AddPersonForm: FC<AddPersonFormProps> = ({ onSubmit }) => {
  const theme = useStore(state => state.theme);
  const people = useStore(state => state.people);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Clear input field when people array is empty (after reset)
  useEffect(() => {
    if (people.length === 0) {
      setName('');
      setError('');
    }
  }, [people]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (trimmedName) {
      // Check for duplicate name (case insensitive)
      const isDuplicate = people.some(
        person => person.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        setError('This name already exists');
        return;
      }

      onSubmit(trimmedName);
      setName('');
      setError('');
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(''); // Clear error when typing
            }}
            placeholder="Enter mf name"
            className={`input w-full text-surface-100 placeholder:text-surface-400 ${
              error ? 'input-error' : ''
            }`}
            required
          />
          {error && (
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className={`flex items-center rounded-lg p-2.5 text-sm font-medium text-white transition-colors ${
            theme === 'dark'
              ? 'bg-primary-500 hover:bg-primary-600'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
          title="Add person"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AddPersonForm; 