'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: Props) {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Client',
  });
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false); // флаг для плавного открытия

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10); // запускает анимацию
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const endpoint = isRegistering ? '/register' : '/login';

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const user = await res.json();
      handleClose();
      router.push(user.role === 'Trainer' ? '/clients' : '/dashboard');
    } else {
      alert('Falied to login or register');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      } bg-black/40`}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-lg shadow-xl p-8 transform transition-all duration-300 ${
          closing || !mounted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-[#1F2A44]">
          {isRegistering ? 'Create an account' : 'Sign in'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {isRegistering && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                name="role"
                className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                onChange={handleChange}
                value={form.role}
              >
                <option value="Client">Client</option>
                <option value="Trainer">Trainer</option>
              </select>
            </>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            name="email"
            type="email"
            placeholder="johndoe@example.com"
            onChange={handleChange}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] text-white py-2 rounded-md hover:bg-[#5b21b6] transition-colors font-medium"
          >
            {loading ? 'Loading...' : isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600">
          {isRegistering ? 'Already have an account?' : 'No account?'}{' '}
          <button
            className="text-main hover:underline font-medium"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
