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

    console.log('🔐 Login attempt started');
    console.log('Email:', email);
    console.log('Firebase Auth instance:', auth ? '✅ Initialized' : '❌ Not initialized');
    console.log('Firebase DB instance:', db ? '✅ Initialized' : '❌ Not initialized');

    try {
      console.log('🔄 Calling signInWithEmailAndPassword...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Authentication successful');
      console.log('User UID:', user.uid);
      console.log('User Email:', user.email);
      console.log('User Email Verified:', user.emailVerified);

      console.log('🔄 Fetching user profile from Firestore...');
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData?.role;

        console.log('✅ User profile found');
        console.log('User Role:', role);
        console.log('User Data:', userData);

        if (role === 'ADMIN') {
          console.log('→ Redirecting to /admin');
          router.push('/admin');
        } else if (role === 'DEPARTMENT') {
          console.log('→ Redirecting to /department');
          router.push('/department');
        } else {
          console.log('→ Redirecting to /dashboard');
          router.push('/dashboard');
        }
      } else {
        const errorMsg = 'User profile not found in Firestore. Please contact support.';
        console.error('❌ ' + errorMsg);
        console.error('User UID:', user.uid);
        console.error('Path checked: users/' + user.uid);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('❌ Login error caught');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Full error object:', err);

      let errorMessage = 'Login failed';
      
      // Firebase Authentication Errors
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please check your email or create a new account.';
        console.error('→ User account does not exist in Firebase');
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
        console.error('→ Password is incorrect');
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
        console.error('→ Email format is invalid');
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
        console.error('→ User account is disabled');
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
        console.error('→ Too many login attempts - rate limited');
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password combination.';
        console.error('→ Invalid credentials provided');
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
        console.error('→ Network request failed - check connectivity');
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password sign-in is not enabled. Contact support.';
        console.error('→ Email/password authentication not enabled in Firebase');
      } else if (err.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase configuration error. Please check API key.';
        console.error('→ Firebase API key is invalid - check .env.local');
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied. Unable to access user data.';
        console.error('→ Firestore permission denied - check Firebase security rules');
      } else {
        errorMessage = `Login failed: ${err.message || 'Unknown error'}`;
        console.error('→ Unknown error:', err.message);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🔐 Login attempt completed');
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
