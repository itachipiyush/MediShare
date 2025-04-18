import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { useAuthStore } from '../store/auth-store';
import { UserRole } from '../lib/supabase';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['donor', 'claimer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, error: authError, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      await signUp(data.email, data.password, data.role as UserRole);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-teal-600"
          >
            <Heart className="h-8 w-8" />
            <span className="ml-2 text-2xl font-bold">MediShare</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-slate-800">Create an account</h1>
          <p className="mt-2 text-slate-600">
            Join our community to donate or claim medications
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
              />
              
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                error={errors.password?.message}
              />
              
              <Input
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              
              <Select
                label="I want to..."
                options={[
                  { value: 'donor', label: 'Donate medications' },
                  { value: 'claimer', label: 'Claim medications' },
                ]}
                {...register('role')}
                error={errors.role?.message}
              />
              
              <div className="text-sm text-slate-600">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
              </div>
              
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">
                Already have an account?{' '}
              </span>
              <Link 
                to="/login" 
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};