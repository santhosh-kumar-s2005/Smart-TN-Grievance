'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email,
        role: 'USER',
        createdAt: new Date(),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      let errorMessage = 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Success!" subtitle="Your account has been created">
        <div className="space-y-4">
          <div className="flex gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Welcome! Redirecting to your dashboard...
            </p>
          </div>
          <div className="h-2 bg-green-200 dark:bg-green-900 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 animation-pulse" style={{animation: 'pulse 1s ease-in-out infinite'}} />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join us to manage your grievances">
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
        />

        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />

        <Input
          type="password"
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={loading}
        />

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create Account
        </Button>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
