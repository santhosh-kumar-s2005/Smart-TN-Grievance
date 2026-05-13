/**
 * Modern Login Example Page
 * Demonstrates form components, validation, and modal usage
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '@/components/ui';
import { pageVariants } from '@/animations/variants';
import { theme } from '@/theme';

export default function LoginPageExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    // Handle login
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        className="relative w-full max-w-md"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className="text-white font-bold text-2xl">TN</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart TN</h1>
          <p className="text-gray-600">Grievance Management System</p>
        </motion.div>

        {/* Login Card */}
        <Card
          variant="glass"
          padding="lg"
          className="bg-white/80 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Login</h2>
          <p className="text-gray-600 text-sm mb-6">
            Sign in to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              disabled={isLoading}
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
              className="mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-900 mb-2">Demo Credentials:</p>
            <p className="text-gray-700">Email: demo@example.com</p>
            <p className="text-gray-700">Password: Demo123456</p>
          </div>
        </Card>

        {/* Sign Up Link */}
        <motion.p
          className="text-center text-gray-600 text-sm mt-6"
          whileHover={{ scale: 1.05 }}
        >
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-semibold hover:text-blue-700">
            Sign up here
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
