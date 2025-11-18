'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '../../../../../lib/api/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const EditTenantPage = () => {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subdomain: '',
    address: '',
    phone: '',
    website: '',
    domain: '',
    subscription: { status: 'active', plan: 'basic' },
    settings: { businessHours: '', timezone: 'UTC' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (tenantId) {
      const fetchTenant = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/super-admin/tenants/${tenantId}`);
          const tenantData = response.data.data;
          setFormData({
            name: tenantData.name || '',
            email: tenantData.email || '',
            subdomain: tenantData.subdomain || '',
            address: tenantData.address || '',
            phone: tenantData.phone || '',
            website: tenantData.website || '',
            domain: tenantData.domain || '',
            subscription: {
              status: tenantData.subscription?.status || 'active',
              plan: tenantData.subscription?.plan || 'basic'
            },
            settings: {
              businessHours: tenantData.settings?.businessHours || '',
              timezone: tenantData.settings?.timezone || 'UTC'
            }
          });
        } catch (error) {
          console.error('Error fetching tenant:', error);
          setError('Failed to load tenant details');
        } finally {
          setLoading(false);
        }
      };
      fetchTenant();
    }
  }, [tenantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.put(`/super-admin/tenants/${tenantId}`, formData);
      setSuccess('Tenant updated successfully!');
      setTimeout(() => router.push(`/super-admin/tenants/${tenantId}`), 1500);
    } catch (error) {
      console.error('Error updating tenant:', error);
      setError(error.response?.data?.message || 'Failed to update tenant');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <Link href={`/super-admin/tenants/${tenantId}`} className="mb-4 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800">
            <ArrowLeft size={18} className="mr-1" />
            Back to Tenant Details
        </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Tenant: {formData.name}</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">Subdomain</label>
            <input
              type="text"
              id="subdomain"
              name="subdomain"
              value={formData.subdomain}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., greenscape"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Hosted Domain</label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., gardening1.info or www.grochin-gardening.shop"
            />
          </div>

          <div>
            <label htmlFor="subscription.status" className="block text-sm font-medium text-gray-700">Subscription Status</label>
            <select
              id="subscription.status"
              name="subscription.status"
              value={formData.subscription.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="trialing">Trialing</option>
            </select>
          </div>

          <div>
            <label htmlFor="subscription.plan" className="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <select
              id="subscription.plan"
              name="subscription.plan"
              value={formData.subscription.plan}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
              <option value="none">No Plan</option>
            </select>
          </div>

          <div>
            <label htmlFor="settings.timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              id="settings.timezone"
              name="settings.timezone"
              value={formData.settings.timezone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Business address"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="settings.businessHours" className="block text-sm font-medium text-gray-700">Business Hours</label>
          <textarea
            id="settings.businessHours"
            name="settings.businessHours"
            value={formData.settings.businessHours}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Mon-Fri: 9AM-5PM, Sat: 9AM-2PM"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTenantPage;

