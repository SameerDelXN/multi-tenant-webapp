// 'use client';

// import { useState, useEffect } from 'react';
// import { User, MapPin, Mail, Phone, Home, Save, X } from 'lucide-react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation'; // Changed to the correct import
// import { useDashboard } from '@/contexts/DashboardContext';
// import CustomerLayout from "../../../components/customer/CustomerLayout";

// export default function EditProfilePage() {
//   const router = useRouter(); // Now this will work correctly
//   const { userData } = useDashboard();
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: ''
//     },
//     propertyDetails: {
//       size: '',
//       features: {
//         hasFrontYard: false,
//         hasBackYard: false,
//         hasTrees: false,
//         hasGarden: false,
//         hasSprinklerSystem: false
//       },
//       accessInstructions: ''
//     }
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch current profile data
//  // In your fetchProfileData useEffect:
// useEffect(() => {
//   const fetchProfileData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/customers/me`, {
//         headers: {
//           Authorization: `Bearer ${userData.token}`
//         }
//       });

//       const customerData = response.data.data;
      
//       // Ensure features object exists and has all properties
//       const features = customerData.propertyDetails?.features || {};
//       const defaultFeatures = {
//         hasFrontYard: false,
//         hasBackYard: false,
//         hasTrees: false,
//         hasGarden: false,
//         hasSprinklerSystem: false
//       };
        
//         setFormData({
//           // name: customerData.user?.name || '',
//           // email: customerData.user?.email || '',
//           // phone: customerData.phone || '',
//           name: customerData.user?.name || '',
//   email: customerData.user?.email || '',
//   phone: customerData.user?.phone || customerData.phone || '',
//           address: {
//             street: customerData.address?.street || '',
//             city: customerData.address?.city || '',
//             state: customerData.address?.state || '',
//             zipCode: customerData.address?.zipCode || '',
//             country: customerData.address?.country || ''
//           },
//          propertyDetails: {
//           size: customerData.propertyDetails?.size || '',
//           accessInstructions: customerData.propertyDetails?.accessInstructions || '',
//           features: {
//             ...defaultFeatures,
//             ...features
//           }
//         }
//         });
//         setLoading(false);
//     } catch (err) {
//       console.error('Error fetching profile data:', err);
//       setError(err.response?.data?.message || 'Failed to load profile data');
//       setLoading(false);
//     }
//   };

//   if (userData?.token) {
//     fetchProfileData();
//   }
// }, [userData?.token]);

//  const handleChange = (e) => {
//   const { name, value, type, checked } = e.target;
  
//   // Handle nested objects like address.street
//   if (name.includes('.')) {
//     const path = name.split('.');
//     setFormData((prev) => {
//   const newState = { ...prev };
//   const path = name.split('.');
//   let current = newState;

//   for (let i = 0; i < path.length - 1; i++) {
//     if (typeof current[path[i]] !== 'object' || current[path[i]] === null) {
//       current[path[i]] = {};
//     }
//     current = current[path[i]];
//   }

//   current[path[path.length - 1]] = type === 'checkbox' ? checked : value;

//   return newState;
// });

//   } else {
//     // Handle top-level fields
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
      
//       const response = await axios.put(
//         `${API_URL}/customers/me`,
//         {
//           // User data
//           user: {
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone
//           },
//           // Customer data
//           phone: formData.phone,
//           address: formData.address,
//           propertyDetails: formData.propertyDetails
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${userData.token}`
//           }
//         }
//       );

//       // Redirect back to profile page after successful update
//       router.push('/customers');
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setError(err.response?.data?.message || 'Failed to update profile');
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-green-50 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-green-50 flex justify-center items-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <CustomerLayout>
//     <div className="min-h-screen bg-green-50 py-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
//         <div className="bg-green-600 text-white p-6">
//           <h1 className="text-2xl font-bold flex items-center">
//             <User className="mr-2" size={24} />
//             Edit Profile
//           </h1>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Personal Information Section */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
//               Personal Information
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="text-gray-400" size={18} />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="pl-10 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                     required
//                   />
//                 </div>
//               </div>

//              <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Email
//   </label>
//   <div className="relative">
//     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//       <Mail className="text-gray-400" size={18} />
//     </div>
//     <input
//       type="email"
//       name="email"
//       value={formData.email}
//       readOnly  // 👈 This prevents editing
//       className="pl-10 w-full p-2 border rounded bg-gray-100 cursor-not-allowed" // Gray background to indicate disabled state
//     />
//   </div>
// </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Phone className="text-gray-400" size={18} />
//                   </div>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="pl-10 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Address Section */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
//               Personal Address
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Street
//                 </label>
//                 <input
//                   type="text"
//                   name="address.street"
//                   value={formData.address?.street}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="address.city"
//                   value={formData.address.city}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   name="address.state"
//                   value={formData.address.state}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ZIP Code
//                 </label>
//                 <input
//                   type="text"
//                   name="address.zipCode"
//                   value={formData.address.zipCode}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   name="address.country"
//                   value={formData.address.country}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Property Details Section */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
//               Property Details
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Property Size (sq ft)
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Home className="text-gray-400" size={18} />
//                   </div>
//                   <input
//                     type="text"
//                     name="propertyDetails.size"
//                     value={formData.propertyDetails.size}
//                     onChange={handleChange}
//                     className="pl-10 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Access Instructions
//                 </label>
//                 <textarea
//                   name="propertyDetails.accessInstructions"
//                   value={formData.propertyDetails.accessInstructions}
//                   onChange={handleChange}
//                   rows={3}
//                   className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>
//             </div>

//            {/* Property Features Section */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-2">
//     Property Features
//   </label>
//   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//     {Object.entries({
//       hasFrontYard: 'Front Yard',
//       hasBackYard: 'Back Yard',
//       hasTrees: 'Trees',
//       hasGarden: 'Garden',
//       hasSprinklerSystem: 'Sprinkler System'
//     }).map(([key, label]) => (
//       <label key={key} className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           name={`propertyDetails.features.${key}`}
//           checked={formData.propertyDetails.features[key] || false}
//           onChange={handleChange}
//           className="rounded text-green-600"
//         />
//         <span className="text-gray-700">{label}</span>
//       </label>
//     ))}
//   </div>
// </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end space-x-4 pt-6">
//             <button
//               type="button"
//               onClick={() => router.push('/profile')}
//               className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <X className="mr-2" size={18} />
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               <Save className="mr-2" size={18} />
//               {loading ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//     </CustomerLayout>
//   );
// }





'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, Home, Save, X } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/contexts/DashboardContext';
import CustomerLayout from "../../../components/customer/CustomerLayout";

export default function EditProfilePage() {
  const router = useRouter();
  const { userData } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers/me`, {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        });

        const customerData = response.data.data;
        
        setFormData({
          name: customerData.user?.name || '',
          email: customerData.user?.email || '',
          phone: customerData.user?.phone || customerData.phone || '',
          address: {
            street: customerData.address?.street || '',
            city: customerData.address?.city || '',
            state: customerData.address?.state || '',
            zipCode: customerData.address?.zipCode || '',
            country: customerData.address?.country || ''
          }
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
        setLoading(false);
      }
    };

    if (userData?.token) {
      fetchProfileData();
    }
  }, [userData?.token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError(null); // Clear error when user types
    
    // Handle nested objects like address.street
    if (name.includes('.')) {
      const path = name.split('.');
      setFormData((prev) => {
        const newState = { ...prev };
        let current = newState;

        for (let i = 0; i < path.length - 1; i++) {
          if (typeof current[path[i]] !== 'object' || current[path[i]] === null) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }

        current[path[path.length - 1]] = type === 'checkbox' ? checked : value;

        return newState;
      });
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Validation
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    const { street, city, state, zipCode, country } = formData.address;

    // Street Validation: Min 5 chars, digits/letters/spaces only
    const streetRegex = /^[a-zA-Z0-9\s-]+$/; // Added hyphen support just in case
    if (!street || street.trim().length < 5) {
      setError('Street address must be at least 5 characters');
      return;
    }
    if (!streetRegex.test(street)) {
      setError('Street address can only contain letters, numbers, and spaces');
      return;
    }

    // City Validation: Min 2 chars, letters only
    const textOnlyRegex = /^[a-zA-Z\s]+$/;
    if (!city || city.trim().length < 5) {
      setError('City must be at least 5 characters');
      return;
    }
    if (!textOnlyRegex.test(city)) {
      setError('City can only contain letters');
      return;
    }

    // State Validation: Min 2 chars, letters only
    if (!state || state.trim().length < 5) {
      setError('State must be at least 5 characters');
      return;
    }
    if (!textOnlyRegex.test(state)) {
      setError('State can only contain letters');
      return;
    }

    // ZIP Code Validation: Exact 6 digits
    const zipRegex = /^\d{6}$/;
    if (!zipCode || !zipRegex.test(zipCode)) {
      setError('ZIP Code must be exactly 6 digits');
      return;
    }

    // Country Validation: Min 2 chars, letters only
    if (!country || country.trim().length < 5) {
      setError('Country must be at least 5 characters');
      return;
    }
    if (!textOnlyRegex.test(country)) {
      setError('Country can only contain letters');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_URL}/customers/me`,
        {
          // User data
          user: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          // Customer data
          phone: formData.phone,
          address: formData.address
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`
          }
        }
      );

      // Redirect back to profile page after successful update
      router.push('/customers');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-green-50 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2" size={24} />
              Edit Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="pl-10 w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 1234567890"
                      className="pl-10 w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be exactly 10 digits</p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
                Personal Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address?.street}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/customers')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <X className="mr-2" size={18} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Save className="mr-2" size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomerLayout>
  );
}