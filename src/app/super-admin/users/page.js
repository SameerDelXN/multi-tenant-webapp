// "use client";

// import React, { useEffect, useState } from "react";
// import apiClient from '../../../lib/api/apiClient';
// import { useDashboard } from '../../../contexts/DashboardContext';
// import { useRouter } from 'next/navigation';

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export default function SuperAdminUsersPage() {
//   const { userData, isLoading } = useDashboard();
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "", role: "user" });

//   React.useEffect(() => {
//     if (!isLoading && (!userData || userData.role !== 'superAdmin')) {
//       router.push('/login');
//     }
//   }, [isLoading, userData, router]);

//   React.useEffect(() => {
//     if (!isLoading && userData && userData.role === 'superAdmin') {
//       const fetchUsers = async () => {
//         try {
//           setLoading(true);
//           setError(null);
//           const response = await apiClient.get('/super-admin/users');
//           const filteredUsers = (response.data.data || []).filter(u => u.role !== 'customer');
//           setUsers(filteredUsers);
//         } catch (err) {
//           setError("Failed to fetch users");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchUsers();
//     }
//   }, [isLoading, userData]);

//   if (isLoading || loading) {
//     return <div className="p-6">Loading users...</div>;
//   }
//   if (error) {
//     return <div className="p-6 text-red-600">{error}</div>;
//   }
//   if (!userData || userData.role !== 'superAdmin') {
//     return null;
//   }

//   // Handle form changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Open modal for add/edit
//   const openModal = (type, user = null) => {
//     setModalType(type);
//     setSelectedUser(user);
//     setForm(user ? { name: user.name, email: user.email, role: user.role } : { name: "", email: "", role: "user" });
//     setShowModal(true);
//   };

//   // Add or update user
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modalType === "add") {
//         await apiClient.post('/users', form);
//       } else if (modalType === "edit" && selectedUser) {
//         await apiClient.put(`/users/${selectedUser._id}`, form);
//       }
//       setShowModal(false);
//       fetchUsers();
//     } catch (err) {
//       setError("Failed to save user");
//     }
//   };

//   // Delete user
//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await apiClient.delete(`/users/${userId}`);
//       fetchUsers();
//     } catch (err) {
//       setError("Failed to delete user");
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 w-full max-w-5xl mx-auto">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
//         <h2 className="text-lg sm:text-xl font-semibold">Users</h2>
//         <button
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
//           onClick={() => openModal("add")}
//         >
//           Add User
//         </button>
//       </div>
//       {loading ? (
//         <div>Loading users...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 text-sm">
//             <thead>
//               <tr>
//                 <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-2 sm:px-4 py-2"></th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{user.name}</td>
//                   <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{user.email}</td>
//                   <td className="px-2 sm:px-4 py-2 whitespace-nowrap capitalize">{user.role}</td>
//                   <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right">
//                     {/* <button
//                       className="text-blue-600 hover:underline mr-2"
//                       onClick={() => openModal("edit", user)}
//                     >
//                       Edit
//                     </button> */}
//                     {/* <button
//                       className="text-red-600 hover:underline"
//                       onClick={() => handleDelete(user._id)}
//                     >
//                       Delete
//                     </button> */}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal for Add/Edit User */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-2 sm:p-0">
//           <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-auto">
//             <h3 className="text-base sm:text-lg font-semibold mb-4">{modalType === "add" ? "Add User" : "Edit User"}</h3>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Role</label>
//                 <select
//                   name="role"
//                   value={form.role}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   required
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="superAdmin">Super Admin</option>
//                 </select>
//               </div>
//               <div className="flex flex-col sm:flex-row justify-end gap-2">
//                 <button
//                   type="button"
//                   className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
//                 >
//                   {modalType === "add" ? "Add" : "Update"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








"use client";

import React, { useEffect, useState } from "react";
import apiClient from '../../../lib/api/apiClient';
import { useDashboard } from '../../../contexts/DashboardContext';
import { useRouter } from 'next/navigation';

export default function SuperAdminCustomersPage() {
  const { userData, isLoading } = useDashboard();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (!isLoading && (!userData || userData.role !== 'superAdmin')) {
      router.push('/login');
    }
  }, [isLoading, userData, router]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all customers with user and tenant details populated
      const response = await apiClient.get('/customers/superadmin/all');
      console.log("Customers response:", response.data);
      
      let customersData = response.data.data || response.data || [];
      
      // If tenants are not populated, fetch tenant details
      if (customersData.length > 0 && (!customersData[0].tenants || !customersData[0].tenants[0]?.name)) {
        await fetchTenantsAndMap(customersData);
      } else {
        setCustomers(customersData);
      }
      
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Fallback method if tenants are not populated
  const fetchTenantsAndMap = async (customersData) => {
    try {
      // Fetch all tenants
      const tenantsResponse = await apiClient.get('/tenants');
      const tenants = tenantsResponse.data.data || tenantsResponse.data || [];
      
      // Create a map of tenant IDs to tenant details
      const tenantMap = {};
      tenants.forEach(tenant => {
        const tenantId = tenant._id?.$oid || tenant._id;
        tenantMap[tenantId] = tenant;
      });
      
      // Map tenant details to customers
      const customersWithTenantDetails = customersData.map(customer => {
        const tenantDetails = customer.tenants?.map(tenant => {
          const tenantId = tenant?.$oid || tenant;
          return tenantMap[tenantId] || { name: 'Unknown Tenant' };
        }) || [];
        
        return {
          ...customer,
          populatedTenants: tenantDetails
        };
      });
      
      setCustomers(customersWithTenantDetails);
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setCustomers(customersData); // Set customers without tenant details
    }
  };

  React.useEffect(() => {
    if (!isLoading && userData && userData.role === 'superAdmin') {
      fetchCustomers();
    }
  }, [isLoading, userData]);

  // Format date function
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    try {
      let date;
      if (dateValue.$date && dateValue.$date.$numberLong) {
        date = new Date(parseInt(dateValue.$date.$numberLong));
      } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        date = new Date(dateValue);
      } else {
        return 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  // Get display name from user or userDetails
  const getDisplayName = (customer) => {
    // Check if user is populated with details
    if (customer.user?.name) {
      return customer.user.name;
    }
    if (customer.user?.firstName || customer.user?.lastName) {
      return `${customer.user.firstName || ''} ${customer.user.lastName || ''}`.trim();
    }
    return 'N/A';
  };

  // Get email from user or userDetails
  const getEmail = (customer) => {
    if (customer.user?.email) {
      return customer.user.email;
    }
    return 'N/A';
  };

  // Get phone from user or userDetails
  const getPhone = (customer) => {
    if (customer.user?.phone) {
      return customer.user.phone;
    }
    return 'N/A';
  };

  // Get tenant names - handle both populated tenants and tenant IDs
  const getTenantNames = (customer) => {
    // Use populatedTenants if available (from fallback)
    if (customer.populatedTenants && customer.populatedTenants.length > 0) {
      return customer.populatedTenants.map(tenant => tenant.name).join(', ');
    }
    
    // Use populated tenants from API
    if (customer.tenants && customer.tenants.length > 0) {
      const tenantNames = customer.tenants.map(tenant => {
        // If tenant is populated with name
        if (typeof tenant === 'object' && tenant.name) {
          return tenant.name;
        }
        // If tenant is just an ID or object without name
        return 'Loading...';
      });
      return tenantNames.join(', ');
    }
    
    return 'No tenants';
  };

  if (isLoading || loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading customers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchCustomers}
            className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'superAdmin') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Customers</h2>
        <div className="text-sm text-gray-500">
          {customers.length} customer(s) found
        </div>
      </div>
      
      {customers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h3>
          <p className="text-gray-500 mb-4">
            There are no customers in the system yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Tenant Names</th>
                <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Customer Since</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => {
                const displayName = getDisplayName(customer);
                const email = getEmail(customer);
                const phone = getPhone(customer);
                const tenantNames = getTenantNames(customer);
                
                return (
                  <tr key={customer._id?.$oid || customer._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {displayName}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{email}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{phone}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-gray-600 text-xs max-w-xs">
                        {tenantNames}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-gray-600 text-xs">
                        {formatDate(customer.customerSince || customer.createdAt)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}