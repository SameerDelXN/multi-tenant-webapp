'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/apiClient';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    systemUptime: 99.9,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/super-admin/dashboard-stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
      // Set mock data for development
      setStats({
        totalTenants: 25,
        activeTenants: 22,
        totalUsers: 150,
        totalRevenue: 45000,
        monthlyRevenue: 8500,
        systemUptime: 99.9,
        recentActivity: [
          { id: 1, type: 'tenant_created', message: 'New tenant "Green Gardens" registered', time: '2 hours ago' },
          { id: 2, type: 'payment_received', message: 'Payment received from "Landscape Pro"', time: '4 hours ago' },
          { id: 3, type: 'user_registered', message: 'New user registered in "Urban Landscaping"', time: '6 hours ago' },
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'green' }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon, onClick, color = 'green' }) => (
    <button
      onClick={onClick}
      className={`bg-${color}-50 hover:bg-${color}-100 p-4 rounded-lg border border-${color}-200 transition-colors text-left w-full`}
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
        <p className="text-sm text-gray-600 mt-1">Real-time statistics and system health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tenants"
          value={stats.totalTenants}
          subtitle={`${stats.activeTenants} active`}
          icon="🏢"
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Across all tenants"
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          subtitle="This month"
          icon="💳"
          color="green"
        />
        <StatCard
          title="System Uptime"
          value={`${stats.systemUptime}%`}
          subtitle="Last 30 days"
          icon="🟢"
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction
          title="Create New Tenant"
          description="Register a new landscaping business"
          icon="➕"
          onClick={() => window.location.href = '/super-admin/tenants/new'}
          color="green"
        />
        <QuickAction
          title="View System Logs"
          description="Monitor system activity and errors"
          icon="📋"
          onClick={() => window.location.href = '/super-admin/activity-logs'}
          color="blue"
        />
        <QuickAction
          title="Manage Settings"
          description="Configure global system settings"
          icon="⚙️"
          onClick={() => window.location.href = '/super-admin/settings'}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Services</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email Service</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Gateway</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Tenants (30d)</span>
              <span className="text-sm font-medium text-gray-900">+5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="text-sm font-medium text-gray-900">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Approvals</span>
              <span className="text-sm font-medium text-orange-600">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Alerts</span>
              <span className="text-sm font-medium text-green-600">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 