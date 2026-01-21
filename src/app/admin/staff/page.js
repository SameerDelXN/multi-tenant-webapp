'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import AddStaffModal from './components/AddStaffModal';
import EditStaffModal from './components/EditStaffModal';
import WorkloadModal from './components/WorkloadModal';
import { useDashboard } from '@/contexts/DashboardContext';
import AdminLayout from '@/components/admin/AdminLayout';
import apiClient from '@/lib/api/apiClient';

export default function StaffPage() {
  const router = useRouter();
  const { userData, isLoading: authLoading } = useDashboard();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWorkloadModal, setShowWorkloadModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (authLoading) return;
    
    if (!userData?.token) {
      router.push('/login');
      return;
    }

    // Check if user is admin or tenantAdmin
    if (userData.role !== 'admin' && userData.role !== 'tenantAdmin') {
      toast.error('You do not have permission to access this page');
      router.push('/admin');
      return;
    }

    fetchStaff();
  }, [userData, authLoading, router]);

  const fetchStaff = async () => {
    try {
      const response = await apiClient.get('/users/staff');
      setStaff(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this page');
        router.push('/dashboard');
      } else {
        toast.error('Failed to fetch staff members');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await apiClient.delete(`/users/${id}`);
        toast.success('Staff member deleted successfully');
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        if (error.response?.status === 401) {
          router.push('/login');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to delete staff members');
        } else {
          toast.error('Failed to delete staff member');
        }
      }
    }
  };

  const handleViewWorkload = async (staff) => {
    try {
      const response = await apiClient.get(`/users/${staff._id}/workload`);
      setSelectedStaff({ ...staff, workload: response.data.data });
      setShowWorkloadModal(true);
    } catch (error) {
      console.error('Error fetching workload:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view workload data');
      } else {
        toast.error('Failed to fetch workload data');
      }
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
<AdminLayout>
<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="staff">Staff</option>
            <option value="tenantAdmin">Tenant Admin</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* <button
                        onClick={() => handleViewWorkload(member)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Workload"
                      >
                        <FaCalendarAlt />
                      </button> */}
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <AddStaffModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchStaff();
          }}
        />
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchStaff();
          }}
        />
      )}

      {/* Workload Modal */}
      {showWorkloadModal && selectedStaff && (
        <WorkloadModal
          staff={selectedStaff}
          onClose={() => setShowWorkloadModal(false)}
        />
      )}
    </div>
</AdminLayout>
  );
} 