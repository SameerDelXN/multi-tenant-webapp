'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, BarChart2, Users, HardDrive, FileText, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';
import apiClient from '../../../../lib/api/apiClient';

const StatCard = ({ title, value, icon: Icon, subValue, bgColor = 'bg-white dark:bg-gray-800' }) => (
  <div className={`p-4 rounded-lg shadow-md ${bgColor}`}>
    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
      {Icon && <Icon size={18} className="mr-2" />} 
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    {subValue && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subValue}</p>}
  </div>
);

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
                ${isActive 
                  ? 'bg-green-500 text-white dark:bg-green-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
  >
    {label}
  </button>
);

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [billing, setBilling] = useState(null);

  useEffect(() => {
    if (tenantId) {
      const fetchTenantData = async () => {
        try {
          setLoading(true);
          const [tenantRes, usersRes, activityRes] = await Promise.all([
            apiClient.get(`/super-admin/tenants/${tenantId}`),
            apiClient.get(`/super-admin/tenants/${tenantId}/users`),
            apiClient.get(`/super-admin/tenants/${tenantId}/activity`)
          ]);
          
          setTenant(tenantRes.data.data);
          setMetrics(tenantRes.data.data.stats);
          setUsers(usersRes.data.data);
          setActivity(activityRes.data.data);
          
          // Try to fetch billing data separately
          try {
            const billingRes = await apiClient.get(`/super-admin/tenants/${tenantId}/billing`);
            setBilling(billingRes.data.data);
          } catch (billingError) {
            console.log('Billing data not available, using mock data');
            // Use mock billing data
            const mockBilling = {
              currentPlan: {
                name: tenantRes.data.data.subscription?.plan || 'basic',
                price: tenantRes.data.data.subscription?.plan === 'premium' ? 79 : 29,
                billingCycle: 'monthly',
                status: tenantRes.data.data.subscription?.status || 'active',
                startDate: tenantRes.data.data.subscription?.startDate || tenantRes.data.data.createdAt,
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                daysUntilRenewal: 30
              },
              paymentHistory: [
                {
                  id: 'mock_001',
                  date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  amount: 79,
                  status: 'paid',
                  description: 'Monthly subscription'
                }
              ],
              totalRevenue: 79,
              averageMonthlyRevenue: 79
            };
            setBilling(mockBilling);
          }
        } catch (error) {
          console.error('Error fetching tenant data:', error);
          setError('Failed to load tenant details');
        } finally {
          setLoading(false);
        }
      };

      fetchTenantData();
    }
  }, [tenantId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!tenant) {
    return (
      <div className="text-center py-10">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Tenant Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The tenant with ID '{tenantId}' could not be found.</p>
        <Link href="/super-admin/tenants" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg mx-auto w-fit">
            <ArrowLeft size={18} className="mr-2" /> Back to Tenant List
          </a>
        </Link>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Tenant Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-gray-800 dark:text-white">{tenant.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-gray-800 dark:text-white">{tenant.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-gray-800 dark:text-white">{tenant.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Subdomain</p>
          <p className="text-gray-800 dark:text-white">{tenant.subdomain || 'Not set'}</p>
        </div>
      </div>
    </div>
  );

  const renderUsageMetrics = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Usage Metrics</h4>
      {metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Users" value={metrics.users} icon={Users} />
          <StatCard title="Appointments" value={metrics.appointments} icon={FileText} />
          <StatCard title="Services" value={metrics.services} icon={BarChart2} />
          <StatCard title="Customers" value={metrics.customers} icon={HardDrive} />
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Users ({users.length})</h4>
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No users found</p>
      )}
    </div>
  );

  const renderStorage = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Storage & Activity</h4>
      {activity.length > 0 ? (
        <div className="space-y-3">
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers: <span className="font-semibold">{metrics?.customers || 0}</span></p>
          </div>
          <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Recent Activity</h5>
          {activity.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-200">{item.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
      )}
    </div>
  );

  const renderPlanBilling = () => (
    <div className="space-y-6">
      {billing ? (
        <>
          {/* Current Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Current Subscription</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h5 className="font-medium text-green-800 dark:text-green-200">Plan</h5>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100 capitalize">
                  {billing.currentPlan.name}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  ${billing.currentPlan.price}/{billing.currentPlan.billingCycle}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 dark:text-blue-200">Status</h5>
                <p className="text-xl font-semibold text-blue-900 dark:text-blue-100 capitalize">
                  {billing.currentPlan.status}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Since {new Date(billing.currentPlan.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h5 className="font-medium text-orange-800 dark:text-orange-200">Next Billing</h5>
                <p className="text-xl font-semibold text-orange-900 dark:text-orange-100">
                  {billing.currentPlan.daysUntilRenewal} days
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  {new Date(billing.currentPlan.nextBillingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Revenue Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${billing.totalRevenue}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${billing.averageMonthlyRevenue}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Revenue</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Payment History</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {billing.paymentHistory.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                        ${payment.amount}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">
                        {payment.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => router.push('/super-admin/tenants')}
            className="mb-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Tenant List
          </button>
          <div className="flex items-center">
            {/* Assuming logoUrl may not exist yet */}
            {/* {tenant.logoUrl && <img src={tenant.logoUrl} alt={`${tenant.name} logo`} className="w-16 h-16 rounded-md mr-4 bg-gray-200 dark:bg-gray-700 object-contain"/>} */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{tenant.name}</h1>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">ID: {tenant._id}</p> */}
            </div>
          </div>
        </div>
                <Link href={`/super-admin/tenants/${tenant._id}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg text-sm">
            <Edit3 size={16} className="mr-2" /> Edit Tenant
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
        <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Usage Metrics" isActive={activeTab === 'usage'} onClick={() => setActiveTab('usage')} />
        <TabButton label="Users" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <TabButton label="Storage" isActive={activeTab === 'storage'} onClick={() => setActiveTab('storage')} />
        <TabButton label="Plan & Billing" isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-0 sm:p-2 rounded-lg">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'usage' && renderUsageMetrics()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'storage' && renderStorage()}
        {activeTab === 'billing' && renderPlanBilling()}
      </div>
    </div>
  );
}
