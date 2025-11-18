"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "../../../components/admin/AdminLayout";
import Button from "../../../components/ui/Button";
import { useDashboard } from "@/contexts/DashboardContext";
import { motion } from "framer-motion";

const CustomersPage = () => {
  const { userData } = useDashboard();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTenant, setSelectedTenant] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch all customers for the tenant
  const fetchCustomers = async () => {
    try {
      if (!userData || !userData.token) {
        setLoading(false);
        return;
      }

      let url = `${API_URL}/customers`;
      if (selectedTenant) {
        url += `?tenant=${selectedTenant}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data.data || []);
      
    } catch (err) {
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
  }, [userData, selectedTenant]);

  // Delete customer
  const deleteCustomer = async (customerId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this customer?")) {
        return;
      }

      const response = await fetch(`${API_URL}/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer');
      }

      // Refresh the customer list after deletion
      fetchCustomers();
    } catch (err) {
      setError(err.message || 'Failed to delete customer');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort customers
  const filteredCustomers = [...customers]
    .filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (customer.user?.name &&
          customer.user.name.toLowerCase().includes(searchLower)) ||
        (customer.user?.email &&
          customer.user.email.toLowerCase().includes(searchLower)) ||
        (customer.user?.phone &&
          customer.user.phone.toLowerCase().includes(searchLower)) ||
        (customer.address &&
          ((customer.address?.street &&
            customer.address?.street.toLowerCase().includes(searchLower)) ||
            (customer.address?.city &&
              customer.address?.city.toLowerCase().includes(searchLower)) ||
            (customer.address?.country &&
              customer.address?.country.toLowerCase().includes(searchLower))))
      );
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === "name" || sortField === "email") {
        aValue = a.user?.[sortField] || "";
        bValue = b.user?.[sortField] || "";
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
        return sortDirection === "asc"
          ? aValue.length - bValue.length
          : bValue.length - aValue.length;
      }
      return 0;
    });

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Link href="/admin/customers/new">
            <Button variant="primary">Add Customer</Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow mb-6"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="Search customers by name, email, phone, or address..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </motion.div>

      {/* Customers Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sr.No.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === "name" && (
                      <svg
                        className="ml-1 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        {sortDirection === "asc" ? (
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === "email" && (
                      <svg
                        className="ml-1 w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        {sortDirection === "asc" ? (
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6} 
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No customers found. Try adjusting your search or add a new
                    customer.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgba(209, 250, 229, 0.3)" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-emerald-800">
                              {customer.user?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.user?.name || "No name"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.user?.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.user?.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {(() => {
                        const a = customer.address || {};
                        const street = a.street || '';
                        const city = a.city || '';
                        const state = a.state || '';
                        const zip = a.zipCode || '';
                        const country = a.country || '';
                        const cityStateZip = [city, state, zip].filter(Boolean).join(', ');
                        const parts = [street, cityStateZip, country].filter(Boolean);
                        return parts.length ? parts.join(', ') : 'N/A';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                        <Link
                          href={`/admin/customers/${customer._id}`}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/customers/${customer._id}/edit`}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors"
                          onClick={() => deleteCustomer(customer._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomersPage;