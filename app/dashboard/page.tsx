'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function DashboardRedirect() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const checkUserRole = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            // No user logged in
            if (!user) {
              console.log('[Dashboard] No authenticated user - redirecting to login');
              setIsChecking(false);
              router.push('/login');
              return;
            }

            console.log('[Dashboard] User authenticated:', user.uid);
            console.log('[Dashboard] Fetching role from API...');

            // Call API to get user role
            let res;
            try {
              res = await fetch(`/api/check-role?uid=${user.uid}`);
            } catch (fetchErr) {
              console.error('[Dashboard] Network error fetching role:', fetchErr);
              setIsChecking(false);
              router.push('/login');
              return;
            }

            // Check if response is ok (status 200-299)
            if (!res.ok) {
              console.error('[Dashboard] API returned error status:', res.status, res.statusText);
              setIsChecking(false);
              router.push('/login');
              return;
            }

            // Try to parse JSON response
            let data;
            try {
              data = await res.json();
              console.log('[Dashboard] API response:', { role: data?.role, default: data?.default });
            } catch (parseErr) {
              console.error('[Dashboard] Failed to parse API response as JSON:', parseErr);
              setIsChecking(false);
              router.push('/login');
              return;
            }

            // Validate response data
            if (!data || typeof data !== 'object') {
              console.error('[Dashboard] Invalid response structure:', data);
              setIsChecking(false);
              router.push('/login');
              return;
            }

            const role = data?.role || 'USER';
            console.log('[Dashboard] Role resolved:', role, '(default:', data?.default, ')');

            // Route based on role
            if (role === 'ADMIN') {
              console.log('[Dashboard] → Routing to /admin');
              setIsChecking(false);
              router.push('/admin');
            } else if (role === 'USER') {
              console.log('[Dashboard] → Routing to /user');
              setIsChecking(false);
              router.push('/user');
            } else if (role === 'DEPARTMENT') {
              console.log('[Dashboard] → Routing to /department');
              setIsChecking(false);
              router.push('/department');
            } else {
              console.warn('[Dashboard] Unknown role:', role, '- redirecting to login');
              setIsChecking(false);
              router.push('/login');
            }
          } catch (authErr) {
            console.error('[Dashboard] Error in auth state change handler:', authErr);
            setIsChecking(false);
            router.push('/login');
          }
        });
      } catch (setupErr) {
        console.error('[Dashboard] Error setting up auth listener:', setupErr);
        setIsChecking(false);
        router.push('/login');
      }
    };

    checkUserRole();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  // Show loading while checking auth state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Loader size="lg" text="Verifying your role..." />
      </div>
    );
  }

  return null;
}
