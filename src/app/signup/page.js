'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useDashboard } from '../../contexts/DashboardContext';

export default function SignupPage() {
  const router = useRouter();
  const { loginWithRole } = useDashboard();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [tenantId, setTenantId] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(true);

    // Utility to extract tenant domain identifier from current host
  // Handles:
  // - tenant.example.com -> "tenant"
  // - gardening1.info -> "gardening1.info"
  // - gardening1:3000 -> "gardening1"
  const extractTenantDomain = () => {
    if (typeof window === 'undefined') return null;
    const host = window.location.host; // may include port
    let domain = host.split(':')[0].toLowerCase();

    // Superadmin/main domains where no tenant context is needed
    if (
      domain === 'localhost' ||
      domain === '127.0.0.1' ||
      domain === 'delxn.club' ||
      domain === 'www.delxn.club' ||
      domain === 'landscape360.com' ||
      domain === 'www.landscape360.com'
    ) {
      return null;
    }

    if (domain.startsWith('www.')) {
      domain = domain.slice(4);
    }

    const parts = domain.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return domain;
  };

  useEffect(() => {
    const tenantDomain = extractTenantDomain();
    if (!tenantDomain) {
      setTenantLoading(false);
      setTenantId(null);
      return;
    }
    fetch(`${API_URL}/tenant/info`, {
      headers: {
        'X-Tenant-Domain': tenantDomain
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data._id) {
          setTenantId(data.data._id);
        } else {
          setTenantId(null);
        }
      })
      .catch(() => setTenantId(null))
      .finally(() => setTenantLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tenantLoading) { // Wait until tenant resolution attempt completes
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const tenantDomain = extractTenantDomain();
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tenantDomain ? { 'X-Tenant-Domain': tenantDomain } : {})
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: 'customer', // Force customer role
          tenant: tenantId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left side - Image and benefits */}
        <div 
          className="md:w-1/2 p-6 text-white flex flex-col justify-center relative bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/landscaping-image.png)",
            minHeight: "400px"
          }}
        >
          {/* Discount badge - animated */}
          <div className="absolute -top-5 -right-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold rounded-full w-20 h-20 flex items-center justify-center transform rotate-12 animate-pulse shadow-lg z-10">
            <div className="text-center">
              <span className="block text-xs">UP TO</span>
              <span className="block text-xl">10% OFF</span>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-4 leading-tight">
              Join Us & Get <span className="text-yellow-300">Exclusive Discounts</span>!
            </h1>
            
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white border-opacity-20">
              <h2 className="text-lg font-semibold mb-3 text-yellow-300">New Member Benefits:</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium">10% First Service Discount</h3>
                    <p className="text-gray-200 text-xs">Applied automatically when you book</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Priority Booking</h3>
                    <p className="text-gray-200 text-xs">Early access to premium time slots</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-400 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium">Seasonal Promotions</h3>
                    <p className="text-gray-200 text-xs">Exclusive offers throughout the year</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <p className="text-gray-200 text-sm font-medium">24/7 Customer Support</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white">
          {showSuccess ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Welcome Aboard!</h2>
              <p className="text-gray-600 text-sm mb-6">
                We've sent a confirmation email to <span className="font-semibold">{formData.email}</span> with instructions to complete your registration.
              </p>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Continue to Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-800 mb-1">Create Your Account</h2>
                <p className="text-gray-600 text-sm">Join thousands of happy customers enjoying our services</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                    <p className="text-red-700">{errors.form}</p>
                  </div>
                )}

                <Input
                  label="Full Name"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  icon={
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  }
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  icon={
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  }
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                  pattern="[0-9]{10}"
                  title="10-digit phone number"
                  icon={
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  }
                />

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="font-light text-gray-600">
                      I agree to the <Link href="/terms-of-service" className="text-green-600 hover:underline font-medium">Terms</Link> and <Link href="/privacy-policy" className="text-green-600 hover:underline font-medium">Privacy Policy</Link>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading || tenantLoading}
                  disabled={isLoading || tenantLoading}
                  className="mt-4 py-2.5 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {isLoading ? 'Creating Account...' : 'Claim Your 10% Discount Now'}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline">
                      Log in here
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}