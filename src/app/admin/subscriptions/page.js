'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import getStripe from '../../../lib/stripe';
import apiClient from '../../../lib/api/apiClient';
import { toast } from 'react-hot-toast';


function SubscriptionsContent() {
  const params = useSearchParams();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(true);

  const currencySymbol = (code) => {
    switch ((code || 'USD').toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'JPY': return '¥';
      case 'CNY': return '¥';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      default: return '';
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await apiClient.get('/subscriptions/plans');
        if (!data?.success) throw new Error('Failed to load plans');
        setPlans(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error(err);
        toast.error(err?.message || 'Unable to fetch subscription plans');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fallback: if tenant data not yet updated by webhook, poll briefly until it is
  useEffect(() => {
    if (tenantLoading) return;
    let cancelled = false;
    const needsUpdate = !tenant?.subscription || tenant.subscription.status !== 'active';
    if (!needsUpdate) return;
    const poll = async () => {
      for (let i = 0; i < 10; i++) { // try up to ~10s
        if (cancelled) return;
        try {
          const res = await apiClient.get('/tenant/me');
          if (res?.data?.success) {
            setTenant(res.data.data);
            if (res.data.data?.subscription?.status === 'active') break;
          }
        } catch {}
        await new Promise(r => setTimeout(r, 1000));
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [tenantLoading]);

  // If redirected from success with ?refresh=1, poll tenant for a short period and update banner
  useEffect(() => {
    const shouldRefresh = params?.get('refresh') === '1';
    if (!shouldRefresh) return;
    let cancelled = false;
    const poll = async () => {
      try {
        for (let i = 0; i < 6; i++) {
          if (cancelled) return;
          try {
            const res = await apiClient.get('/tenant/me');
            if (res?.data?.success) {
              setTenant(res.data.data);
              if (res.data.data?.subscription?.status === 'active') break;
            }
          } catch {}
          await new Promise(r => setTimeout(r, 1500));
        }
      } finally {
        // remove the refresh flag from URL without reloading
        if (typeof window !== 'undefined' && window.history && window.location) {
          const url = new URL(window.location.href);
          url.searchParams.delete('refresh');
          window.history.replaceState({}, '', url.toString());
        }
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [params]);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const { data } = await apiClient.get('/tenant/me');
        if (data?.success) setTenant(data.data);
      } catch (err) {
        // ignore silently; tenant may not be available
      } finally {
        setTenantLoading(false);
      }
    };
    fetchTenant();

    // Refresh tenant when window gains focus (e.g., after returning from Stripe)
    const onFocus = () => {
      apiClient.get('/tenant/me').then(res => {
        if (res?.data?.success) setTenant(res.data.data);
      }).catch(() => {});
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') onFocus();
      });
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onFocus);
      }
    };
  }, []);

  const handleSubscribe = async (planKey) => {
    try {
      setLoadingPlan(planKey);
      const { data } = await apiClient.post('/subscriptions/checkout-session', { planKey, billingCycle });
      if (!data?.success) throw new Error('Failed to create/update subscription');

      // Backend may update existing subscription with proration (no Checkout)
      if (data.message === 'Subscription updated with proration') {
        // Refresh tenant to reflect updated plan
        try {
          const me = await apiClient.get('/tenant/me');
          if (me?.data?.success) setTenant(me.data.data);
        } catch {}
        toast.success('Plan changed with proration');
        return;
      }

      // Otherwise proceed to Stripe Checkout for first-time subscription
      const stripe = await getStripe();
      if (data.url) { window.location.href = data.url; return; }
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Subscription failed');
    } finally {
      setLoadingPlan(null);
    }
  };


  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
      {!tenantLoading && tenant?.subscription && (
        <div className={`p-4 rounded-md ${tenant.subscription.status === 'active' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Current Plan</div>
              <div className="text-sm">
                Plan: <span className="font-medium capitalize">{tenant.subscription.plan}</span>
                <span className="mx-2">•</span>
                Billing: <span className="font-medium capitalize">{tenant.subscription.billingCycle}</span>
                <span className="mx-2">•</span>
                Status: <span className="font-medium capitalize">{tenant.subscription.status}</span>
              </div>
            </div>
            {/* Manage billing button removed as requested */}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Choose your plan</h1>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm font-medium border ${billingCycle === 'monthly' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} border-gray-200 rounded-l-lg`}>
            Monthly
          </button>
          <button type="button" onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${billingCycle === 'yearly' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} border-gray-200 rounded-r-lg`}>
            Yearly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && (
          <div className="md:col-span-3 text-center text-gray-500">Loading plans…</div>
        )}
        {!loading && plans.length === 0 && (
          <div className="md:col-span-3 text-center text-gray-500">No plans available. Please contact support.</div>
        )}
        {!loading && plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const priceSuffix = billingCycle === 'monthly' ? '/month' : '/year';
          const currency = (plan.currency || 'USD').toUpperCase();
          const symbol = currencySymbol(currency);
          const isCurrent = (tenant?.subscription?.plan || '').toLowerCase() === (plan.key || '').toLowerCase();
          return (
            <div key={plan.key} className={`border rounded-xl p-6 bg-white dark:bg-gray-800 shadow relative ${isCurrent ? 'ring-2 ring-green-500' : ''}`}>
              {isCurrent && (
                <div className="absolute top-0 right-0 m-3 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 border border-green-200">Current plan</div>
              )}
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold">{symbol}{price}<span className="text-sm text-gray-500 ml-1">{priceSuffix} • {currency}</span></p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {(plan.features || []).map((f) => (<li key={f}>• {f}</li>))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.key)}
                disabled={loadingPlan === plan.key || isCurrent}
                className={`mt-6 w-full py-2 rounded-md text-white font-medium ${
                  isCurrent
                    ? 'bg-gray-400 cursor-not-allowed'
                    : (loadingPlan === plan.key ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700')
                }`}
              >
                {isCurrent ? 'Current plan' : (loadingPlan === plan.key ? 'Redirecting…' : 'Subscribe now')}
              </button>
            </div>
          );
        })}
      </div>

        {/* Bottom Manage billing button removed as requested */}
      </div>
    </AdminLayout>
  );
}

export default function TenantSubscriptionsPage() {
  return (
    <Suspense fallback={<AdminLayout><div className="max-w-5xl mx-auto p-6 text-center text-gray-500">Loading subscriptions…</div></AdminLayout>}>
      <SubscriptionsContent />
    </Suspense>
  );
}
