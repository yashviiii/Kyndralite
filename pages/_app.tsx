import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const token = localStorage.getItem('adminToken');
    if (token && router.pathname === '/login') {
      router.push('/dashboard');
      return;
    }
    if (!token && router.pathname !== '/login') {
      router.push('/login');
      return;
    }
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router.isReady, router.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <Component {...pageProps} />;
}

