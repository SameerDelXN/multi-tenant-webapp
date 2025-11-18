'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../../lib/api/apiClient';
import { ArrowLeft, UploadCloud, Palette, CheckSquare, Square, Search } from 'lucide-react';

const planTypes = [
  { id: 'monthly', name: 'Monthly Plan' },
  { id: 'annual', name: 'Annual Plan' },
  { id: 'none', name: 'No Plan (Trial)' },
];

const allFeatures = [
  { id: 'estimates', name: 'Estimates' },
  { id: 'payments', name: 'Online Payments' },
  { id: 'crm', name: 'Customer CRM' },
  { id: 'notifications', name: 'Automated Notifications' },
  { id: 'scheduling', name: 'Advanced Scheduling' },
  { id: 'reporting', name: 'Reporting & Analytics' },
];

const predefinedThemes = [
  { name: 'Forest Green', primary: '#228B22', secondary: '#90EE90' },
  { name: 'Ocean Blue', primary: '#007bff', secondary: '#ADD8E6' },
  { name: 'Sunset Orange', primary: '#FF8C00', secondary: '#FFDAB9' },
  { name: 'Modern Gray', primary: '#6c757d', secondary: '#f8f9fa' }, 
];

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, children, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-green-500'
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
    )}
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

export default function CreateNewTenantPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    businessName: '',
    subdomain: '',
    contactEmail: '',
    contactPhone: '',
    adminPassword: '',
    planType: planTypes[0].id,
    logo: null,
    brandingTheme: predefinedThemes[0].primary,
    enabledFeatures: [],
    hostedDomain: '',
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [createdTenant, setCreatedTenant] = useState(null);

  // Focus first input on mount
  useEffect(() => {
    if (formRef.current) {
      const firstInput = formRef.current.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'businessName') {
        newFormData.subdomain = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      return newFormData;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: null }));
      }
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      enabledFeatures: prev.enabledFeatures.includes(featureId)
        ? prev.enabledFeatures.filter(id => id !== featureId)
        : [...prev.enabledFeatures, featureId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.subdomain)) newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Invalid email format.';
    if (!formData.adminPassword.trim()) newErrors.adminPassword = 'Admin password is required.';
    else if (formData.adminPassword.length < 8) newErrors.adminPassword = 'Password must be at least 8 characters long.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('name', formData.businessName);
      form.append('email', formData.contactEmail);
      form.append('subdomain', formData.subdomain);
      form.append('adminPassword', formData.adminPassword);
      form.append('plan', formData.planType);
      if (formData.hostedDomain) {
        form.append('domain', formData.hostedDomain);
      }
      if (formData.logo) {
        form.append('logo', formData.logo);
      }
      // Add other fields as needed

      const response = await apiClient.post('/super-admin/tenants', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCreatedTenant({
        ...response.data.data,
        adminEmail: formData.contactEmail,
        adminPassword: formData.adminPassword
      });
      setSuccess('Tenant created successfully!');
    } catch (error) {
      console.error('Error creating tenant:', error);
      setError(error.response?.data?.message || 'Failed to create tenant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button 
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Tenant List
      </button>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Create New Tenant</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && createdTenant ? (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckSquare size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Tenant Created Successfully!</h2>
            <p className="text-gray-600 dark:text-gray-400">The tenant has been created and is ready to use.</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">Tenant Admin Credentials</h3>
            <div className="space-y-3">
              {[
                { label: 'Business Name', value: createdTenant.name },
                { label: 'Subdomain', value: `${createdTenant.subdomain}.localhost:3000` },
                { label: 'Admin Email', value: createdTenant.adminEmail },
                { label: 'Admin Password', value: createdTenant.adminPassword },
              ].map((item) => (
                <div key={item.label}>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300">{item.label}:</label>
                  <p className="text-blue-800 dark:text-blue-200 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Please save these credentials securely. The tenant admin should change their password after first login.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setSuccess(null);
                setCreatedTenant(null);
                setFormData({
                  businessName: '',
                  subdomain: '',
                  contactEmail: '',
                  contactPhone: '',
                  adminPassword: '',
                  planType: planTypes[0].id,
                  logo: null,
                  brandingTheme: predefinedThemes[0].primary,
                  enabledFeatures: [],
                  hostedDomain: '',
                });
                setLogoPreview(null);
              }}
              className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Create Another Tenant
            </button>
            <button
              onClick={() => router.push('/super-admin/tenants')}
              className="px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              View All Tenants
            </button>
          </div>
        </div>
      ) : (
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Business Name" 
              name="businessName" 
              value={formData.businessName} 
              onChange={handleInputChange} 
              error={errors.businessName} 
              placeholder="e.g., GreenScape Landscaping"
              autoComplete="organization"
            />
            <InputField 
              label="Subdomain" 
              name="subdomain" 
              value={formData.subdomain} 
              onChange={handleInputChange} 
              error={errors.subdomain} 
              placeholder="e.g., greenscape"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Contact Email" 
              name="contactEmail" 
              type="email" 
              value={formData.contactEmail} 
              onChange={handleInputChange} 
              error={errors.contactEmail} 
              placeholder="e.g., contact@greenscape.com"
              autoComplete="email"
            />
            <InputField 
              label="Contact Phone (Optional)" 
              name="contactPhone" 
              type="tel" 
              value={formData.contactPhone} 
              onChange={handleInputChange} 
              placeholder="e.g., (555) 123-4567"
              autoComplete="tel"
            />
          </div>

          <InputField 
            label="Hosted Domain (optional)" 
            name="hostedDomain" 
            value={formData.hostedDomain} 
            onChange={handleInputChange} 
            placeholder="e.g., gardening1.info or www.grochin-gardening.shop"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Admin Password" 
              name="adminPassword" 
              type="password" 
              value={formData.adminPassword} 
              onChange={handleInputChange} 
              error={errors.adminPassword} 
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <div className="flex items-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> This password will be used for the tenant admin account. 
                  The tenant admin can change it after first login.
                </p>
              </div>
            </div>
          </div>
          
          <InputField label="Subscription Plan" name="planType" error={errors.planType}>
            <select 
              name="planType" 
              id="planType" 
              value={formData.planType} 
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              {planTypes.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </InputField>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Logo</label>
            <div className="mt-1 flex items-center gap-4">
              {logoPreview ? (
                <div className="relative group">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="h-16 w-16 rounded-md object-cover bg-gray-100 dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null);
                      setFormData(prev => ({ ...prev, logo: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                    aria-label="Remove logo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs text-gray-400">No logo</span>
                </div>
              )}
              <label 
                htmlFor="logo" 
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-md shadow-sm inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <UploadCloud size={18} className="mr-2" /> 
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </label>
              <input 
                id="logo" 
                name="logo" 
                type="file" 
                className="sr-only" 
                onChange={handleLogoChange} 
                accept="image/png, image/jpeg, image/svg+xml" 
              />
            </div>
            {formData.logo && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected: {formData.logo.name}
              </p>
            )}
            {errors.logo && (
              <p className="mt-1 text-xs text-red-500">{errors.logo}</p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branding Theme (Primary Color)
            </legend>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {predefinedThemes.map(theme => (
                <button 
                  key={theme.name} 
                  type="button"
                  title={theme.name}
                  onClick={() => setFormData(prev => ({ ...prev, brandingTheme: theme.primary }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formData.brandingTheme === theme.primary 
                      ? 'ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-green-500 border-white dark:border-gray-600' 
                      : 'border-transparent hover:ring-1 hover:ring-gray-400'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                  aria-label={`Select ${theme.name} theme`}
                />
              ))}
              <label className="relative">
                <input 
                  type="color" 
                  value={formData.brandingTheme} 
                  onChange={(e) => setFormData(prev => ({...prev, brandingTheme: e.target.value}))} 
                  className="w-8 h-8 rounded-md border-gray-300 dark:border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Custom color picker"
                />
                <span className="sr-only">Custom color</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enabled Features
            </legend>
            <div className="space-y-2">
              {allFeatures.map(feature => (
                <label 
                  key={feature.id} 
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.enabledFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                  <div className="w-5 h-5 border border-gray-400 dark:border-gray-500 rounded flex items-center justify-center peer-checked:bg-green-500 peer-checked:border-green-500 peer-focus:ring-2 peer-focus:ring-green-500">
                    {formData.enabledFeatures.includes(feature.id) ? (
                      <CheckSquare size={14} className="text-white" />
                    ) : (
                      <Square size={14} className="text-transparent" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              onClick={() => router.push('/super-admin/tenants')}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-gray-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Tenant'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}