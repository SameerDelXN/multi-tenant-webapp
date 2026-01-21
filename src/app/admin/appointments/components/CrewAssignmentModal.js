'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDashboard } from '@/contexts/DashboardContext';
import apiClient from '@/lib/api/apiClient';

const CrewAssignmentModal = ({ appointment, onClose, onUpdate }) => {
  const { userData, fetchAppointments } = useDashboard();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const [crewAssignment, setCrewAssignment] = useState({
    leadProfessional: '',
    assignedTo: []
  });

  const appointmentId = appointment?._id || appointment?.id;



  useEffect(() => {
    if (!appointment) return;

    // Initialize crew assignment
    setCrewAssignment({
      leadProfessional: appointment.crew?.leadProfessional?._id || appointment.crew?.leadProfessional || '',
      assignedTo: appointment.crew?.assignedTo?.map(member => 
        typeof member === 'object' ? member._id : member
      ) || []
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all staff members
        // const staffResponse = await apiClient.get('/users/staff');
        // setProfessionals(staffResponse.data.data);
        const staffResponse = await apiClient.get('/users/staff');
const list = staffResponse.data.data || [];
const allowedRoles = ['staff', 'professional', 'technician', 'crew']; // adjust if your role names differ
const filtered = list.filter(u => allowedRoles.includes((u.role || '').toLowerCase()));
setProfessionals(filtered);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.error || 'Failed to fetch professionals');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointment, userData?.token]);

  const updateCrewAssignment = async (updatedCrew) => {
    try {
      setSubmitting(true);
      setConflictError(null);

      const response = await apiClient.put(
        `/appointments/${appointmentId}/crew`,
        updatedCrew
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update crew');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating crew:', error);
      if (error.response?.status === 400) {
        setConflictError(error.response.data.error || 'Scheduling conflict detected');
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!appointmentId) {
      toast.error('No appointment selected');
      return;
    }

    try {
      // Prepare the updated crew data
      const updatedCrew = {
        leadProfessional: crewAssignment.leadProfessional,
        assignedTo: crewAssignment.assignedTo.filter(id => id !== crewAssignment.leadProfessional)
      };

      // Call the API to update the crew
      const updatedAppointment = await updateCrewAssignment(updatedCrew);

      toast.success('Crew assignment updated successfully');
      
      // Update the local state with the new crew assignment
      const newAppointment = {
        ...appointment,
        crew: {
          leadProfessional: updatedAppointment.crew.leadProfessional,
          assignedTo: updatedAppointment.crew.assignedTo
        }
      };

      onUpdate(newAppointment);
      
      // Refresh the appointments list
      if (fetchAppointments) {
        await fetchAppointments();
      }
      
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         'Failed to update crew assignment';
      toast.error(errorMessage);
    }
  };

  const handleTeamMemberToggle = (professionalId) => {
    // Don't allow adding the lead professional as a team member
    if (professionalId === crewAssignment.leadProfessional) {
      setConflictError('This professional is already assigned as the lead');
      return;
    }
    
    setCrewAssignment(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(professionalId)
        ? prev.assignedTo.filter(id => id !== professionalId)
        : [...prev.assignedTo, professionalId]
    }));
    setConflictError(null);
  };

  const handleLeadProfessionalChange = (e) => {
    const newLeadId = e.target.value;
    setCrewAssignment(prev => ({
      leadProfessional: newLeadId,
      assignedTo: prev.assignedTo.filter(id => id !== newLeadId)
    }));
    setConflictError(null);
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {/* {appointment.crew?.leadProfessional ? 'Update Crew' : 'Assign Crew'} */}
          {((appointment.crew?.assignedTo?.length || 0) > 0 || (crewAssignment.assignedTo?.length || 0) > 0)
  ? 'View/Update Crew'
  : 'Assign Crew'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
            disabled={submitting}
          >
            &times;
          </button>
        </div>

        {conflictError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {conflictError}
          </div>
        )}

        {loading ? (
          <p>Loading professionals...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Professional *
              </label>
              <select
                value={crewAssignment.leadProfessional}
                onChange={handleLeadProfessionalChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                required
                disabled={submitting}
              >
                <option value="">Select Lead Professional</option>
                {professionals.map(professional => (
                  <option 
                    key={professional._id} 
                    value={professional._id}
                  >
                    {professional.name} - {professional.role || 'Staff'}
                  </option>
                ))}
              </select>
            </div> */}


            {(crewAssignment.assignedTo?.length || 0) > 0 && (
  <div className="rounded border p-2 bg-green-50">
    <div className="text-sm font-medium text-green-800">Assigned Members</div>
    <div className="mt-1 flex flex-wrap gap-2">
      {professionals
        .filter(p => crewAssignment.assignedTo.includes(p._id))
        .map(p => (
          <span
            key={p._id}
            className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded"
          >
            {p.name}
          </span>
        ))}
    </div>
  </div>
)}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Members
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
                {professionals.length === 0 ? (
                  <p className="text-sm text-gray-500">No professionals available</p>
                ) : (
                  professionals.map(professional => (
                    <div key={professional._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`member-${professional._id}`}
                        checked={crewAssignment.assignedTo.includes(professional._id)}
                        onChange={() => handleTeamMemberToggle(professional._id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        disabled={
                          submitting || 
                          professional._id === crewAssignment.leadProfessional
                        }
                      />
                      {/* <label 
                        htmlFor={`member-${professional._id}`} 
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {professional.name} ({professional.role || 'Staff'})
                        {professional._id === crewAssignment.leadProfessional && ' (lead)'}
                      </label> */}

                      <label htmlFor={`member-${professional._id}`} className="ml-2 block text-sm text-gray-700">
  {professional.name} ({professional.role || 'Staff'})
  {professional._id === crewAssignment.leadProfessional && ' (lead)'}
  {crewAssignment.assignedTo.includes(professional._id) && (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 rounded">
      Assigned
    </span>
  )}
</label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                // disabled={!crewAssignment.leadProfessional || submitting || !appointmentId}

                disabled={
  submitting ||
  !appointmentId ||
  (crewAssignment.assignedTo?.length || 0) === 0
}
              >
                {submitting ? 'Saving...' : 'Save Assignment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CrewAssignmentModal;