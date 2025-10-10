'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import { useTenant } from '@/contexts/TenantContext';
import { getTenantApiClient } from '../../lib/api/apiClient';

export default function ContactPage() {
  const { tenant, tenantConfig } = useTenant();
  const [contactInfo, setContactInfo] = useState({
    phone: '602-793-0597',
    email: 'grochin2@gmail.com',
    address: '9719 E Clinton St, Scottsdale, AZ 85260',
    businessHours: [
      'Monday - Friday: 7:00 AM - 5:30 PM',
      'Saturday: 7:00 AM - 3:00 PM',
      'Sunday: Closed'
    ]
  });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    frequency: '',
    message: '',
    agreeToPolicy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const apiClient = getTenantApiClient();
        const response = await apiClient.get('/public/contact-info');
        const data = response.data;
        if (data?.success && data?.data) {
          setContactInfo({
            phone: data.data?.phone || '602-793-0597',
            email: data.data?.email || 'grochin2@gmail.com',
            address: data.data?.address || '9719 E Clinton St, Scottsdale, AZ 85260',
            businessHours: Array.isArray(data.data?.businessHours)
              ? data.data.businessHours
              : (data.data?.businessHours ? String(data.data.businessHours).split('\n') : [
                  'Monday - Friday: 7:00 AM - 5:30 PM',
                  'Saturday: 7:00 AM - 3:00 PM',
                  'Sunday: Closed'
                ])
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.message || !formData.agreeToPolicy) {
        throw new Error('Please fill in all required fields');
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        frequency: formData.frequency,
        message: formData.message
      });

      if (response.data.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          service: '',
          frequency: '',
          message: '',
          agreeToPolicy: false
        });
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-16 text-center">
        Loading contact information...
      </Container>
    );
  }

  return (
    <>
      <PageHeader 
        title="Contact Us"
        description="Reach out to discuss your landscaping needs or request a quote"
        backgroundImage="/images/contact-header.jpg"
      />

      <Container className="py-16">
        {submitSuccess && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Thank you for your message! We'll get back to you soon.</p>
          </div>
        )}
        
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a service</option>
                  <option value="landscape-design">Landscape Design</option>
                  <option value="lawn-maintenance">Lawn Maintenance</option>
                  <option value="hardscaping">Hardscaping</option>
                  <option value="irrigation">Irrigation Systems</option>
                  <option value="tree-care">Tree & Shrub Care</option>
                  <option value="outdoor-lighting">Outdoor Lighting</option>
                  <option value="Sprinkler-system">Sprinkler system installation and repair</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us about your project or questions..."
                  required
                />
              </div>
              
              <div className="flex items-start">
                <input
                  id="agreeToPolicy"
                  name="agreeToPolicy"
                  type="checkbox"
                  checked={formData.agreeToPolicy}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                  required
                />
                <label htmlFor="agreeToPolicy" className="ml-2 block text-sm text-gray-700">
                  I have read and agree to the <a href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a> *
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-6">Get in Touch</h2>
            <p className="text-gray-700 mb-8">
              Have questions about our services or ready to start your landscaping project? Contact us through the form or use the information below to reach out directly.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Office Address</h3>
                  <p className="mt-1 text-gray-700">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-700">
                    {contactInfo.phone}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Monday-Friday, 8am-6pm
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-700">
                    {contactInfo.email}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    We respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
            
            {/* Hours of Operation */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours of Operation</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2">
                  {contactInfo.businessHours.map((hours, index) => (
                    <div key={index} className="text-gray-700">{hours}</div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-red-600 transition-colors">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Our Location</h2>
          <div className="h-96 bg-gray-200 rounded-lg">
            {/* Replace with actual map component or embed */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Map Embed Here
            </div>
          </div>
        </div>
      </Container>
    </>
  );
} 