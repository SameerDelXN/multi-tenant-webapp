// "use client";

// import React, { useState, useEffect } from "react";
// import Button from "../ui/Button";
// import Card from "../ui/Card";
// import useStore from "../../lib/store";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useDashboard } from "../../contexts/DashboardContext";
// import { useTenant } from "../../contexts/TenantContext";

// const BookingReview = ({ onBack }) => {
//   const router = useRouter();
//   const { userData } = useDashboard();
//   const { tenant } = useTenant();
//   const { currentBooking, resetCurrentBooking, updateCurrentBooking } = useStore();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   if (!userData) {
//     return null;
//   }

//   // Fetch service details if missing
//   useEffect(() => {
//     const fetchServiceDetails = async () => {
//       if (!currentBooking.selectedService && currentBooking.serviceId) {
//         try {
//           const response = await axios.get(`${API_URL}/services/${currentBooking.serviceId}`);
//           if (response.data && (response.data.data || response.data)) {
//             // Some APIs return { data: {...} }, some just {...}
//             const service = response.data.data || response.data;
//             updateCurrentBooking({ selectedService: service });
//           }
//         } catch (err) {
//           setError("Failed to fetch service details");
//         }
//       }
//     };
//     fetchServiceDetails();
//     // Only run when selectedService or serviceId changes
//   }, [currentBooking.selectedService, currentBooking.serviceId, API_URL, updateCurrentBooking]);

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // Update customer details
//       await axios.put(
//         `${API_URL}/customers/me`,
//         {
//           address: currentBooking.address,
//           propertyDetails: currentBooking.propertyDetails,
//           notificationPreferences: currentBooking.notificationPreferences,
//         },
//         {
//           headers: { Authorization: `Bearer ${userData.token}` },
//         }
//       );

//       // Create appointment with tenant context
//       const appointmentData = {
//         service: currentBooking.serviceId,
//         date: currentBooking.appointmentDate,
//         timeSlot: {
//           startTime: currentBooking.startTime,
//           endTime: currentBooking.endTime,
//         },
//         notes: currentBooking.notes,
//         frequency: currentBooking.frequency,
//         // Tenant ID will be automatically set from the service on backend
//       };

//       const response = await axios.post(
//         `${API_URL}/appointments`,
//         appointmentData,
//         {
//           headers: { 
//             Authorization: `Bearer ${userData.token}`,
//             // Include tenant subdomain if in tenant context
//             ...(tenant?.subdomain && { 'X-Tenant-Subdomain': tenant.subdomain })
//           },
//         }
//       );

//       if (response.status === 201) {
//         router.push(`/booking/confirmation`);
//         resetCurrentBooking();
//       }
//     } catch (error) {
//       setError(error.response?.data?.error || "Failed to create appointment");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <div className="py-8 bg-emerald-50 min-h-screen px-4 md:px-8 rounded-lg shadow-sm">
//       <h2 className="text-3xl font-bold text-emerald-800 mb-6">Review Your Booking</h2>

//       <Card className="mb-10 bg-white border border-emerald-100 shadow-md">
//         <Card.Header className="bg-emerald-100 px-6 py-4 rounded-t-lg">
//           <h3 className="text-xl font-semibold text-emerald-900">Booking Summary</h3>
//         </Card.Header>

//         <Card.Content className="px-6 py-5">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Service Details */}
//             <div>
//               <h4 className="text-emerald-700 font-medium mb-2">Service Details</h4>
//               <ul className="space-y-2 text-gray-700">
//                 <li><strong>Service:</strong> {currentBooking?.selectedService?.name || "N/A"}</li>
//                 <li><strong>Category:</strong> {currentBooking?.selectedService?.category || "N/A"}</li>
//                 <li><strong>Date:</strong> {new Date(currentBooking?.appointmentDate).toLocaleDateString() || "N/A"}</li>
//                 <li><strong>Time:</strong> {currentBooking?.startTime} - {currentBooking?.endTime}</li>
//                 <li><strong>Frequency:</strong> {currentBooking?.frequency || "One-time"}</li>
//                 <li><strong>Estimated Price:</strong> ${currentBooking?.selectedService?.basePrice || "0.00"}</li>
//                 <li><strong>Duration:</strong> {currentBooking?.selectedService?.duration || "N/A"} minutes</li>
//               </ul>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h4 className="text-emerald-700 font-medium mb-2">Contact Info</h4>
//               <ul className="space-y-2 text-gray-700">
//                 <li><strong>Name:</strong> {userData?.name || "N/A"}</li>
//                 <li><strong>Email:</strong> {userData?.email || "N/A"}</li>
//               </ul>
//             </div>
//           </div>

//           {/* Property and Notification Details */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h4 className="text-emerald-700 font-medium mb-2">Property Details</h4>
//               <ul className="space-y-2 text-gray-700">
//                 <li><strong>Size:</strong> {currentBooking?.propertyDetails?.size || "N/A"} sq ft</li>
//                 <li><strong>Access:</strong> {currentBooking?.propertyDetails?.accessInstructions || "None"}</li>
//                 <li><strong>Front Yard:</strong> {currentBooking?.propertyDetails?.features?.hasFrontYard ? "Yes" : "No"}</li>
//                 <li><strong>Back Yard:</strong> {currentBooking?.propertyDetails?.features?.hasBackYard ? "Yes" : "No"}</li>
//                 <li><strong>Trees:</strong> {currentBooking?.propertyDetails?.features?.hasTrees ? "Yes" : "No"}</li>
//                 <li><strong>Garden:</strong> {currentBooking?.propertyDetails?.features?.hasGarden ? "Yes" : "No"}</li>
//                 <li><strong>Sprinkler:</strong> {currentBooking?.propertyDetails?.features?.hasSprinklerSystem ? "Yes" : "No"}</li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="text-emerald-700 font-medium mb-2">Notifications</h4>
//               <ul className="space-y-2 text-gray-700">
//                 <li><strong>Email:</strong> {currentBooking?.notificationPreferences?.email ? "Yes" : "No"}</li>
//                 <li><strong>SMS:</strong> {currentBooking?.notificationPreferences?.sms ? "Yes" : "No"}</li>
//                 <li><strong>Reminder:</strong> {currentBooking?.notificationPreferences?.reminderDaysBefore} days before</li>
//               </ul>
//             </div>
//           </div>
//         </Card.Content>
//       </Card>

//       <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-5 mb-6">
//         <p className="text-emerald-800">
//           <strong>What happens next?</strong> Our team will review your request and get back to you with a detailed estimate within 24–48 hours.
//         </p>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-300">
//           {error}
//         </div>
//       )}

//       <div className="flex justify-between mt-6">
//         <Button type="button" variant="outline" onClick={onBack}>
//           Back to Details
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={`bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition ${
//             isSubmitting ? "opacity-60 cursor-not-allowed" : ""
//           }`}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Booking"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default BookingReview;





"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import useStore from "../../lib/store";
import { useRouter } from "next/navigation";
import { useDashboard } from "../../contexts/DashboardContext";
import { useTenant } from "../../contexts/TenantContext";
import { getTenantApiClient } from "../../lib/api/apiClient";

const BookingReview = ({ onBack }) => {
  const router = useRouter();
  const { userData } = useDashboard();
  const { tenant } = useTenant();
  const { currentBooking, resetCurrentBooking, updateCurrentBooking } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch service details if missing
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!currentBooking?.selectedService && currentBooking?.serviceId) {
        try {
          setIsLoading(true);
          const apiClient = getTenantApiClient();
          const response = await apiClient.get(`/services/${currentBooking.serviceId}`);
          if (response.data) {
            const service = response.data.data || response.data;
            updateCurrentBooking({ selectedService: service });
          }
        } catch (err) {
          setError("Failed to fetch service details");
          console.error("Service fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [currentBooking, updateCurrentBooking]);

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required data
      if (!currentBooking?.serviceId || !currentBooking?.appointmentDate || 
          !currentBooking?.startTime || !currentBooking?.endTime) {
        throw new Error("Missing required booking information");
      }

      const apiClient = getTenantApiClient();
      
      // Update customer details
      await apiClient.put('/customers/me', {
        address: currentBooking.address || {},
        propertyDetails: currentBooking.propertyDetails || {},
        notificationPreferences: currentBooking.notificationPreferences || {},
      });

      // Create appointment
      const appointmentData = {
        service: currentBooking.serviceId,
        date: currentBooking.appointmentDate,
        timeSlot: {
          startTime: currentBooking.startTime,
          endTime: currentBooking.endTime,
        },
        notes: currentBooking.notes,
        frequency: currentBooking.frequency,
        // Pass address so backend can update customer record from booking
        address: currentBooking.address || {}
      };

      const response = await apiClient.post('/appointments', appointmentData);

      if (response.status === 201) {
        router.push(`/booking/confirmation`);
        resetCurrentBooking();
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError(error.response?.data?.error || error.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-8 bg-emerald-50 min-h-screen px-4 md:px-8 rounded-lg shadow-sm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-800">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!userData) {
    return (
      <div className="py-8 bg-emerald-50 min-h-screen px-4 md:px-8 rounded-lg shadow-sm flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-4">Please log in to view your booking details.</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-emerald-50 min-h-screen px-4 md:px-8 rounded-lg shadow-sm">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6">Review Your Booking</h2>

      <Card className="mb-10 bg-white border border-emerald-100 shadow-md">
        <Card.Header className="bg-emerald-100 px-6 py-4 rounded-t-lg">
          <h3 className="text-xl font-semibold text-emerald-900">Booking Summary</h3>
        </Card.Header>

        <Card.Content className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service Details */}
            <div>
              <h4 className="text-emerald-700 font-medium mb-2">Service Details</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Service:</strong> {currentBooking?.selectedService?.name || "N/A"}</li>
                <li><strong>Category:</strong> {currentBooking?.selectedService?.category || "N/A"}</li>
                <li><strong>Date:</strong> {currentBooking?.appointmentDate ? new Date(currentBooking.appointmentDate).toLocaleDateString() : "N/A"}</li>
                <li><strong>Time:</strong> {currentBooking?.startTime || "N/A"} - {currentBooking?.endTime || "N/A"}</li>
                <li><strong>Frequency:</strong> {currentBooking?.frequency || "One-time"}</li>
                <li><strong>Estimated Price:</strong> ${currentBooking?.selectedService?.basePrice || "0.00"}</li>
                <li><strong>Duration:</strong> {currentBooking?.selectedService?.duration || "N/A"} minutes</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-emerald-700 font-medium mb-2">Contact Info</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Name:</strong> {userData?.name || "N/A"}</li>
                <li><strong>Email:</strong> {userData?.email || "N/A"}</li>
              </ul>
            </div>
          </div>

          {/* Property and Notification Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-emerald-700 font-medium mb-2">Property Details</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Size:</strong> {currentBooking?.propertyDetails?.size || "N/A"} sq ft</li>
                <li><strong>Access:</strong> {currentBooking?.propertyDetails?.accessInstructions || "None"}</li>
                <li><strong>Front Yard:</strong> {currentBooking?.propertyDetails?.features?.hasFrontYard ? "Yes" : "No"}</li>
                <li><strong>Back Yard:</strong> {currentBooking?.propertyDetails?.features?.hasBackYard ? "Yes" : "No"}</li>
                <li><strong>Trees:</strong> {currentBooking?.propertyDetails?.features?.hasTrees ? "Yes" : "No"}</li>
                <li><strong>Garden:</strong> {currentBooking?.propertyDetails?.features?.hasGarden ? "Yes" : "No"}</li>
                <li><strong>Sprinkler:</strong> {currentBooking?.propertyDetails?.features?.hasSprinklerSystem ? "Yes" : "No"}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-emerald-700 font-medium mb-2">Notifications</h4>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Email:</strong> {currentBooking?.notificationPreferences?.email ? "Yes" : "No"}</li>
                <li><strong>SMS:</strong> {currentBooking?.notificationPreferences?.sms ? "Yes" : "No"}</li>
                <li><strong>Reminder:</strong> {currentBooking?.notificationPreferences?.reminderDaysBefore || 1} days before</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-5 mb-6">
        <p className="text-emerald-800">
          <strong>What happens next?</strong> Your appointment will be submitted for admin approval. Once approved, you'll receive a confirmation email. Payment will be collected after the service is completed.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-300">
          {error}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Details
        </Button>
        <Button
          onClick={handleSubmitBooking}
          disabled={isSubmitting || isLoading}
          className={`bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition ${
            isSubmitting || isLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingReview;