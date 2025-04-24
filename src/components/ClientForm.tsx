import { useState, FormEvent } from 'react';
import { validateClientForm } from '../utils/validateClientForm';
import { ClientFormData } from '../types/types';

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
}

export default function ClientForm({ onSubmit }: ClientFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = { name, email };
    const validationErrors = validateClientForm(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <button
        type="submit"
        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}