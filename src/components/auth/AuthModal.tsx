'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'Trainer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError(null);
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const user = await res.json();
        onClose();
        router.push(user.role === 'Trainer' ? '/clients' : '/dashboard');
      } else {
        const errorData = await res.json().catch(() => null);
        console.log('Server error response:', errorData);
        if (errorData?.message === 'User already exists') {
          setEmailError('This email is already registered');
          toast.error('This email is already registered. Please use another email or sign in.');
        } else {
          console.log('Error data structure:', JSON.stringify(errorData, null, 2));
          toast.error('Error during login or registration');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'email') {
      setEmailError(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? 'Sign In' : 'Sign Up'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Client">Client</option>
                <option value="Trainer">Trainer</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-500">{emailError}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-black"
          >
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span className="text-main hover:text-main-dark cursor-pointer">Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="text-main hover:text-main-dark cursor-pointer">Sign In</span>
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
