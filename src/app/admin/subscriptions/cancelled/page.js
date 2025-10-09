'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function SubscriptionCancelledPage() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
          <div className="text-yellow-600 text-3xl font-bold mb-2">Payment Cancelled</div>
          <div className="text-gray-600 dark:text-gray-300 mb-6">
            Your checkout was cancelled. You can try subscribing again anytime.
          </div>
          <div className="space-x-3">
            <Link href="/admin/subscriptions" className="inline-block px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Back to Plans</Link>
            <Link href="/admin" className="inline-block px-5 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
