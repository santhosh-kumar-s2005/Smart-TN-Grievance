'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === 'ADMIN') {
          router.push('/admin');
        } else if (role === 'DEPARTMENT') {
          router.push('/department');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError('User profile not found. Please contact support.');
      }
    } catch (err: any) {
      let errorMessage = 'Login failed';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          disabled={loading}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          disabled={loading}
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Sign In
        </Button>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
