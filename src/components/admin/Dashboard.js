'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from '../../lib/store';
import Card from '../ui/Card';
import Button from '../ui/Button';
import apiClient from '../../lib/api/apiClient';
import { useDashboard } from '../../contexts/DashboardContext';


// Helper functions - moved to top level so both components can use them
const formatAddress = (address) => {
  if (!address) return 'No address';
  
  // If address is already a string, return it
  if (typeof address === 'string') return address;
  
  // If address is an object, format it
  if (typeof address === 'object') {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ') || 'Address not specified';
  }
  
  return 'Invalid address format';
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in progress':
      return 'bg-orange-100 text-orange-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'rescheduled':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const ActivityLog = ({ activities }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconBackground}`}>
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d={activity.icon} clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {activity.content}{' '}
                      <span className="font-medium text-gray-900">{activity.target}</span>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={activity.datetime}>{activity.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CalendarOverview = ({ appointments }) => {
  // Process appointments to include full datetime
  const processedAppointments = appointments.map(appointment => {
    if (!appointment?.date || !appointment?.timeSlot?.startTime) {
      console.warn("Invalid appointment data:", appointment);
      return null;
    }

    try {
      // Create date object from appointment date string
      const appointmentDate = new Date(appointment.date);
      
      // Parse time string (handle both "HH:MM" and "HH:MM:SS" formats)
      const timeString = appointment.timeSlot.startTime;
      const timeParts = timeString.match(/(\d+):(\d+)(?::\d+)?/);
      if (!timeParts) {
        console.warn("Could not parse time:", timeString);
        return null;
      }

      const hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);

      // Set hours and minutes on the date object
      appointmentDate.setHours(hours, minutes, 0, 0);

      return {
        ...appointment,
        fullDateTime: appointmentDate
      };
    } catch (error) {
      console.error("Error processing appointment:", appointment, error);
      return null;
    }
  }).filter(Boolean); // Remove any null entries from invalid appointments

  

  // Filter and sort appointments - REMOVED status filter to show all upcoming appointments
  const now = new Date();
  const upcomingAppointments = processedAppointments
    .filter(a => a.fullDateTime > now) // Only filter by date, not status
    .sort((a, b) => a.fullDateTime - b.fullDateTime)
    .slice(0, 10); // Increased limit to 10 to show more appointments

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-green-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
          <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {upcomingAppointments.length} upcoming
          </span>
        </div>
      </div>
      
      {upcomingAppointments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Appointments</h4>
          <p className="text-gray-500 mb-4">You're all caught up! No appointments scheduled for the future.</p>
          <Link href="/admin/appointments/new">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Schedule New Appointment
            </button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment._id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link href={`/admin/appointments/${appointment._id}`} className="block">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  {/* Left Section - Customer and Service Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {appointment.customer?.user?.name || appointment.customerName || 'Unknown Customer'}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {formatStatus(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{appointment.service?.name || appointment.serviceName || 'Unknown Service'}</span>
                      </div>
                      
                      {/* <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">
                          {formatAddress(appointment.customer?.address || appointment.address)}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  {/* Right Section - Date, Time and Payment */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.fullDateTime.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                      </p>
                    </div>
                    
                    {/* Payment Status */}
                    {appointment.payment && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.payment.status?.toLowerCase() === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        {appointment.payment.status || 'Pending'} • ${appointment.payment.amount || '0.00'}
                      </div>
                    )}
                    
                    {/* Crew Assignment */}
                    {appointment.crew && (
                      <div className="text-xs text-gray-500">
                        {appointment.crew.assignedTo?.length > 0 
                          ? `${appointment.crew.assignedTo.length} crew assigned`
                          : 'No crew assigned'
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Preview */}
                {appointment.notes?.internal && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-700 line-clamp-2">
                      <span className="font-medium">Notes:</span> {appointment.notes.internal}
                    </p>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* View All Link */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {upcomingAppointments.length} upcoming appointments
          </span>
          <Link href="/admin/appointments" className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center gap-1">
            View all appointments
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Previous Appointments Component
const PreviousAppointments = ({ appointments }) => {
  // Process appointments to include full datetime
  const processedAppointments = appointments.map(appointment => {
    if (!appointment?.date || !appointment?.timeSlot?.startTime) {
      console.warn("Invalid appointment data:", appointment);
      return null;
    }

    try {
      // Create date object from appointment date string
      const appointmentDate = new Date(appointment.date);
      
      // Parse time string (handle both "HH:MM" and "HH:MM:SS" formats)
      const timeString = appointment.timeSlot.startTime;
      const timeParts = timeString.match(/(\d+):(\d+)(?::\d+)?/);
      if (!timeParts) {
        console.warn("Could not parse time:", timeString);
        return null;
      }

      const hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);

      // Set hours and minutes on the date object
      appointmentDate.setHours(hours, minutes, 0, 0);

      return {
        ...appointment,
        fullDateTime: appointmentDate
      };
    } catch (error) {
      console.error("Error processing appointment:", appointment, error);
      return null;
    }
  }).filter(Boolean);

  // Filter and sort previous appointments (past appointments)
  const now = new Date();
  const previousAppointments = processedAppointments
    .filter(a => a.fullDateTime <= now) // Past appointments
    .sort((a, b) => b.fullDateTime - a.fullDateTime) // Most recent first
    .slice(0, 10); // Limit to 10 most recent

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Previous Appointments</h3>
          <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {previousAppointments.length} previous
          </span>
        </div>
      </div>
      
      {previousAppointments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Previous Appointments</h4>
          <p className="text-gray-500 mb-4">No appointments have been completed or occurred in the past.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {previousAppointments.map((appointment) => (
            <div key={appointment._id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link href={`/admin/appointments/${appointment._id}`} className="block">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  {/* Left Section - Customer and Service Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {appointment.customer?.user?.name || appointment.customerName || 'Unknown Customer'}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {formatStatus(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{appointment.service?.name || appointment.serviceName || 'Unknown Service'}</span>
                      </div>
                      
                      {/* <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">
                          {formatAddress(appointment.customer?.address || appointment.address)}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  {/* Right Section - Date, Time and Payment */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.fullDateTime.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                      </p>
                    </div>
                    
                    {/* Payment Status */}
                    {appointment.payment && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.payment.status?.toLowerCase() === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        {appointment.payment.status || 'Pending'} • ${appointment.payment.amount || '0.00'}
                      </div>
                    )}
                    
                    {/* Completion Badge for Completed Appointments */}
                    {appointment.status?.toLowerCase() === 'completed' && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Preview */}
                {appointment.notes?.internal && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-700 line-clamp-2">
                      <span className="font-medium">Notes:</span> {appointment.notes.internal}
                    </p>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* View All Link */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {previousAppointments.length} previous appointments
          </span>
          <Link href="/admin/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1">
            View all appointments
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
const StatusPieChart = ({ data }) => {
  const colors = {
    'Scheduled': '#10B981',
    'Rescheduled': '#F59E0B',
    'Completed': '#3B82F6',
    'Cancelled': '#EF4444',
    'No-Show': '#8B5CF6'
  };

  // Calculate total count for percentage calculations
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Appointments by Status</h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-4 md:mb-0 md:mr-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {data.reduce((acc, item, index) => {
              const prevPercent = acc.prevPercent;
              const percent = (item.count / total) * 100;
              const dashArray = `${percent} ${100 - percent}`;
              const dashOffset = -prevPercent;
              
              acc.elements.push(
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={colors[item._id] || '#999'}
                  strokeWidth="10"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 50 50)"
                />
              );
              
              acc.prevPercent += percent;
              return acc;
            }, { elements: [], prevPercent: 0 }).elements}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item._id} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: colors[item._id] || '#999' }}
              ></div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">{item._id}:</span> {item.count} (
                {total > 0 ? Math.round((item.count / total) * 100) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DayOfWeekChart = ({ data }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const maxCount = Math.max(...data.map(item => item.count), 1);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Appointments by Day of Week</h3>
      <div className="flex flex-col space-y-3">
        {days.map((day, index) => {
          const dayData = data.find(item => item._id === index + 1) || { count: 0 };
          return (
            <div key={day} className="flex items-center">
              <div className="w-20 sm:w-24 text-sm text-gray-500">{day}</div>
              <div className="flex-1 flex items-center">
                <div 
                  className="h-6 bg-green-500 rounded mr-2" 
                  style={{ width: `${(dayData.count / maxCount) * 100}%` }}
                ></div>
                <div className="text-sm font-medium">{dayData.count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthlyTrendChart = ({ data }) => {
  // Month labels
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get current year
  const currentYear = new Date().getFullYear();

  // Initialize all months with count 0
  const monthlyData = months.map((month, index) => ({
    month,
    count: 0,
    monthNumber: index + 1 // 1-12
  }));

  // Process backend data
  if (data && data.length > 0) {
    data.forEach(item => {
      // Only process data for current year
      if (item._id.year === currentYear) {
        const monthIndex = item._id.month - 1; // Convert to 0-based index
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].count = item.count;
        }
      }
    });
  }

  // Calculate max count for scaling
  const maxCount = Math.max(...monthlyData.map(item => item.count), 0);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Monthly Appointment Trends ({currentYear})
      </h3>
      <div className="flex items-end space-x-1 h-40 sm:h-48">
        {monthlyData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
              style={{ 
                height: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%',
                minHeight: item.count > 0 ? '2px' : '0'
              }}
              title={`${item.month}: ${item.count} appointment${item.count !== 1 ? 's' : ''}`}
              aria-label={`${item.count} appointments in ${item.month}`}
              role="presentation"
            ></div>
            <div className="text-xs text-gray-500 mt-1">{item.month}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Total: {monthlyData.reduce((sum, month) => sum + month.count, 0)}</span>
        {maxCount > 0 && <span>Max: {maxCount} in {months[monthlyData.findIndex(m => m.count === maxCount)]}</span>}
      </div>
    </div>
  );
};

const RevenueWidget = () => {
  const { userData } = useDashboard();
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const endpoint = userData?.role === 'customer' ? '/payments/my-payments' : '/payments';
        const response = await apiClient.get(endpoint);
        const payments = response.data.data || [];
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const totalRevenue = payments
          .filter(p => p.status === 'Completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        
        const monthlyRevenue = payments
          .filter(p => {
            const paymentDate = new Date(p.createdAt);
            return p.status === 'Completed' && 
                   paymentDate.getMonth() === currentMonth && 
                   paymentDate.getFullYear() === currentYear;
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        
        const pendingPayments = payments
          .filter(p => p.status === 'Pending')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        
        const recentPayments = payments
          .filter(p => p.status === 'Completed')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setRevenueData({
          totalRevenue,
          monthlyRevenue,
          pendingPayments,
          recentPayments
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.token) {
      fetchRevenueData();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Revenue Management</h3>
        <Link href="/admin/payments" className="text-white/80 hover:text-white text-sm">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${revenueData.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm">This Month</p>
              <p className="text-2xl font-bold">${revenueData.monthlyRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm">Pending</p>
              <p className="text-2xl font-bold">${revenueData.pendingPayments.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {revenueData.recentPayments.length > 0 && (
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <h4 className="font-semibold mb-3">Recent Payments</h4>
          <div className="space-y-2">
            {revenueData.recentPayments.map((payment, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-white/90">
                  {payment.paymentType} - {new Date(payment.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold">${payment.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { appointments, estimates, services } = useStore();
  const [timeRange, setTimeRange] = useState('month'); // Default to month
  const { userData } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // State for fetched data
  const [appointmentData, setAppointmentData] = useState([]);
  const [estimateData, setEstimateData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingEstimates: 0,
    totalServices: 0,
    completedAppointments: 0
  });
  const [appointmentStats, setAppointmentStats] = useState({
    byStatus: [],
    byDayOfWeek: [],
    byMonth: [],
    completionRate: 0
  });

  useEffect(() => {
    const fetchAppointmentStats = async () => {
      try {
        const response = await apiClient.get('/dashboard/appointments');
        
        setAppointmentStats({
          byStatus: response.data.data.appointmentsByStatus || [],
          byDayOfWeek: response.data.data.appointmentsByDayOfWeek || [],
          byMonth: response.data.data.appointmentsByMonth || [],
          completionRate: response.data.data.completionRate || 0
        });
      } catch (error) {
        console.error('Error fetching appointment stats:', error);
        setAppointmentStats({
          byStatus: [],
          byDayOfWeek: [],
          byMonth: [],
          completionRate: 0
        });
      }
    };

    fetchAppointmentStats();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentsRes = await apiClient.get('/appointments?limit=1000');
        setAppointmentData(appointmentsRes.data.data || []);
        
        // Fetch estimates
        const estimatesRes = await apiClient.get('/estimates');
        setEstimateData(estimatesRes.data.data || []);
        
        // Fetch services
        const servicesRes = await apiClient.get('/services');
        setServiceData(servicesRes.data.data || []);

        // Calculate stats
        setStats({
          totalAppointments: appointmentsRes.data.data?.length || 0,
          pendingEstimates: estimatesRes.data.data?.filter(e => e.status === 'pending')?.length || 0,
          totalServices: servicesRes.data.data?.length || 0,
          completedAppointments: appointmentsRes.data.data?.filter(a => a.status === 'Completed')?.length || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentActivities = [
    {
      id: 1,
      content: 'Created a new estimate for',
      target: 'Robert Davis',
      date: 'Just now',
      datetime: '2023-05-18T19:00',
      icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
      iconBackground: 'bg-green-500',
    },
    {
      id: 2,
      content: 'Completed appointment with',
      target: 'James Wilson',
      date: '1 hour ago',
      datetime: '2023-05-18T18:00',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      iconBackground: 'bg-blue-500',
    },
    {
      id: 3,
      content: 'Added a new service',
      target: 'Seasonal Cleanup',
      date: '2 hours ago',
      datetime: '2023-05-18T16:00',
      icon: 'M6 5V4c0-1.1.9-2 2-2h8a2 2 0 012 2v1h2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7c0-1.1.9-2 2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      iconBackground: 'bg-purple-500',
    },
  ];
  
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {userData?.name}! Here's what's happening with your business.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            {userData?.role === 'admin' && (
              <Link href="/admin/services/new" passHref>
                <Button variant="primary" size="lg">Add New Service</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/admin/appointments">
              <div className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                <div className="flex justify-center items-center h-12 w-12 mx-auto bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="block mt-3 text-sm font-medium text-gray-800">Appointments</span>
              </div>
            </Link>
            <Link href="/admin/customers">
              <div className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                <div className="flex justify-center items-center h-12 w-12 mx-auto bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="block mt-3 text-sm font-medium text-gray-800">Customers</span>
              </div>
            </Link>
            <Link href="/admin/services">
              <div className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                <div className="flex justify-center items-center h-12 w-12 mx-auto bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="block mt-3 text-sm font-medium text-gray-800">Services</span>
              </div>
            </Link>
            <Link href="/admin/staff">
              <div className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                <div className="flex justify-center items-center h-12 w-12 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="block mt-3 text-sm font-medium text-gray-800">Manage Staff</span>
              </div>
            </Link>
            <Link href="/admin/settings">
              <div className="group p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                <div className="flex justify-center items-center h-12 w-12 mx-auto bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="block mt-3 text-sm font-medium text-gray-800">Settings</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Time range selector */}
        <div className="mb-6 bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Overview</h2>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
              timeRange === 'week'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
              timeRange === 'month'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 text-sm rounded-md flex-1 sm:flex-none ${
              timeRange === 'year'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Year
          </button>
        </div>
      </div>

        {/* Revenue Management Widget */}
        <div className="mb-8">
          <RevenueWidget />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="transform hover:scale-105 transition-transform duration-300">
                <Card.Content className="flex flex-col items-center p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <svg className="w-10 h-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-lg font-medium text-gray-700">Total Appointments</h2>
                    <p className="mt-2 text-5xl font-bold text-green-600">{stats.totalAppointments}</p>
                    <p className="mt-1 text-sm text-gray-500">From all time</p>
                </Card.Content>
            </Card>
            
            <Card className="transform hover:scale-105 transition-transform duration-300">
                <Card.Content className="flex flex-col items-center p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
                        <svg className="w-10 h-10 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-lg font-medium text-gray-700">Pending Estimates</h2>
                    <p className="mt-2 text-5xl font-bold text-yellow-600">{stats.pendingEstimates}</p>
                    <p className="mt-1 text-sm text-gray-500">Needs attention</p>
                </Card.Content>
            </Card>
            
            <Card className="transform hover:scale-105 transition-transform duration-300">
                <Card.Content className="flex flex-col items-center p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                        <svg className="w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-lg font-medium text-gray-700">Services Offered</h2>
                    <p className="mt-2 text-5xl font-bold text-blue-600">{stats.totalServices}</p>
                    <p className="mt-1 text-sm text-gray-500">Active services</p>
                </Card.Content>
            </Card>
            
            <Card className="transform hover:scale-105 transition-transform duration-300">
                <Card.Content className="flex flex-col items-center p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <svg className="w-10 h-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-lg font-medium text-gray-700">Completion Rate</h2>
                    <p className="mt-2 text-5xl font-bold text-green-600">
                      {appointmentStats.completionRate}%
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Appointments completed</p>
                </Card.Content>
            </Card>
        </div>

        {/* Recent Activity */}
        {/* <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <ActivityLog activities={recentActivities} />
              <div className="mt-6 text-right">
                <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                  View all activity &rarr;
                </Link>
              </div>
            </div>
        </div> */}

        {/* Data Charts */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {appointmentStats.byStatus.length > 0 && (
            <StatusPieChart data={appointmentStats.byStatus} />
          )}
          {appointmentStats.byDayOfWeek.length > 0 && (
            <DayOfWeekChart data={appointmentStats.byDayOfWeek} />
          )}
         {appointmentStats.byMonth && appointmentStats.byMonth.length > 0 && (
            <MonthlyTrendChart data={appointmentStats.byMonth} />
          )}
        </div> */}

        {/* Upcoming Appointments */}
        {/* Appointments Section - Both Upcoming and Previous */}
{/* Appointments Section - Previous then Upcoming */}
<div className="space-y-6 mb-8">
  {/* Previous Appointments */}
  <PreviousAppointments appointments={appointmentData} />
  
  {/* Upcoming Appointments */}
  <CalendarOverview appointments={appointmentData} />
</div>
      </main>
    </div>
  );
};

export default Dashboard;