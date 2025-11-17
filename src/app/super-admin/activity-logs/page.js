'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ListFilter, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import apiClient from '@/lib/api/apiClient';

const ITEMS_PER_PAGE = 10;

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', adminUser: '', actionType: '', dateFrom: '', dateTo: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Deterministic timestamp printer to avoid SSR/CSR mismatch
  const formatTimestamp = (value) => {
    if (!value) return '';
    try {
      const d = new Date(value);
      // Use fixed locale and UTC to avoid timezone/locale differences between server and client
      const fmt = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      });
      return fmt.format(d);
    } catch (_) {
      return '';
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const ts = log.timestamp ? new Date(log.timestamp) : null;
      const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

      const adminEmail = log.userId?.email || '';
      const action = log.type || '';
      const targetId = log.tenantId?._id || '';
      const details = log.message || '';
      const ip = log.ipAddress || '';

      const matchesSearch =
        !filters.searchTerm ||
        adminEmail.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        action.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        String(targetId).toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        details.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        ip.includes(filters.searchTerm);

      const matchesAdmin =
        !filters.adminUser || adminEmail.toLowerCase().includes(filters.adminUser.toLowerCase());

      const matchesDate = (!dateFrom || (ts && ts >= dateFrom)) && (!dateTo || (ts && ts <= new Date(dateTo.getTime() + 24*60*60*1000 - 1)));

      const matchesType = !filters.actionType || action === filters.actionType;

      return matchesSearch && matchesAdmin && matchesDate && matchesType;
    });
  }, [logs, filters]);

  const uniqueAdminUsers = useMemo(() => [...new Set(logs.map(log => log.userId?.email || ''))].filter(Boolean), [logs]);
  const uniqueActionTypes = useMemo(() => [...new Set(logs.map(log => log.type))], [logs]);

  // Fetch logs from API whenever page/type/date filters change
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set('page', String(currentPage));
        params.set('limit', String(ITEMS_PER_PAGE));
        if (filters.actionType) params.set('type', filters.actionType);
        if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.set('dateTo', filters.dateTo);
        const { data } = await apiClient.get(`/super-admin/activity-logs?${params.toString()}`);
        setLogs(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (e) {
        console.error('Failed to fetch activity logs:', e);
        setLogs([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [currentPage, filters.actionType, filters.dateFrom, filters.dateTo]);

  const handleDownloadLogs = () => {
    // Basic CSV download functionality
    const headers = ['Timestamp', 'Admin User', 'Action', 'Target Type', 'Target ID', 'Details', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log =>
        [
          new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          }).format(new Date(log.timestamp)),
          log.userId?.email || '',
          log.type || '',
          log.tenantId ? 'Tenant' : (log.metadata?.targetType || ''),
          log.tenantId?._id || log.metadata?.targetId || '',
          (log.message || '').replace(/,/g, ';'),
          log.ipAddress || ''
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin_activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Admin Activity Logs</h1>
        <button 
          onClick={handleDownloadLogs}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg"
        >
          <Download size={18} className="mr-2" /> Download Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Logs</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                name="searchTerm" 
                id="searchTerm"
                placeholder="Search by keyword, IP, etc."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="adminUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin User</label>
            <select name="adminUser" id="adminUser" value={filters.adminUser} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
              <option value="">All Users</option>
              {uniqueAdminUsers.map(user => <option key={user} value={user}>{user}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Type</label>
            <select name="actionType" id="actionType" value={filters.actionType} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
              <option value="">All Actions</option>
              {uniqueActionTypes.map(action => <option key={action} value={action}>{action}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
                <input type="date" name="dateFrom" id="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
            <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
                <input type="date" name="dateTo" id="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Timestamp', 'Admin User', 'Action', 'Target', 'Details', 'IP Address'].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTimestamp(log.timestamp)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.userId?.email || ''}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {log.tenantId ? `Tenant: ${log.tenantId?.name}` : (log.metadata?.targetType || '')}{(log.tenantId?._id || log.metadata?.targetId) ? `: ${log.tenantId?._id || log.metadata?.targetId}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={log.message}>{log.message}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.ipAddress || ''}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
