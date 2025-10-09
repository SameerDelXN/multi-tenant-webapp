'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import apiClient from '@/lib/api/apiClient';

function SubscriptionSuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verify session with backend (forces immediate DB update), then poll as fallback and redirect
    let cancelled = false;
    const run = async () => {
      setChecking(true);
      try {
        if (sessionId) {
          try { await apiClient.get(`/subscriptions/verify?session_id=${sessionId}`); } catch {}
        }
        for (let i = 0; i < 10; i++) { // up to ~10s
          if (cancelled) return;
          try {
            const res = await apiClient.get('/tenant/me');
            if (res?.data?.success && res.data.data?.subscription?.status === 'active') {
              setVerified(true);
              break;
            }
          } catch {}
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (e) {
        setError(e?.message || 'Unable to verify subscription status');
      } finally {
        setChecking(false);
        // Do not auto-redirect; remain on success page as requested.
      }
    };
    run();
    return () => { cancelled = true; };
  }, [sessionId, router]);

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
          <div className="text-green-600 text-3xl font-bold mb-2">Payment Successful</div>
          <div className="text-gray-600 dark:text-gray-300 mb-6">
            {checking ? 'Finalizing your subscription…' : verified ? 'Your subscription is now active. You can start using all features.' : 'We will update your subscription shortly.'}
          </div>
          {error && (
            <div className="text-red-600 text-sm mb-4">{error}</div>
          )}
          <div className="space-x-3">
            <Link href="/admin" className="inline-block px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Go to Dashboard</Link>
            <Link href="/admin/subscriptions" className="inline-block px-5 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Back to Plans</Link>
          </div>
          {sessionId && (
            <div className="mt-6 text-xs text-gray-400">Session ID: {sessionId}</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<AdminLayout><div className="max-w-2xl mx-auto py-12 text-center text-gray-500">Loading…</div></AdminLayout>}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
