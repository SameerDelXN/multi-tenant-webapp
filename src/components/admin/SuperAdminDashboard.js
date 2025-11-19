'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Building2, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import apiClient from '../../lib/api/apiClient';
import { useDashboard } from '../../contexts/DashboardContext';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {change && (
          <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'positive' ? '+' : ''}{change} this month
          </p>
        )}
      </div>
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const { userData } = useDashboard();
  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tenantsRes] = await Promise.all([
        apiClient.get('/super-admin/dashboard-stats'),
        apiClient.get('/super-admin/tenants?limit=5')
      ]);
      setStats(statsRes.data.data);
      setTenants(tenantsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const id = setInterval(fetchDashboardData, 30000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchDashboardData();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const handleDeleteTenant = async (tenantId) => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(`/super-admin/tenants/${tenantId}`);
      setTenants(tenants.filter(tenant => tenant._id !== tenantId));
      setSuccess('Tenant deleted successfully');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setError('Failed to delete tenant');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {userData?.name}!</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDashboardData} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-2 px-4 rounded-lg">
            Refresh
          </button>
          <Link href="/super-admin/tenants/new" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg">
            Create New Tenant
          </Link>
        </div>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Tenants" 
              value={stats.totalTenants} 
              icon={Building2} 
              change={stats.newTenantsThisMonth}
              changeType="positive"
            />
            <StatCard 
              title="Active Tenants" 
              value={stats.activeTenants} 
              icon={TrendingUp} 
            />
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers} 
              icon={Users} 
              change={stats.newUsersThisMonth}
              changeType="positive"
            />
            <StatCard 
              title="Monthly Revenue" 
              value={`$${stats.monthlyRevenue?.toLocaleString() || 0}`} 
              icon={DollarSign} 
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats.recentActivity?.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-200">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">System Uptime</span>
                  <span className="font-semibold text-green-600">{stats.systemUptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Appointments</span>
                  <span className="font-semibold">{stats.totalAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Services</span>
                  <span className="font-semibold">{stats.totalServices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Customers</span>
                  <span className="font-semibold">{stats.totalCustomers}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Tenants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tenants</h3>
          <Link href="/super-admin/tenants" className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tenant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      tenant.subscription?.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {tenant.subscription?.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/super-admin/tenants/${tenant._id}`} className="text-green-600 hover:text-green-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
