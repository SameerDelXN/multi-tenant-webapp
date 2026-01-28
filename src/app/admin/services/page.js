// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import AdminLayout from '@/components/admin/AdminLayout';
// import Button from '@/components/ui/Button';
// import { useDashboard } from '@/contexts/DashboardContext';
// import { useTenant } from '@/contexts/TenantContext';
// import axios from 'axios';

// const ServicesPage = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortField, setSortField] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [deleteLoading, setDeleteLoading] = useState(false);
  
//   const { userData, isLoading: userLoading } = useDashboard();
//   const { tenant, isLoading: tenantLoading } = useTenant();
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const CATEGORIES = [
//     'all',
//     'Lawn Maintenance',
//     'Gardening',
//     'Tree Service',
//     'Landscaping Design',
//     'Irrigation',
//     'Seasonal',
//     'Residential',
//     'Other'
//   ];

//   useEffect(() => {
//     if ((!userLoading && userData) && (!tenantLoading && tenant)) {
//       fetchServices();
//     }
//   }, [currentPage, selectedCategory, sortField, sortDirection, searchTerm, userData, userLoading, tenant, tenantLoading]);

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
      
//       // Ensure we have both user data and tenant context
//       if (!userData?.token) {
//         throw new Error('User authentication required');
//       }
      
//       if (!tenant?._id) {
//         throw new Error('Tenant context is required');
//       }

//       const params = {
//         category: selectedCategory !== 'all' ? selectedCategory : undefined,
//         search: searchTerm || undefined,
//         sort: `${sortDirection === 'asc' ? '' : '-'}${sortField}`
//       };

//       const response = await axios.get(`${API_URL}/services`, {
//         params,
//         headers: {
//           Authorization: `Bearer ${userData.token}`,
//           'X-Tenant-Subdomain': tenant.subdomain,
//         },
//       });
      
//       setServices(response.data?.data || []);
//       setTotalPages(Math.ceil((response.data?.count || 0) / 10));
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching services:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch services');
//       setServices([]);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//   if (!window.confirm('Are you sure you want to delete this service?')) return;

//   try {
//     setDeleteLoading(true);
    
//     // First fetch the service to verify ownership
//     const serviceResponse = await axios.get(`${API_URL}/services/${id}`, {
//       headers: {
//         Authorization: `Bearer ${userData?.token}`,
//         'X-Tenant-Subdomain': tenant?.subdomain,
//       },
//     });

//     const service = serviceResponse.data.data;

//     // Validate tenant ownership for tenant admins
//     if (userData.role === 'tenantAdmin' && 
//         tenant?._id && 
//         service.tenantId !== tenant._id) {
//       throw new Error("You can only delete services belonging to your tenant");
//     }

//     // Proceed with deletion
//     await axios.delete(`${API_URL}/services/${id}`, {
//       headers: {
//         Authorization: `Bearer ${userData?.token}`,
//         'X-Tenant-Subdomain': tenant?.subdomain,
//       },
//     });
    
//     fetchServices();
//   } catch (err) {
//     console.error('Delete error:', err);
//     setError(err.response?.data?.message || err.message || 'Failed to delete service');
//   } finally {
//     setDeleteLoading(false);
//   }
// };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleCategoryChange = (e) => {
//     setSelectedCategory(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const getSerialNumber = (index) => {
//     return (currentPage - 1) * 10 + index + 1;
//   };

//   return (
//     <AdminLayout>
//       <div className="container mx-auto px-4 py-6">
//         <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Services Management</h1>
//             <p className="text-gray-600 mt-1">Manage the services your landscaping business offers</p>
//           </div>
//           <div>
//             <Link href="/admin/services/new">
//               <Button variant="primary" className="w-full sm:w-auto">
//                 <span className="hidden sm:inline">Add New Service</span>
//                 <span className="sm:hidden">+ Add</span>
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
//             {error}
//           </div>
//         )}

//         {/* Search and filters */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 placeholder="Search services..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>

//             <div>
//               <select
//                 className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//               >
//                 {CATEGORIES.map(category => (
//                   <option key={category} value={category}>
//                     {category === 'all' ? 'All Categories' : category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Services Table */}
//         <div className="bg-white shadow overflow-hidden rounded-lg">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                     Sr.No.
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
//                     Image
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
//                     <div className="flex items-center">
//                       Name
//                       {sortField === 'name' && (
//                         <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                       )}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer" onClick={() => handleSort('category')}>
//                     <div className="flex items-center">
//                       Category
//                       {sortField === 'category' && (
//                         <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                       )}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer" onClick={() => handleSort('basePrice')}>
//                     <div className="flex items-center">
//                       Price
//                       {sortField === 'basePrice' && (
//                         <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                       )}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer" onClick={() => handleSort('createdAt')}>
//                     <div className="flex items-center">
//                       Date Added
//                       {sortField === 'createdAt' && (
//                         <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                       )}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="7" className="px-4 py-4 text-center">
//                       <div className="flex justify-center items-center py-8">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : services.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
//                       No services found. Try adjusting your search or filters.
//                     </td>
//                   </tr>
//                 ) : (
//                   services.map((service, index) => (
//                     <tr key={service._id} className="hover:bg-gray-50">
//                       <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
//                         {getSerialNumber(index)}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
//                         {service.image ? (
//                           <img 
//                             src={service.image?.url} 
//                             alt={service.name} 
//                             className="h-10 w-10 rounded-full object-cover" 
//                           />
//                         ) : (
//                           <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
//                             <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                             </svg>
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-4 py-4">
//                         <div className="flex items-center">
//                           <div className="sm:hidden mr-3">
//                             {service.image ? (
//                               <img 
//                                 src={service.image?.url} 
//                                 alt={service.name} 
//                                 className="h-10 w-10 rounded-full object-cover" 
//                               />
//                             ) : (
//                               <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                 <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                   <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                                 </svg>
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{service.name}</div>
//                             <div className="sm:hidden text-sm text-gray-500 mt-1">
//                               {service.category} • {service.basePrice ? `$${service.basePrice.toFixed(2)}` : 'N/A'}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           {service.category}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
//                         <div className="text-sm text-gray-900">
//                           {service.basePrice ? `$${service.basePrice.toFixed(2)}` : 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
//                         <div className="text-sm text-gray-500">
//                           {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           <Link href={`/admin/services/${service._id}/edit`}>
//                             <Button variant="secondary" size="sm" className="px-3">
//                               <span className="sr-only">Edit</span>
//                               <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                               </svg>
//                               <span className="hidden sm:inline ml-1">Edit</span>
//                             </Button>
//                           </Link>
//                           <Button
//                             variant="danger"
//                             size="sm"
//                             className="px-3"
//                             disabled={deleteLoading}
//                             onClick={() => handleDelete(service._id)}
//                           >
//                             <span className="sr-only">Delete</span>
//                             <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                             <span className="hidden sm:inline ml-1">
//                               {deleteLoading ? 'Deleting...' : 'Delete'}
//                             </span>
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {services.length > 0 && (
//             <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
//                     <span className="font-medium">{Math.min(currentPage * 10, services.length + (currentPage - 1) * 10)}</span> of{' '}
//                     <span className="font-medium">{services.length + (currentPage - 1) * 10}</span> results
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span className="sr-only">Previous</span>
//                       <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                             currentPage === pageNum
//                               ? 'z-10 bg-green-50 border-green-500 text-green-600'
//                               : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <span className="sr-only">Next</span>
//                       <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ServicesPage;





'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTenant } from '@/contexts/TenantContext';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // 'success', 'error', or 'confirm'
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  const { userData, isLoading: userLoading } = useDashboard();
  const { tenant, isLoading: tenantLoading } = useTenant();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const CATEGORIES = [
    'all',
    'Lawn Maintenance',
    'Gardening',
    'Tree Service',
    'Landscaping Design',
    'Irrigation',
    'Seasonal',
    'Residential',
    'Other'
  ];

  useEffect(() => {
    if (!userLoading && userData && !tenantLoading) {
      fetchServices();
    }
  }, [currentPage, selectedCategory, sortField, sortDirection, searchTerm, userData, userLoading, tenant, tenantLoading]);

  const showNotification = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 5000);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      if (!userData?.token) {
        throw new Error('User authentication required');
      }
      
      // Allow superadmin mode without tenant context
      if (!tenant?._id && userData.role !== 'superAdmin') {
        throw new Error('Tenant context is required');
      }

      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        sort: `${sortDirection === 'asc' ? '' : '-'}${sortField}`
      };

      const headers = {
        Authorization: `Bearer ${userData.token}`,
      };
      
      // Add tenant headers only if tenant exists
      if (tenant?.subdomain) {
        headers['X-Tenant-Subdomain'] = tenant.subdomain;
      }
      
      // For superadmin, request all tenants' services
      if (userData.role === 'superAdmin' && !tenant) {
        headers['x-all-tenants'] = 'true';
      }

      const response = await axios.get(`${API_URL}/services`, {
        params,
        headers,
      });
      
      setServices(response.data?.data || []);
      setTotalPages(Math.ceil((response.data?.count || 0) / 10));
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch services';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      setServices([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setServiceToDelete(id);
    setPopupMessage('Are you sure you want to delete this service?');
    setPopupType('confirm');
    setShowPopup(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      setDeleteLoading(serviceToDelete);
      setShowPopup(false);
      
      // First fetch the service to verify ownership
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
      };
      
      if (tenant?.subdomain) {
        headers['X-Tenant-Subdomain'] = tenant.subdomain;
      }
      
      const serviceResponse = await axios.get(`${API_URL}/services/${serviceToDelete}`, {
        headers,
      });

      const service = serviceResponse.data.data;

      // Validate tenant ownership for tenant admins
      if (userData.role === 'tenantAdmin' && 
          tenant?._id && 
          service.tenantId !== tenant._id) {
        throw new Error("You can only delete services belonging to your tenant");
      }

      // Proceed with deletion
      const deleteHeaders = {
        Authorization: `Bearer ${userData?.token}`,
      };
      
      if (tenant?.subdomain) {
        deleteHeaders['X-Tenant-Subdomain'] = tenant.subdomain;
      }
      
      await axios.delete(`${API_URL}/services/${serviceToDelete}`, {
        headers: deleteHeaders,
      });
      
      fetchServices();
      showNotification('Service deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete service';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setDeleteLoading(null);
      setServiceToDelete(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSerialNumber = (index) => {
    return (currentPage - 1) * 10 + index + 1;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Notification Popup */}
        {showPopup && (
          <div className="fixed top-4 right-4 z-50 transition-transform duration-300 ease-out animate-scale-fade-in">
            <div className={`bg-white border ${
              popupType === 'success' ? 'border-green-200' : 
              popupType === 'error' ? 'border-red-200' : 'border-blue-200'
            } rounded-lg shadow-xl p-4 w-64 relative overflow-hidden`}>
              {/* Top decorative bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                popupType === 'success' ? 'from-green-400 to-emerald-500' : 
                popupType === 'error' ? 'from-red-400 to-rose-500' : 'from-blue-400 to-indigo-500'
              } animate-pulse`}></div>
              
              {/* Bottom subtle bar */}
              <div className={`absolute bottom-0 left-0 h-2 w-full ${
                popupType === 'success' ? 'bg-green-50' : 
                popupType === 'error' ? 'bg-red-50' : 'bg-blue-50'
              }`}></div>

              <div className="flex items-start">
                {/* Icon */}
                <div className="flex-shrink-0 relative">
                  <div className={`h-10 w-10 rounded-full ${
                    popupType === 'success' ? 'bg-green-50 border-green-200' : 
                    popupType === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                  } flex items-center justify-center border-2 animate-bounce`}>
                    {popupType === 'confirm' ? (
                      <span className="text-xl">❓</span>
                    ) : popupType === 'error' ? (
                      <X className="h-5 w-5 text-red-600" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-2xl">
                    {popupType === 'success' ? '🌿' : popupType === 'error' ? '⚠️' : '❓'}
                  </div>
                </div>

                {/* Text Content */}
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {popupType === 'confirm' ? 'Confirm Action' : 
                     popupType === 'error' ? 'Error' : 'Success!'}
                  </h3>
                  <div className="mt-1 text-sm text-gray-600">
                    {popupMessage}
                  </div>
                </div>
              </div>

              {/* Auto-dismiss progress bar */}
              {popupType !== 'confirm' && (
                <div className={`absolute bottom-0 left-0 h-1 w-full ${
                  popupType === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div 
                    className={`h-full ${
                      popupType === 'success' ? 'bg-green-400' : 'bg-red-400'
                    } animate-[shrink_5s_linear_forwards]`}
                    onAnimationEnd={() => setShowPopup(false)}
                  ></div>
                </div>
              )}

              {/* Action buttons for confirm dialog */}
              {popupType === 'confirm' && (
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage the services your landscaping business offers</p>
          </div>
          <div>
            <Link href="/admin/services/new">
              <Button variant="primary" className="w-full sm:w-auto">
                <span className="hidden sm:inline">Add New Service</span>
                <span className="sm:hidden">+ Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Search and filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search services..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Sr.No.
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Image
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      Category
                      {sortField === 'category' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer" onClick={() => handleSort('basePrice')}>
                    <div className="flex items-center">
                      Price
                      {sortField === 'basePrice' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center">
                      Date Added
                      {sortField === 'createdAt' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center">
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                      No services found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  services.map((service, index) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                        {getSerialNumber(index)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                        {service.image ? (
                          <img 
                            src={service.image?.url} 
                            alt={service.name} 
                            className="h-10 w-10 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="sm:hidden mr-3">
                            {service.image ? (
                              <img 
                                src={service.image?.url} 
                                alt={service.name} 
                                className="h-10 w-10 rounded-full object-cover" 
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="sm:hidden text-sm text-gray-500 mt-1">
                              {service.category} • {service.basePrice ? `$${service.basePrice.toFixed(2)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">
                          {service.basePrice ? `$${service.basePrice.toFixed(2)}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-500">
                          {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/services/${service._id}/edit`}>
                            <Button variant="secondary" size="sm" className="px-3">
                              <span className="sr-only">Edit</span>
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              <span className="hidden sm:inline ml-1">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="px-3"
                            disabled={!!deleteLoading}
                            onClick={() => confirmDelete(service._id)}
                          >
                            <span className="sr-only">Delete</span>
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="hidden sm:inline ml-1">
                              {deleteLoading === service._id ? 'Deleting...' : 'Delete'}
                            </span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {services.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, services.length + (currentPage - 1) * 10)}</span> of{' '}
                    <span className="font-medium">{services.length + (currentPage - 1) * 10}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-green-50 border-green-500 text-green-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServicesPage;