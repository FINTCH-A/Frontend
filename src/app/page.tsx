'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookieStorage } from '@/lib/cookies';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const role = cookieStorage.getUserRole();
    if (role === 'CUSTOMER') {
      router.replace('/mis-prestamos');
    } else if (role) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
