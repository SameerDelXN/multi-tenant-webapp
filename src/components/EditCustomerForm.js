'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import Button from './ui/Button';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const EditCustomerForm = ({ customerId }) => {
  const { userData } = useDashboard();
  const [customerData, setCustomerData] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    // email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(true);
  
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

 // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !userData?.token) {
      router.push('/login');
    }
  }, [isLoading, userData, router]);


  useEffect(() => {
    if (!customerId) {
      setError('Customer ID is required');
      setLoading(false);
      return;
    }
const fetchCustomer = async () => {
  try {
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch customer data');

    const { data } = await response.json();
    setCustomerData(data); // Store the complete customer data
    
    setFormData({
      name: data.user?.name || '',
    //   email: data.user?.email || '',
      phone: data.user?.phone || '',
      street: data.address?.street || '',
      city: data.address?.city || '',
      state: data.address?.state || '',
      zipCode: data.address?.zipCode || '',
      country: data.address?.country || 'USA'
    });
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchCustomer();
  }, [customerId, userData]);

  const handleChange = (e) => {
    setError(''); // Clear error on change
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Validation
  const phoneRegex = /^\d{10}$/;
  if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
    setError('Phone number must be exactly 10 digits');
    return;
  }

  // Street Validation: Min 5 chars, digits/letters/spaces only
  const streetRegex = /^[a-zA-Z0-9\s-]+$/;
  if (!formData.street || formData.street.trim().length < 5) {
    setError('Street address must be at least 5 characters');
    return;
  }
  if (!streetRegex.test(formData.street)) {
    setError('Street address can only contain letters, numbers, and spaces');
    return;
  }

  // City Validation: Min 2 chars, letters only
  const textOnlyRegex = /^[a-zA-Z\s]+$/;
  if (!formData.city || formData.city.trim().length < 5) {
    setError('City must be at least 5 characters');
    return;
  }
  if (!textOnlyRegex.test(formData.city)) {
    setError('City can only contain letters');
    return;
  }

  // State Validation: Min 2 chars, letters only
  if (!formData.state || formData.state.trim().length < 5) {
    setError('State must be at least 5 characters');
    return;
  }
  if (!textOnlyRegex.test(formData.state)) {
    setError('State can only contain letters');
    return;
  }

  // ZIP Code Validation: Exact 6 digits
  const zipRegex = /^\d{6}$/;
  if (!formData.zipCode || !zipRegex.test(formData.zipCode)) {
    setError('ZIP Code must be exactly 6 digits');
    return;
  }

  // Country Validation: Min 2 chars, letters only
  if (!formData.country || formData.country.trim().length < 5) {
    setError('Country must be at least 5 characters');
    return;
  }
  if (!textOnlyRegex.test(formData.country)) {
    setError('Country can only contain letters');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: customerData.user._id, // Use the stored user ID
        user: {
          name: formData.name,
        //   email: formData.email,
          phone: formData.phone
        },
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update customer');
    }

    router.push('/admin/customers');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (!customerId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">No customer selected for editing</p>
        </div>
      </div>
    );
  }

  if (loading && !formData.name) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Customer</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div> */}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 1234567890"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Must be exactly 10 digits</p>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/customers')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditCustomerForm;