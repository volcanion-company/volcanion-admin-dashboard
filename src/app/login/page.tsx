'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
  Alert,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/components/common/Button';
import { useLoginMutation } from '@/store/api/authApi';
import { useGetMyProfileQuery } from '@/store/api/userApi';
import { useAppDispatch } from '@/store';
import { setUser } from '@/store/slices/authSlice';
import { setAccessToken, setRefreshToken } from '@/utils/cookie';
import { ROUTES } from '@/lib/constants';
import { LoginRequest } from '@/types';
import AuthGuard from '@/components/auth/AuthGuard';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      setError('');
      
      // Get IP address and user agent
      const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => '0.0.0.0');
      
      const userAgent = navigator.userAgent;
      
      // Login with all required fields
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
        ipAddress,
        userAgent,
      };
      
      const response = await login(loginData).unwrap();
      
      // Save tokens
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      
      // Fetch user profile
      try {
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-profile/me`,
          {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          }
        );
        
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          console.log('Fetched profile:', profile);
          dispatch(setUser(profile));
        }
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
      }
      
      toast.success('Login successful!');
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={10}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to your account to continue
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don&apos;t have an account?{' '}
                    <Link href={ROUTES.REGISTER} underline="hover">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}
