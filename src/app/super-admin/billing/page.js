'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, FileText, PlusCircle, Edit3, Trash2, Filter, Download } from 'lucide-react';
import apiClient from '@/lib/api/apiClient';

const initialTransactions = [
  { id: 'txn_1', tenantName: 'GreenScape Landscaping', planName: 'Pro Monthly', amount: 99, date: '2025-06-01', status: 'Paid', invoiceUrl: '#' },
  { id: 'txn_2', tenantName: 'Bloom & Grow Gardens', planName: 'Basic Monthly', amount: 49, date: '2025-06-01', status: 'Paid', invoiceUrl: '#' },
  { id: 'txn_3', tenantName: 'Evergreen Solutions', planName: 'Pro Monthly', amount: 99, date: '2025-05-28', status: 'Pending', invoiceUrl: '#' },
  { id: 'txn_4', tenantName: 'Yard Masters Inc.', planName: 'Enterprise Annual', amount: 999, date: '2025-05-15', status: 'Paid', invoiceUrl: '#' },
  { id: 'txn_5', tenantName: 'The Lawn Co.', planName: 'Basic Monthly', amount: 49, date: '2025-05-12', status: 'Failed', invoiceUrl: '#' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendColor = 'text-green-500' }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
      {Icon && <Icon size={20} className="mr-2" />} 
      <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
    {trend && <p className={`text-xs mt-1 ${trendColor}`}>{trend}</p>}
  </div>
);

const PlanStatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
  if (status === 'active') colorClass = 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
  if (status === 'archived') colorClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100';
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const TransactionStatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
  if (status === 'Paid') colorClass = 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
  if (status === 'Pending') colorClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100';
  if (status === 'Failed') colorClass = 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100';
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>{status}</span>;
};

export default function BillingManagementPage() {
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState(initialTransactions);
  // Add states for modals, filters, etc.

  // Placeholder functions for actions
  const handleCreatePlan = () => alert('Open Create Plan Modal');
  const handleEditPlan = (planId) => alert(`Open Edit Plan Modal for ${planId}`);
  const handleDeletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan? This might affect active subscriptions.')) {
      alert(`Deleting plan ${planId}`);
      // API call to delete plan
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  // Load real plans from backend (super admin settings)
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await apiClient.get('/super-admin/settings/subscription-plans');
        const plansObj = data?.data || {};
        // Transform object map -> array compatible with current table
        const rows = Object.entries(plansObj).map(([key, val]) => ({
          id: key,
          name: val.name || key.charAt(0).toUpperCase() + key.slice(1),
          // Render monthly by default in the existing column; interval kept as 'month'
          price: Number(val.priceMonthly != null ? val.priceMonthly : val.price) || 0,
          interval: 'month',
          features: Array.isArray(val.features) ? val.features : [],
          // Active subscriptions count not available here; show dash
          activeSubscriptions: '-',
          status: 'active',
        }));
        setPlans(rows);
      } catch (e) {
        console.error('Failed to load plans', e);
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="space-y-8 p-2 sm:p-4 md:p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Subscription & Billing Management</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Total Revenue (YTD)" value="$125,670" icon={DollarSign} trend="+15% vs Last Year" />
        <StatCard title="Monthly Recurring Revenue (MRR)" value="$10,500" icon={TrendingUp} trend="+2.5% vs Last Month" />
        <StatCard title="Active Subscriptions" value="555" icon={Users} trend="+12 New This Month" />
      </div>

      {/* Subscription Plans Management */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Subscription Plans</h2>
          <button onClick={handleCreatePlan} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors">
            <PlusCircle size={18} className="mr-2" /> Create New Plan
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active Subs</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {plans.map(plan => (
                <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{plan.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${plan.price}/{plan.interval}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{plan.activeSubscriptions}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm"><PlanStatusBadge status={plan.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleEditPlan(plan.id)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700" title="Edit Plan"><Edit3 size={16} /></button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-gray-700" title="Delete Plan"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions / Invoices */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Transactions</h2>
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Filter Transactions">
              <Filter size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Download Report">
              <Download size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{txn.tenantName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.planName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${txn.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm"><TransactionStatusBadge status={txn.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <a href={txn.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">View Invoice</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placeholder for Revenue Charts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500">
        Revenue Trends & Plan Breakdown Charts (Placeholder)
      </div>

    </div>
  );
}
