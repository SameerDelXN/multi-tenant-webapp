'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import apiClient from '@/lib/api/apiClient';
import { toast } from 'react-toastify';
import moment from 'moment';
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import PaymentModal from '@/components/admin/PaymentModal';
import CrewAssignmentModal from '@/components/admin/CrewAssignmentModal';

const AppointmentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { userData } = useDashboard();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);

  useEffect(() => {
    if (params.id && userData?.token) {
      fetchAppointment();
    }
  }, [params.id, userData]);

  const fetchAppointment = async () => {
    try {
      const response = await apiClient.get(`/appointments/${params.id}`);
      setAppointment(response.data.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details');
      router.push('/admin/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this appointment?')) return;
    
    try {
      await apiClient.put(`/appointments/${params.id}/approve`);
      toast.success('Appointment approved successfully');
      fetchAppointment();
    } catch (error) {
      toast.error('Failed to approve appointment');
    }
  };

  const handleStart = async () => {
    if (!confirm('Are you sure you want to start this service?')) return;
    
    try {
      await apiClient.put(`/appointments/${params.id}`, { status: 'In Progress' });
      toast.success('Service started successfully');
      fetchAppointment();
    } catch (error) {
      toast.error('Failed to start service');
    }
  };

  const handleComplete = async () => {
    if (!confirm('Are you sure you want to complete this service?')) return;
    
    try {
      await apiClient.put(`/appointments/${params.id}/complete`);
      toast.success('Service completed successfully');
      fetchAppointment();
    } catch (error) {
      toast.error('Failed to complete service');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await apiClient.put(`/appointments/${params.id}`, { status: 'Cancelled' });
      toast.success('Appointment cancelled successfully');
      fetchAppointment();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleCollectPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    toast.success('Payment collected successfully!');
    fetchAppointment(); // Refresh appointment data
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!appointment) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Appointment not found</p>
        </div>
      </AdminLayout>
    );
  }

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'scheduled': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'in progress': return 'bg-orange-100 text-orange-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/admin/appointments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Appointments
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Appointment Details</h1>
                <p className="text-green-100 mt-1">ID: {appointment._id}</p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{appointment.customer?.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {appointment.customer?.user?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {appointment.customer?.user?.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {typeof appointment.customer?.address === 'string' 
                          ? appointment.customer.address 
                          : appointment.customer?.address?.street 
                            ? `${appointment.customer.address.street}, ${appointment.customer.address.city || ''}, ${appointment.customer.address.state || ''} ${appointment.customer.address.zipCode || ''}`.trim()
                            : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service</label>
                      <p className="text-gray-900">{appointment.service?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900">{appointment.service?.category || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-gray-900">{appointment.service?.duration || 'N/A'} minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Appointment Schedule */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{moment(appointment.date).format('dddd, MMMM D, YYYY')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Time</label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Crew Assignment */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew Assignment</h3>
                  <div className="space-y-3">
                    {/* <div>
                      <label className="text-sm font-medium text-gray-500">Lead Professional</label>
                      <p className="text-gray-900">
                        {appointment.crew?.leadProfessional?.name || 'Not assigned'}
                      </p>
                    </div> */}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Team Members</label>
                      <div className="text-gray-900">
                        {appointment.crew?.assignedTo?.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {appointment.crew.assignedTo.map((member, index) => (
                              <li key={index}>{member.name}</li>
                            ))}
                          </ul>
                        ) : (
                          'No team members assigned'
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.payment?.status?.toLowerCase() === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.payment?.status || 'Pending'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Amount</label>
                      <p className="text-gray-900">${appointment.service?.basePrice || appointment.payment?.amount || '50.00'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Method</label>
                      <p className="text-gray-900">{appointment.payment?.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {(appointment.notes?.customer || appointment.notes?.internal) && (
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="space-y-4">
                  {appointment.notes?.customer && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer Notes</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{appointment.notes.customer}</p>
                    </div>
                  )}
                  {appointment.notes?.internal && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Internal Notes</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{appointment.notes.internal}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-4 mb-4">
                {appointment.status === 'Pending' && (
                  <>
                    {!appointment.crew?.leadProfessional && (!appointment.crew?.assignedTo || appointment.crew.assignedTo.length === 0) ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setShowCrewModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Assign Crew First
                        </button>
                        <p className="text-sm text-gray-500">Crew must be assigned before approval</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApprove()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Approve Appointment
                      </button>
                    )}
                  </>
                )}
                {appointment.status === 'Confirmed' && (
                  <button
                    onClick={() => handleStart()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Service
                  </button>
                )}
                {appointment.status === 'In Progress' && (
                  <button
                    onClick={() => handleComplete()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Complete Service
                  </button>
                )}
                {appointment.status === 'Completed' && appointment.payment?.status === 'pending' && (
                  <button
                    onClick={() => handleCollectPayment()}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Collect Payment
                  </button>
                )}
                {['Pending', 'Confirmed'].includes(appointment.status) && (
                  <button
                    onClick={() => handleCancel()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push(`/admin/appointments?edit=${appointment._id}`)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => router.push('/admin/appointments')}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        appointment={appointment}
        onSuccess={handlePaymentSuccess}
      />

      {/* Crew Assignment Modal */}
      <CrewAssignmentModal
        isOpen={showCrewModal}
        onClose={() => setShowCrewModal(false)}
        appointment={appointment}
        onUpdate={(updatedAppointment) => {
          setAppointment(updatedAppointment);
          setShowCrewModal(false);
        }}
      />
    </AdminLayout>
  );
};

export default AppointmentDetailPage;