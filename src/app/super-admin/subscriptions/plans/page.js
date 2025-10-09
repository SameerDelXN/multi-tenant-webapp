'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api/apiClient';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SuperAdminPlansPage() {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPlanKey, setNewPlanKey] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await apiClient.get('/super-admin/settings/subscription-plans');
        if (!data?.success) throw new Error('Failed to load plans');
        setPlans(data.data || {});
      } catch (err) {
        console.error(err);
        toast.error(err?.message || 'Unable to fetch subscription plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const updatePlanField = (key, field, value) => {
    setPlans(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const updateFeature = (key, idx, value) => {
    const features = Array.isArray(plans[key]?.features) ? [...plans[key].features] : [];
    features[idx] = value;
    updatePlanField(key, 'features', features);
  };

  const addFeature = (key) => {
    const features = Array.isArray(plans[key]?.features) ? [...plans[key].features] : [];
    features.push('');
    updatePlanField(key, 'features', features);
  };

  const removeFeature = (key, idx) => {
    const features = Array.isArray(plans[key]?.features) ? [...plans[key].features] : [];
    features.splice(idx, 1);
    updatePlanField(key, 'features', features);
  };

  const addPlan = () => {
    const key = newPlanKey.trim().toLowerCase();
    if (!key) return toast.error('Enter a plan key');
    if (plans[key]) return toast.error('Plan key already exists');
    setPlans(prev => ({
      ...prev,
      [key]: {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        priceMonthly: 0,
        priceYearly: 0,
        features: [],
        limits: { users: 0, appointments: 0, customers: 0 }
      }
    }));
    setNewPlanKey('');
  };

  const deletePlan = (key) => {
    const copy = { ...plans };
    delete copy[key];
    setPlans(copy);
  };

  const savePlans = async () => {
    try {
      setSaving(true);
      const { data } = await apiClient.put('/super-admin/settings/subscription-plans', plans);
      if (!data?.success) throw new Error('Failed to save plans');
      setPlans(data.data || {});
      toast.success('Plans saved');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading plans…</div>
      </div>
    );
  }

  const planEntries = Object.entries(plans);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Link href="/super-admin" className="text-sm text-green-700 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">New plan key</label>
            <input
              value={newPlanKey}
              onChange={e => setNewPlanKey(e.target.value)}
              placeholder="e.g. starter, business"
              className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button onClick={addPlan} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Add</button>
        </div>
      </div>

      {planEntries.length === 0 ? (
        <div className="text-gray-600">No plans yet. Create your first plan above.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {planEntries.map(([key, plan]) => (
            <div key={key} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{key}</h2>
                <button onClick={() => deletePlan(key)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Name</label>
                  <input
                    value={plan.name || key.charAt(0).toUpperCase() + key.slice(1)}
                    onChange={e => updatePlanField(key, 'name', e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Price (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={plan.priceMonthly ?? (plan.price ?? 0)}
                    onChange={e => updatePlanField(key, 'priceMonthly', Number(e.target.value))}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Yearly Price (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={plan.priceYearly ?? ((plan.priceMonthly ?? plan.price ?? 0) * 10)}
                    onChange={e => updatePlanField(key, 'priceYearly', Number(e.target.value))}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <div className="space-y-2 mt-1">
                    {(Array.isArray(plan.features) ? plan.features : []).map((f, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={f}
                          onChange={e => updateFeature(key, idx, e.target.value)}
                          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button onClick={() => removeFeature(key, idx)} className="px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addFeature(key)} className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">+ Add feature</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Limits</label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    <div>
                      <span className="text-xs text-gray-500">Users</span>
                      <input type="number" value={plan.limits?.users ?? 0} onChange={e => updatePlanField(key, 'limits', { ...plan.limits, users: Number(e.target.value) })} className="mt-1 w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Appointments</span>
                      <input type="number" value={plan.limits?.appointments ?? 0} onChange={e => updatePlanField(key, 'limits', { ...plan.limits, appointments: Number(e.target.value) })} className="mt-1 w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Customers</span>
                      <input type="number" value={plan.limits?.customers ?? 0} onChange={e => updatePlanField(key, 'limits', { ...plan.limits, customers: Number(e.target.value) })} className="mt-1 w-full border rounded-md px-3 py-2" />
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button disabled={saving} onClick={savePlans} className={`px-5 py-2 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
          {saving ? 'Saving…' : 'Save Plans'}
        </button>
      </div>
    </div>
  );
}
