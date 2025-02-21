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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError('');
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={handleChange}
            onTouchStart={(e) => e.currentTarget.focus()}
            onClick={(e) => e.currentTarget.focus()}
            placeholder="Enter mf name"
            autoComplete="off"
            className={`input w-full text-surface-100 placeholder:text-surface-400 ${
              error ? 'input-error' : ''
            }`}
            style={{
              WebkitUserSelect: 'text',
              WebkitTouchCallout: 'none',
              touchAction: 'manipulation'
            }}
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
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            theme === 'dark'
              ? 'bg-primary-500 hover:bg-primary-600'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
          title="Add person"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AddPersonForm; 