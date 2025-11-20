// 'use client';

// import React, { useEffect, useState } from 'react';
// import Button from '../ui/Button';
// import useStore from '../../lib/store';
// import { useDashboard } from '../../contexts/DashboardContext';
// import axios from 'axios';

// const CustomerDetails = ({ onNext, onBack }) => {
//   const { currentBooking, updateCurrentBooking } = useStore();
//   const { userData, isLoading } = useDashboard();
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [formData, setFormData] = useState({
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: 'USA'
//     },
//     propertyDetails: [{
//       name: 'Property 1',
//       propertyAddress: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: 'USA'
//       },
//       size: '',
//       images: [],
//       features: {
//         hasFrontYard: true,
//         hasBackYard: true,
//         hasTrees: false,
//         hasGarden: false,
//         hasSprinklerSystem: false
//       },
//       accessInstructions: ''
//     }],
//     notificationPreferences: {
//       email: true,
//       sms: false
//     },
//     notes: ''
//   });

//   const [customerData, setCustomerData] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [activePropertyIndex, setActivePropertyIndex] = useState(0);

//   useEffect(() => {
//     if (isLoading || !userData?.token) return;

//     const fetchCustomerDetails = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/customers/me`, {
//           headers: { Authorization: `Bearer ${userData.token}` }
//         });
//         const customer = response.data.data;
//         setCustomerData(customer);
        
//         // Use propertyDetails directly from the API response
//         const propertyDetails = customer.propertyDetails || [{
//           name: 'Property 1',
//           propertyAddress: {
//             street: '',
//             city: '',
//             state: '',
//             zipCode: '',
//             country: 'USA'
//           },
//           size: '',
//           images: [],
//           features: {
//             hasFrontYard: true,
//             hasBackYard: true,
//             hasTrees: false,
//             hasGarden: false,
//             hasSprinklerSystem: false
//           },
//           accessInstructions: ''
//         }];

//         setFormData({
//           address: customer.address || {
//             street: '',
//             city: '',
//             state: '',
//             zipCode: '',
//             country: 'USA'
//           },
//           propertyDetails,
//           notificationPreferences: customer.notificationPreferences || {
//             email: true,
//             sms: false
//           },
//           notes: currentBooking.notes || ''
//         });
//       } catch (error) {
//         console.error('Failed to fetch customer details:', error);
//       }
//     };

//     fetchCustomerDetails();
//   }, [userData, isLoading]);

//   const handlePropertyImageUpload = async (e) => {
//   const files = Array.from(e.target.files);
//   if (!files.length) return;

//   const uploadFormData = new FormData();
//   files.forEach(file => uploadFormData.append('images', file)); // Keep 'images' as field name

//   try {
//     setIsUploading(true);
//     setUploadProgress(0);
    
//     const response = await axios.post(
//       `${API_URL}/customers/${customerData._id}/propertyDetails/${activePropertyIndex}/images`,
//       uploadFormData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${userData.token}`
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(percentCompleted);
//         }
//       }
//     );

//     setFormData(prev => {
//       const updatedPropertyDetails = [...prev.propertyDetails];
//       updatedPropertyDetails[activePropertyIndex].images = response.data.data;
//       return { ...prev, propertyDetails: updatedPropertyDetails };
//     });
//   } catch (error) {
//     console.error('Upload failed:', error);
//     alert('Image upload failed: ' + (error.response?.data?.message || error.message));
//   } finally {
//     setIsUploading(false);
//   }
// };

//  const handleDeleteImage = async (imageId) => {
//   if (!confirm('Are you sure you want to delete this image?')) return;

//   try {
//     const response = await axios.delete(
//       `${API_URL}/customers/${customerData._id}/propertyDetails/${activePropertyIndex}/images/${imageId}`,
//       { headers: { Authorization: `Bearer ${userData.token}` } }
//     );

//     // Update state with the response data if needed, or just filter locally
//     setFormData(prev => {
//       const updatedPropertyDetails = [...prev.propertyDetails];
//       updatedPropertyDetails[activePropertyIndex].images = 
//         updatedPropertyDetails[activePropertyIndex].images.filter(img => img._id !== imageId);
//       return { ...prev, propertyDetails: updatedPropertyDetails };
//     });
//   } catch (error) {
//     console.error('Delete error:', error);
//     alert('Failed to delete image. Please try again.');
//   }
// };

//   const handleInputChange = (path, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [path]: value
//     }));
//   };

//   const handleNestedChange = (parent, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [field]: value
//       }
//     }));
//   };

//   const handlePropertyChange = (index, field, value) => {
//     setFormData(prev => {
//       const updatedPropertyDetails = [...prev.propertyDetails];
//       // Ensure the property exists
//       if (!updatedPropertyDetails[index]) {
//         updatedPropertyDetails[index] = {
//           name: '',
//           propertyAddress: {},
//           size: '',
//           images: [],
//           features: {},
//           accessInstructions: ''
//         };
//       }
//       if (field.includes('.')) {
//         const [parent, child] = field.split('.');
//         if (!updatedPropertyDetails[index][parent]) {
//           updatedPropertyDetails[index][parent] = {};
//         }
//         updatedPropertyDetails[index][parent][child] = value;
//       } else {
//         updatedPropertyDetails[index][field] = value;
//       }
//       return { ...prev, propertyDetails: updatedPropertyDetails };
//     });
//   };

//   const addNewProperty = () => {
//     setFormData(prev => ({
//       ...prev,
//       propertyDetails: [
//         ...prev.propertyDetails,
//         {
//           name: `Property ${prev.propertyDetails.length + 1}`,
//           propertyAddress: {
//             street: '',
//             city: '',
//             state: '',
//             zipCode: '',
//             country: 'USA'
//           },
//           size: '',
//           images: [],
//           features: {
//             hasFrontYard: true,
//             hasBackYard: true,
//             hasTrees: false,
//             hasGarden: false,
//             hasSprinklerSystem: false
//           },
//           accessInstructions: ''
//         }
//       ]
//     }));
//     setActivePropertyIndex(formData.propertyDetails.length);
//   };

//   const removeProperty = (index) => {
//     if (formData.propertyDetails.length <= 1) {
//       alert('You must have at least one property');
//       return;
//     }
    
//     setFormData(prev => {
//       const updatedPropertyDetails = [...prev.propertyDetails];
//       updatedPropertyDetails.splice(index, 1);
//       return { ...prev, propertyDetails: updatedPropertyDetails };
//     });
    
//     if (index === activePropertyIndex) {
//       setActivePropertyIndex(Math.max(0, activePropertyIndex - 1));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const dataToSend = {
//         address: formData.address,
//         propertyDetails: formData.propertyDetails,
//         notificationPreferences: formData.notificationPreferences,
//         notes: formData.notes
//       };

//       await axios.put(
//         `${API_URL}/customers/me`,
//         dataToSend,
//         { headers: { Authorization: `Bearer ${userData.token}` } }
//       );

//       updateCurrentBooking({
//         ...currentBooking,
//         propertyDetails: formData.propertyDetails,
//         notes: formData.notes
//       });
      
//       onNext();
//     } catch (error) {
//       console.error('Failed to save customer details:', error);
//       alert('Failed to save details. Please try again.');
//     }
//   };

//   if (!customerData) return <div>Loading...</div>;

//   const currentProperty = formData.propertyDetails[activePropertyIndex];

//   return (
//     <div className="py-8">
//       <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Details Section */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Personal Information</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-md"
//                 value={customerData.user.name}
//                 disabled
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-4 py-2 border rounded-md"
//                 value={customerData.user.email}
//                 disabled
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 border rounded-md"
//                 value={customerData.user.phone || ''}
//                 disabled
//               />
//             </div>

//             {/* User's Personal Address */}
//             <h3 className="text-lg font-medium mt-4">Your Address</h3>
//             {['street', 'city', 'state', 'zipCode'].map((field) => (
//               <div key={`personal-${field}`}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
//                   {field.replace(/([A-Z])/g, ' $1')}
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={formData.address[field] || ''}
//                   onChange={(e) => handleNestedChange('address', field, e.target.value)}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Properties Section */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">
//                 Properties ({formData.propertyDetails.length})
//               </h3>
//               <button
//                 type="button"
//                 onClick={addNewProperty}
//                 className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded"
//               >
//                 + Add Property
//               </button>
//             </div>

//             {/* Property Navigation */}
//             <div className="flex flex-wrap gap-2 mb-4">
//               {formData.propertyDetails.map((property, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => setActivePropertyIndex(index)}
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     index === activePropertyIndex
//                       ? 'bg-green-600 text-white'
//                       : 'bg-gray-100 text-gray-700'
//                   }`}
//                 >
//                   {property.name}
//                 </button>
//               ))}
//             </div>

//             {/* Current Property Form */}
//             <div className="space-y-4 border-t pt-4">
//               <div className="flex justify-between items-center">
//                 <h4 className="text-md font-medium">
//                   {currentProperty?.name || ''} Details
//                 </h4>
//                 {formData.propertyDetails.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeProperty(activePropertyIndex)}
//                     className="text-sm text-red-600"
//                   >
//                     Remove Property
//                   </button>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={currentProperty?.name}
//                   onChange={(e) => handlePropertyChange(
//                     activePropertyIndex,
//                     'name',
//                     e.target.value
//                   )}
//                 />
//               </div>

//               <h4 className="text-md font-medium">Property Address</h4>
//               {['street', 'city', 'state', 'zipCode'].map((field) => (
//                 <div key={`property-${field}`}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
//                     {field.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border rounded-md"
//                     value={currentProperty?.propertyAddress?.[field] || ''}
//                     onChange={(e) => handlePropertyChange(
//                       activePropertyIndex,
//                       `propertyAddress.${field}`,
//                       e.target.value
//                     )}
//                     required
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Size (sq ft)</label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={currentProperty?.size || ''}
//                   onChange={(e) => handlePropertyChange(
//                     activePropertyIndex,
//                     'size',
//                     e.target.value
//                   )}
//                 />
//               </div>

//               {/* Property Images Upload */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Property Images (Multiple)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePropertyImageUpload}
//                   disabled={isUploading}
//                   multiple
//                   className="w-full text-sm text-gray-500
//                     file:mr-4 file:py-2 file:px-4
//                     file:rounded-md file:border-0
//                     file:text-sm file:font-semibold
//                     file:bg-green-50 file:text-green-700
//                     hover:file:bg-green-100"
//                 />
//                 {isUploading && (
//                   <div className="mt-2">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div 
//                         className="bg-green-600 h-2.5 rounded-full" 
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Uploading... {uploadProgress}%
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Current Images Gallery */}
//               {currentProperty?.images?.length > 0 && (
//   <div className="mt-4">
//     <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//       {currentProperty?.images.map((image) => (
//         <div key={image._id || image.url} className="relative group">
//           <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
//             <img 
//               src={image.url}
//               alt="Property" 
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.onerror = null; 
//                 e.target.src = '/placeholder-image.jpg';
//               }}
//             />
//           </div>
//           <button
//             type="button"
//             onClick={() => handleDeleteImage(image._id)}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//             aria-label="Delete image"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//       ))}
//     </div>
//   </div>
// )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Access Instructions</label>
//                 <textarea
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={currentProperty?.accessInstructions || ''}
//                   onChange={(e) => handlePropertyChange(
//                     activePropertyIndex,
//                     'accessInstructions',
//                     e.target.value
//                   )}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Property Features</label>
//                 {Object.keys(currentProperty?.features || {}).map((feature) => (

//                   <label key={feature} className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={currentProperty?.features[feature]}
//                       onChange={(e) => handlePropertyChange(
//                         activePropertyIndex,
//                         `features.${feature}`,
//                         e.target.checked
//                       )}
//                       className="h-4 w-4 text-green-600 mr-2"
//                     />
//                     <span className="capitalize">
//                       {feature.replace(/([A-Z])/g, ' $1').replace('has ', '')}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Notification Preferences */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Notifications</h3>
//             {['email', 'sms'].map((type) => (
//               <label key={type} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={formData.notificationPreferences[type]}
//                   onChange={(e) => handleNestedChange(
//                     'notificationPreferences',
//                     type,
//                     e.target.checked
//                   )}
//                   className="h-4 w-4 text-green-600 mr-2"
//                 />
//                 <span className="capitalize">{type}</span>
//               </label>
//             ))}
//           </div>

//           {/* Special Instructions */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Special Instructions</h3>
//             <textarea
//               className="w-full px-4 py-2 border rounded-md"
//               value={formData.notes}
//               onChange={(e) => handleInputChange('notes', e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="mt-8 flex justify-between">
//           <Button type="button" variant="outline" onClick={onBack}>
//             Back to Scheduling
//           </Button>
//           <Button type="submit">
//             Continue to Review
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerDetails;











'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Button from '../ui/Button';
import useStore from '../../lib/store';
import { useDashboard } from '../../contexts/DashboardContext';
import { useTenant } from '../../contexts/TenantContext';
import { getTenantApiClient } from '../../lib/api/apiClient';
import axios from 'axios';
// import GoogleTranslate from '../GoogleTranslate';

const CustomerDetails = ({ onNext, onBack }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const { userData, isLoading } = useDashboard();
  const { tenant } = useTenant();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    properties: [{
      name: 'Property 1',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      size: {
        value: '',
        unit: 'sqft'
      },
      propertyType: 'residential',
      features: {
        hasFrontYard: true,
        hasBackYard: true,
        hasTrees: false,
        hasGarden: false,
        hasSprinklerSystem: false,
        // hasPool: false,
        // hasDeck: false,
        // hasPatio: false,
        // hasFence: false,
        // hasIrrigation: false
      },
      accessInstructions: '',
      specialRequirements: ''
    }],
    notificationPreferences: {
      email: true,
      sms: false
    },
    notes: ''
  });

  const [customerData, setCustomerData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const [errors, setErrors] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    properties: [{
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      size: '',
      accessInstructions: '',
      specialRequirements: ''
    }]
  });
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Refs for Google Translate compatibility
  const formRef = useRef(null);
  const isGoogleTranslateActive = useRef(false);

  // Check if Google Translate is active
  useEffect(() => {
    const checkGoogleTranslate = () => {
      const body = document.body;
      const isTranslated = body.classList.contains('translated-ltr') ||
                          body.classList.contains('translated-rtl') ||
                          document.querySelector('.goog-te-combo')?.value !== 'en';
      isGoogleTranslateActive.current = isTranslated;
    };

    // Initial check
    checkGoogleTranslate();

    // Monitor for Google Translate changes
    const observer = new MutationObserver(() => {
      checkGoogleTranslate();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Also check periodically
    const interval = setInterval(checkGoogleTranslate, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // <GoogleTranslate />
    if (isLoading || !userData?.token) return;

    const fetchCustomerDetails = async () => {
      try {
        const apiClient = getTenantApiClient();
        
        // Fetch customer details
        const customerResponse = await apiClient.get('/customers/me');
        console.log('Customer API Response:', customerResponse.data); 
        const customer = customerResponse.data.data;
        setCustomerData(customer);
        
        // Fetch properties
        const propertiesResponse = await apiClient.get('/properties');
        const fetchedProperties = propertiesResponse.data.data;
        setProperties(fetchedProperties);
        
        // Map properties to form data
        const mappedProperties = fetchedProperties.length > 0 ? fetchedProperties.map(property => ({
          _id: property._id,
          name: property.name,
          address: {
            street: property.address?.street || '',
            city: property.address?.city || '',
            state: property.address?.state || '',
            zipCode: property.address?.zipCode || '',
            country: property.address?.country || 'USA'
          },
          size: {
            value: property.size?.value || '',
            unit: property.size?.unit || 'sqft'
          },
          propertyType: property.propertyType || 'residential',
          images: property.images || [],
         features: {
    hasFrontYard: property.features?.hasFrontYard !== undefined ? property.features.hasFrontYard : true,
    hasBackYard: property.features?.hasBackYard !== undefined ? property.features.hasBackYard : true,
    hasTrees: property.features?.hasTrees !== undefined ? property.features.hasTrees : false,
    hasGarden: property.features?.hasGarden !== undefined ? property.features.hasGarden : false,
    hasSprinklerSystem: property.features?.hasSprinklerSystem !== undefined ? property.features.hasSprinklerSystem : false
  
            // hasPool: property.features?.hasPool ?? false,
            // hasDeck: property.features?.hasDeck ?? false,
            // hasPatio: property.features?.hasPatio ?? false,
            // hasFence: property.features?.hasFence ?? false,
            // hasIrrigation: property.features?.hasIrrigation ?? false
          },
          accessInstructions: property.accessInstructions || '',
          specialRequirements: property.specialRequirements || ''
        })) : [{
          name: 'Property 1',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          },
          size: {
            value: '',
            unit: 'sqft'
          },
          propertyType: 'residential',
          images: [],
          features: {
            hasFrontYard: true,
            hasBackYard: true,
            hasTrees: false,
            hasGarden: false,
            hasSprinklerSystem: false,
            // hasPool: false,
            // hasDeck: false,
            // hasPatio: false,
            // hasFence: false,
            // hasIrrigation: false
          },
          accessInstructions: '',
          specialRequirements: ''
        }];

        setFormData({
        address: {
    street: customer.address?.street || '',
    city: customer.address?.city || '',
    state: customer.address?.state || '',
    zipCode: customer.address?.zipCode || '',
    country: customer.address?.country || 'USA'
  },
          properties: mappedProperties,
          notificationPreferences: customer.notificationPreferences || {
            email: true,
            sms: false
          },
          notes: currentBooking.notes || ''
        });

        const initialErrors = {
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          properties: mappedProperties.map(() => ({
            name: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: ''
            },
            size: '',
            accessInstructions: '',
            specialRequirements: ''
          }))
        };
        setErrors(initialErrors);
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      }
    };

    fetchCustomerDetails();
  }, [userData, isLoading]);

  const showErrorPopup = (message) => {
    setValidationMessage(message);
    setShowValidationPopup(true);
    setTimeout(() => {
      setShowValidationPopup(false);
    }, 5000);
  };

  const validateField = (field, value, isPropertyAddress = false) => {
    const stringValue = value !== null && value !== undefined ? String(value) : '';
    
    switch (field) {
      case 'street':
        if (stringValue.trim() === '') return 'Street address is required';
        if (stringValue.length < 5) return 'Street address is too short';
        if (stringValue.length > 100) return 'Street address is too long';
        return '';
      case 'city':
        if (stringValue.trim() === '') return 'City is required';
        if (!/^[a-zA-Z\s-]+$/.test(stringValue)) return 'City can only contain letters, spaces and hyphens';
        if (stringValue.length < 2) return 'City name is too short';
        if (stringValue.length > 50) return 'City name is too long';
        return '';
      case 'state':
        if (stringValue.trim() === '') return 'State is required';
        if (!/^[a-zA-Z\s-]+$/.test(stringValue)) return 'State can only contain letters, spaces and hyphens';
        if (stringValue.length < 2) return 'State name is too short';
        if (stringValue.length > 50) return 'State name is too long';
        return '';
      case 'zipCode':
        if (stringValue.trim() === '') return 'PIN code is required';
        if (!/^\d{6}$/.test(stringValue)) return 'PIN code must be exactly 6 digits';
        return '';
      case 'size':
        if (value === null || value === undefined || stringValue.trim() === '') return 'Size is required';
        if (isNaN(value)) return 'Size must be a number';
        if (parseFloat(value) <= 0) return 'Size must be positive';
        if (parseFloat(value) > 1000000) return 'Size is too large';
        return '';
      case 'name':
        if (stringValue.trim() === '') return 'Property name is required';
        if (stringValue.length < 2) return 'Property name is too short';
        if (stringValue.length > 100) return 'Property name is too long';
        return '';
      case 'accessInstructions':
        if (stringValue.length > 500) return 'Instructions cannot exceed 500 characters';
        return '';
      case 'specialRequirements':
        if (stringValue.length > 1000) return 'Special requirements cannot exceed 1000 characters';
        return '';
      default:
        return '';
    }
  };

 const handlePropertyImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  for (const file of files) {
    if (!validTypes.includes(file.type)) {
      showErrorPopup('Only JPG, PNG, and GIF images are allowed');
      return;
    }
    if (file.size > maxSize) {
      showErrorPopup('Image size must be less than 10MB');
      return;
    }
  }

  const currentProperty = formData.properties[activePropertyIndex];
  if (!currentProperty._id) {
    showErrorPopup('Please save the property first before uploading images');
    return;
  }

  const uploadFormData = new FormData();
  files.forEach(file => uploadFormData.append('images', file));

  try {
    setIsUploading(true);
    setUploadProgress(0);
    
    const response = await axios.post(
      `${API_URL}/properties/${currentProperty._id}/images`,
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      }
    );

    // Get the publicIds of existing images to check for duplicates
    const existingPublicIds = new Set(
      currentProperty.images.map(img => img.publicId)
    );

    // Filter out any duplicates from the response
    const newImages = response.data.data.filter(
      img => !existingPublicIds.has(img.publicId)
    );

    // Only add truly new images
    setFormData(prev => {
      const updatedProperties = [...prev.properties];
      updatedProperties[activePropertyIndex] = {
        ...updatedProperties[activePropertyIndex],
        images: [
          ...updatedProperties[activePropertyIndex].images,
          ...newImages
        ]
      };
      return { ...prev, properties: updatedProperties };
    });

  } catch (error) {
    console.error('Upload failed:', error);
    showErrorPopup('Image upload failed: ' + (error.response?.data?.error || error.message));
  } finally {
    setIsUploading(false);
  }
};

  const handleDeleteImage = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const currentProperty = formData.properties[activePropertyIndex];
    if (!currentProperty._id) {
      showErrorPopup('Property not saved yet');
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/properties/${currentProperty._id}/images/${encodeURIComponent(publicId)}`,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      setFormData(prev => {
        const updatedProperties = [...prev.properties];
        updatedProperties[activePropertyIndex].images = 
          updatedProperties[activePropertyIndex].images.filter(img => img.publicId !== publicId);
        return { ...prev, properties: updatedProperties };
      });
    } catch (error) {
      console.error('Delete error:', error);
      showErrorPopup('Failed to delete image. Please try again.');
    }
  };

  const handleInputChange = useCallback((path, value) => {
    // Use setTimeout to ensure state updates happen after Google Translate DOM changes
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        [path]: value
      }));
    }, 0);
  }, []);

  // Google Translate-safe event handlers
  const handleNestedChange = useCallback((parent, field, value) => {
    // Use setTimeout to ensure state updates happen after Google Translate DOM changes
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value
        }
      }));

      if (['address', 'notificationPreferences'].includes(parent)) {
        const error = validateField(field, value);
        setErrors(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: error
          }
        }));
      }
    }, 0);
  }, []);

  const handlePropertyChange = useCallback((index, field, value) => {
    const processedValue = field === 'size.value' ?
      (value === '' ? '' : Number(value)) :
      value;

    // Use setTimeout to ensure state updates happen after Google Translate DOM changes
    setTimeout(() => {
      setFormData(prev => {
        const updatedProperties = [...prev.properties];
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          if (!updatedProperties[index][parent]) {
            updatedProperties[index][parent] = {};
          }
          updatedProperties[index][parent][child] = processedValue;
        } else {
          updatedProperties[index][field] = processedValue;
        }
        return { ...prev, properties: updatedProperties };
      });

      let error = '';
      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1];
        error = validateField(addressField, processedValue, true);
        setErrors(prev => {
          const newErrors = {...prev};
          if (!newErrors.properties[index]) {
            newErrors.properties[index] = {
              name: '',
              address: { street: '', city: '', state: '', zipCode: '' },
              size: '',
              accessInstructions: '',
              specialRequirements: ''
            };
          }
          newErrors.properties[index].address[addressField] = error;
          return newErrors;
        });
      } else {
        error = validateField(field, processedValue);
        setErrors(prev => {
          const newErrors = {...prev};
          if (!newErrors.properties[index]) {
            newErrors.properties[index] = {
              name: '',
              address: { street: '', city: '', state: '', zipCode: '' },
              size: '',
              accessInstructions: '',
              specialRequirements: ''
            };
          }
          newErrors.properties[index][field] = error;
          return newErrors;
        });
      }
    }, 0);
  }, []);

  const addNewProperty = () => {
    setFormData(prev => ({
      ...prev,
      properties: [
        ...prev.properties,
        {
          name: `Property ${prev.properties.length + 1}`,
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          },
          size: {
            value: '',
            unit: 'sqft'
          },
          propertyType: 'residential',
          images: [],
          features: {
            hasFrontYard: true,
            hasBackYard: true,
            hasTrees: false,
            hasGarden: false,
            hasSprinklerSystem: false,
            // hasPool: false,
            // hasDeck: false,
            // hasPatio: false,
            // hasFence: false,
            // hasIrrigation: false
          },
          accessInstructions: '',
          specialRequirements: ''
        }
      ]
    }));

    setErrors(prev => ({
      ...prev,
      properties: [
        ...prev.properties,
        {
          name: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          size: '',
          accessInstructions: '',
          specialRequirements: ''
        }
      ]
    }));

    setActivePropertyIndex(formData.properties.length);
  };

  const removeProperty = async (index) => {
    if (formData.properties.length <= 1) {
      showErrorPopup('You must have at least one property');
      return;
    }

    const propertyToRemove = formData.properties[index];
    
    // If property has an ID, delete it from backend
    if (propertyToRemove._id) {
      try {
        await axios.delete(
          `${API_URL}/properties/${propertyToRemove._id}`,
          { headers: { Authorization: `Bearer ${userData.token}` } }
        );
      } catch (error) {
        console.error('Failed to delete property:', error);
        showErrorPopup('Failed to delete property from server');
        return;
      }
    }
    
    setFormData(prev => {
      const updatedProperties = [...prev.properties];
      updatedProperties.splice(index, 1);
      return { ...prev, properties: updatedProperties };
    });

    setErrors(prev => {
      const updatedErrors = {...prev};
      updatedErrors.properties.splice(index, 1);
      return updatedErrors;
    });
    
    if (index === activePropertyIndex) {
      setActivePropertyIndex(Math.max(0, activePropertyIndex - 1));
    }
  };

  const saveProperty = async (index) => {
    const property = formData.properties[index];
    
    // Validate property
    const nameError = validateField('name', property.name);
    const sizeError = validateField('size', property.size.value);
    
    ['street', 'city', 'state', 'zipCode'].forEach(field => {
      const error = validateField(field, property.address[field], true);
      if (error) {
        showErrorPopup(`Please fix validation errors for ${field}`);
        return;
      }
    });

    if (nameError || sizeError) {
      showErrorPopup('Please fix validation errors');
      return;
    }

    try {
      const propertyData = {
  name: property.name,
  address: property.address,
  size: property.size,
  propertyType: property.propertyType,
  features: {
    hasFrontYard: property.features.hasFrontYard,
    hasBackYard: property.features.hasBackYard,
    hasTrees: property.features.hasTrees,
    hasGarden: property.features.hasGarden,
    hasSprinklerSystem: property.features.hasSprinklerSystem
  },
  accessInstructions: property.accessInstructions,
  specialRequirements: property.specialRequirements
};

      let response;
      if (property._id) {
        // Update existing property
        response = await axios.put(
          `${API_URL}/properties/${property._id}`,
          propertyData,
          { headers: { Authorization: `Bearer ${userData.token}` } }
        );
      } else {
        // Create new property
        response = await axios.post(
          `${API_URL}/properties`,
          propertyData,
          { headers: { Authorization: `Bearer ${userData.token}` } }
        );
      }

      // Update the property with the response data
      setFormData(prev => {
        const updatedProperties = [...prev.properties];
        updatedProperties[index] = {
          ...updatedProperties[index],
          _id: response.data.data._id,
          ...response.data.data
        };
        return { ...prev, properties: updatedProperties };
      });

      showErrorPopup('Property saved successfully!');
    } catch (error) {
      console.error('Failed to save property:', error);
      showErrorPopup('Failed to save property: ' + (error.response?.data?.error || error.message));
    }
  };

  // const validateForm = () => {
  //   let isValid = true;
  //   const newErrors = {...errors};

  //   ['street', 'city', 'state', 'zipCode'].forEach(field => {
  //     const error = validateField(field, formData.address[field]);
  //     newErrors.address[field] = error;
  //     if (error) isValid = false;
  //   });

  //   formData.properties.forEach((property, index) => {
  //     const nameError = validateField('name', property.name);
  //     newErrors.properties[index].name = nameError;
  //     if (nameError) isValid = false;

  //     ['street', 'city', 'state', 'zipCode'].forEach(field => {
  //       const error = validateField(field, property.address[field], true);
  //       newErrors.properties[index].address[field] = error;
  //       if (error) isValid = false;
  //     });

  //     const sizeError = validateField('size', property.size.value);
  //     newErrors.properties[index].size = sizeError;
  //     if (sizeError) isValid = false;

  //     const accessError = validateField('accessInstructions', property.accessInstructions);
  //     newErrors.properties[index].accessInstructions = accessError;
  //     if (accessError) isValid = false;

  //     const requirementsError = validateField('specialRequirements', property.specialRequirements);
  //     newErrors.properties[index].specialRequirements = requirementsError;
  //     if (requirementsError) isValid = false;
  //   });

  //   setErrors(newErrors);
  //   return isValid;
  // };



const validateForm = () => {
  let isValid = true;
  
  // Initialize newErrors with proper structure
  const newErrors = {
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    properties: []
  };

  // Validate address fields
  ['street', 'city', 'state', 'zipCode'].forEach(field => {
    const error = validateField(field, formData.address[field]);
    newErrors.address[field] = error;
    if (error) isValid = false;
  });

  // Validate properties with proper error structure initialization
  formData.properties.forEach((property, index) => {
    // Ensure the errors array has an entry for this property index
    if (!newErrors.properties[index]) {
      newErrors.properties[index] = {
        name: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        size: '',
        accessInstructions: '',
        specialRequirements: ''
      };
    }

    // Validate property name
    const nameError = validateField('name', property.name);
    newErrors.properties[index].name = nameError;
    if (nameError) isValid = false;

    // Validate property address fields
    ['street', 'city', 'state', 'zipCode'].forEach(field => {
      const error = validateField(field, property.address[field], true);
      newErrors.properties[index].address[field] = error;
      if (error) isValid = false;
    });

    // Validate property size
    const sizeError = validateField('size', property.size.value);
    newErrors.properties[index].size = sizeError;
    if (sizeError) isValid = false;

    // Validate access instructions
    const accessError = validateField('accessInstructions', property.accessInstructions);
    newErrors.properties[index].accessInstructions = accessError;
    if (accessError) isValid = false;

    // Validate special requirements
    const requirementsError = validateField('specialRequirements', property.specialRequirements);
    newErrors.properties[index].specialRequirements = requirementsError;
    if (requirementsError) isValid = false;
  });

  setErrors(newErrors);
  return isValid;
};




  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Prevent form submission if Google Translate is actively modifying the DOM
    if (isGoogleTranslateActive.current) {
      // Wait a bit for Google Translate to finish DOM modifications
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!validateForm()) {
      showErrorPopup('Please fix all validation errors before submitting');
      return;
    }

    try {
      // Save all properties first
      for (let i = 0; i < formData.properties.length; i++) {
        const property = formData.properties[i];
        if (!property._id) {
          await saveProperty(i);
        }
      }

      // Update customer address
      await axios.put(
        `${API_URL}/customers/me`,
        {
          address: formData.address,
          notificationPreferences: formData.notificationPreferences
        },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      updateCurrentBooking({
        ...currentBooking,
        properties: formData.properties,
        notes: formData.notes
      });

      onNext();
    } catch (error) {
      console.error('Failed to save details:', error);
      showErrorPopup('Failed to save details. Please try again.');
    }
  }, [formData, currentBooking, userData, onNext, updateCurrentBooking]);

  if (!customerData) return <div>Loading...</div>;

  const currentProperty = formData.properties[activePropertyIndex];
  const currentErrors = errors.properties[activePropertyIndex] || {
    name: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    size: '',
    accessInstructions: '',
    specialRequirements: ''
  };

  return (
    <div className="py-8 relative">
      {/* Add CSS to protect form from Google Translate interference */}
      <style jsx>{`
        .google-translate-protected {
          isolation: isolate;
          contain: layout style;
        }
        .google-translate-protected input,
        .google-translate-protected textarea,
        .google-translate-protected select {
          font-family: inherit !important;
          font-size: inherit !important;
        }
        /* Prevent Google Translate from modifying form structure */
        .notranslate {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
      `}</style>

      {showValidationPopup && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs md:max-w-md flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{validationMessage}</p>
            </div>
            <button
              onClick={() => setShowValidationPopup(false)}
              className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
      {/* Add Google Translate protection class to prevent translation of form structure */}
      <form ref={formRef} onSubmit={handleSubmit}
            className="notranslate google-translate-protected"
            style={{ isolation: 'isolate' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                value={customerData.user.name}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md"
                value={customerData.user.email}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                value={customerData.user.phone || ''}
                disabled
              />
            </div>

            <h3 className="text-lg font-medium mt-4">Your Address</h3>
            {['street', 'city', 'state', 'zipCode'].map((field) => (
              <div key={`personal-${field}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.address[field] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.address[field] || ''}
                  onChange={(e) => {
                    try {
                      handleNestedChange('address', field, e.target.value);
                    } catch (error) {
                      console.warn('Input change error (Google Translate conflict):', error);
                      // Fallback: direct state update
                      setTimeout(() => {
                        setFormData(prev => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            [field]: e.target.value
                          }
                        }));
                      }, 100);
                    }
                  }}
                  translate="no"
                  data-translate="no"
                />
                {errors.address[field] && (
                  <p className="mt-1 text-sm text-red-600">{errors.address[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Properties ({formData.properties.length})
              </h3>
              <button
                type="button"
                onClick={addNewProperty}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded"
              >
                + Add Property
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.properties.map((property, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActivePropertyIndex(index)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index === activePropertyIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {property.name}
                </button>
              ))}
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">
                  {currentProperty?.name || ''} Details
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveProperty(activePropertyIndex)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded"
                  >
                    Save Property
                  </button>
                  {formData.properties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProperty(activePropertyIndex)}
                      className="text-sm text-red-600"
                    >
                      Remove Property
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-md ${
                    currentErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={currentProperty?.name}
                  onChange={(e) => {
                    try {
                      handlePropertyChange(
                        activePropertyIndex,
                        'name',
                        e.target.value
                      );
                    } catch (error) {
                      console.warn('Property name change error (Google Translate conflict):', error);
                    }
                  }}
                  translate="no"
                  data-translate="no"
                />
                {currentErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{currentErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  className="w-full px-4 py-2 border rounded-md border-gray-300"
                  value={currentProperty?.propertyType}
                  onChange={(e) => handlePropertyChange(
                    activePropertyIndex,
                    'propertyType',
                    e.target.value
                  )}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agricultural">Agricultural</option>
                </select>
              </div>

              <h4 className="text-md font-medium">Property Address</h4>
              {['street', 'city', 'state', 'zipCode'].map((field) => (
                <div key={`property-${field}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-md ${
                      currentErrors.address[field] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={currentProperty?.address?.[field] || ''}
                    onChange={(e) => {
                      try {
                        handlePropertyChange(
                          activePropertyIndex,
                          `address.${field}`,
                          e.target.value
                        );
                      } catch (error) {
                        console.warn(`Property ${field} change error (Google Translate conflict):`, error);
                      }
                    }}
                    translate="no"
                    data-translate="no"
                  />
                  {currentErrors.address[field] && (
                    <p className="mt-1 text-sm text-red-600">
                      {currentErrors.address[field]}
                    </p>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-md ${
                      currentErrors.size ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={currentProperty?.size?.value || ''}
                    onChange={(e) => {
                      try {
                        handlePropertyChange(
                          activePropertyIndex,
                          'size.value',
                          e.target.value
                        );
                      } catch (error) {
                        console.warn('Property size change error (Google Translate conflict):', error);
                      }
                    }}
                    translate="no"
                    data-translate="no"
                  />
                  {currentErrors.size && (
                    <p className="mt-1 text-sm text-red-600">
                      {currentErrors.size}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    className="w-full px-4 py-2 border rounded-md border-gray-300"
                    value={currentProperty?.size?.unit}
                    onChange={(e) => handlePropertyChange(
                      activePropertyIndex,
                      'size.unit',
                      e.target.value
                    )}
                  >
                    <option value="sqft">Square Feet</option>
                    <option value="acres">Acres</option>
                    <option value="sqm">Square Meters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Images (Multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePropertyImageUpload}
                  disabled={isUploading || !currentProperty._id}
                  multiple
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {!currentProperty._id && (
                  <p className="text-sm text-orange-600 mt-1">
                    Save the property first to upload images
                  </p>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              {currentProperty?.images?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentProperty?.images.map((image) => (
                      <div key={image.publicId || image.url} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={image.url}
                            alt="Property" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.publicId)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Delete image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Instructions</label>
                <textarea
                  className={`w-full px-4 py-2 border rounded-md ${
                    currentErrors.accessInstructions ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={currentProperty?.accessInstructions || ''}
                  onChange={(e) => {
                    try {
                      handlePropertyChange(
                        activePropertyIndex,
                        'accessInstructions',
                        e.target.value
                      );
                    } catch (error) {
                      console.warn('Access instructions change error (Google Translate conflict):', error);
                    }
                  }}
                  maxLength={500}
                  translate="no"
                  data-translate="no"
                />
                <p className="text-xs text-gray-500 text-right">
                  {(currentProperty?.accessInstructions || '').length}/500 characters
                </p>
                {currentErrors.accessInstructions && (
                  <p className="mt-1 text-sm text-red-600">
                    {currentErrors.accessInstructions}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                <textarea
                  className={`w-full px-4 py-2 border rounded-md ${
                    currentErrors.specialRequirements ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={currentProperty?.specialRequirements || ''}
                  onChange={(e) => {
                    try {
                      handlePropertyChange(
                        activePropertyIndex,
                        'specialRequirements',
                        e.target.value
                      );
                    } catch (error) {
                      console.warn('Special requirements change error (Google Translate conflict):', error);
                    }
                  }}
                  maxLength={1000}
                  translate="no"
                  data-translate="no"
                />
                <p className="text-xs text-gray-500 text-right">
                  {(currentProperty?.specialRequirements || '').length}/1000 characters
                </p>
                {currentErrors.specialRequirements && (
                  <p className="mt-1 text-sm text-red-600">
                    {currentErrors.specialRequirements}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(currentProperty?.features || {}).map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentProperty?.features[feature]}
                        onChange={(e) => handlePropertyChange(
                          activePropertyIndex,
                          `features.${feature}`,
                          e.target.checked
                        )}
                        className="h-4 w-4 text-green-600 mr-2"
                      />
                      <span className="capitalize text-sm">
                        {feature.replace(/([A-Z])/g, ' $1').replace('has ', '')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            {['email', 'sms'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences[type]}
                  onChange={(e) => handleNestedChange(
                    'notificationPreferences',
                    type,
                    e.target.checked
                  )}
                  className="h-4 w-4 text-green-600 mr-2"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Special Instructions</h3>
            <textarea
              className="w-full px-4 py-2 border rounded-md"
              value={formData.notes}
              onChange={(e) => {
                try {
                  handleInputChange('notes', e.target.value);
                } catch (error) {
                  console.warn('Notes change error (Google Translate conflict):', error);
                }
              }}
              maxLength={1000}
              translate="no"
              data-translate="no"
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.notes.length}/1000 characters
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Scheduling
          </Button>
          <Button type="submit">
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetails;
















// 'use client';

// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import Button from '../ui/Button';
// import useStore from '../../lib/store';
// import { useDashboard } from '../../contexts/DashboardContext';
// import { useTenant } from '../../contexts/TenantContext';
// import { getTenantApiClient } from '../../lib/api/apiClient';
// import axios from 'axios';

// const CustomerDetails = ({ onNext, onBack }) => {
//   const { currentBooking, updateCurrentBooking } = useStore();
//   const { userData, isLoading } = useDashboard();
//   const { tenant } = useTenant();
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const [formData, setFormData] = useState({
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: 'USA'
//     },
//     properties: [{
//       name: 'Property 1',
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: 'USA'
//       },
//       size: {
//         value: '',
//         unit: 'sqft'
//       },
//       propertyType: 'residential',
//       features: {
//         hasFrontYard: true,
//         hasBackYard: true,
//         hasTrees: false,
//         hasGarden: false,
//         hasSprinklerSystem: false,
//       },
//       accessInstructions: '',
//       specialRequirements: ''
//     }],
//     notificationPreferences: {
//       email: true,
//       sms: false
//     },
//     notes: ''
//   });

//   const [customerData, setCustomerData] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [customersList, setCustomersList] = useState([]);
//   const [showCustomerSelector, setShowCustomerSelector] = useState(false);
//   const [properties, setProperties] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [activePropertyIndex, setActivePropertyIndex] = useState(0);
//   const [errors, setErrors] = useState({
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: ''
//     },
//     properties: [{
//       name: '',
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: ''
//       },
//       size: '',
//       accessInstructions: '',
//       specialRequirements: ''
//     }]
//   });
//   const [showValidationPopup, setShowValidationPopup] = useState(false);
//   const [validationMessage, setValidationMessage] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Check if current user is tenant admin
//   const isTenantAdmin = userData?.role === 'tenantAdmin';

//   // Refs for Google Translate compatibility
//   const formRef = useRef(null);
//   const isGoogleTranslateActive = useRef(false);

//   // Check if Google Translate is active
//   useEffect(() => {
//     const checkGoogleTranslate = () => {
//       const body = document.body;
//       const isTranslated = body.classList.contains('translated-ltr') ||
//                           body.classList.contains('translated-rtl') ||
//                           document.querySelector('.goog-te-combo')?.value !== 'en';
//       isGoogleTranslateActive.current = isTranslated;
//     };

//     checkGoogleTranslate();
//     const observer = new MutationObserver(() => {
//       checkGoogleTranslate();
//     });
//     observer.observe(document.body, {
//       attributes: true,
//       attributeFilter: ['class']
//     });
//     const interval = setInterval(checkGoogleTranslate, 1000);
//     return () => {
//       observer.disconnect();
//       clearInterval(interval);
//     };
//   }, []);

//   useEffect(() => {
//     if (isLoading || !userData?.token) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const apiClient = getTenantApiClient();
        
//         if (isTenantAdmin) {
//           // For tenant admin: fetch customers list
//           const customersResponse = await apiClient.get('/customers');
//           setCustomersList(customersResponse.data.data || []);
          
//           // If there's a customer ID in currentBooking, pre-select that customer
//           if (currentBooking.customerId) {
//             const preselectedCustomer = customersResponse.data.data.find(
//               cust => cust._id === currentBooking.customerId
//             );
//             if (preselectedCustomer) {
//               await handleCustomerSelect(preselectedCustomer);
//             }
//           } else {
//             setLoading(false);
//           }
//         } else {
//           // For regular customers: fetch their own data
//           await fetchCustomerDetails(apiClient);
//         }
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//         setLoading(false);
//         showErrorPopup('Failed to load data. Please try again.');
//       }
//     };

//     fetchData();
//   }, [userData, isLoading, isTenantAdmin]);

//   // Fetch customer details function
//   const fetchCustomerDetails = async (apiClient, customerId = null) => {
//     try {
//       let customerResponse;
      
//       if (customerId && isTenantAdmin) {
//         // Fetch specific customer data for tenant admin
//         customerResponse = await apiClient.get(`/customers/${customerId}`);
//       } else {
//         // Fetch current user's customer data
//         customerResponse = await apiClient.get('/customers/me');
//       }
      
//       console.log('Customer API Response:', customerResponse.data); 
//       const customer = customerResponse.data.data;
//       setCustomerData(customer);
      
//       if (customerId && isTenantAdmin) {
//         setSelectedCustomer(customer);
//       }
      
//       // Fetch properties for the customer
//       let propertiesResponse;
//       if (customerId && isTenantAdmin) {
//         // Correct backend route is /properties/customer/:customerId
//         propertiesResponse = await apiClient.get(`/properties/customer/${customerId}`);
//       } else {
//         propertiesResponse = await apiClient.get('/properties');
//       }
      
//       const fetchedProperties = propertiesResponse.data.data;
//       setProperties(fetchedProperties);
      
//       // Map properties to form data
//       const mappedProperties = fetchedProperties.length > 0 ? fetchedProperties.map(property => ({
//         _id: property._id,
//         name: property.name,
//         address: {
//           street: property.address?.street || '',
//           city: property.address?.city || '',
//           state: property.address?.state || '',
//           zipCode: property.address?.zipCode || '',
//           country: property.address?.country || 'USA'
//         },
//         size: {
//           value: property.size?.value || '',
//           unit: property.size?.unit || 'sqft'
//         },
//         propertyType: property.propertyType || 'residential',
//         images: property.images || [],
//         features: {
//           hasFrontYard: property.features?.hasFrontYard !== undefined ? property.features.hasFrontYard : true,
//           hasBackYard: property.features?.hasBackYard !== undefined ? property.features.hasBackYard : true,
//           hasTrees: property.features?.hasTrees !== undefined ? property.features.hasTrees : false,
//           hasGarden: property.features?.hasGarden !== undefined ? property.features.hasGarden : false,
//           hasSprinklerSystem: property.features?.hasSprinklerSystem !== undefined ? property.features.hasSprinklerSystem : false
//         },
//         accessInstructions: property.accessInstructions || '',
//         specialRequirements: property.specialRequirements || ''
//       })) : [{
//         name: 'Property 1',
//         address: {
//           street: '',
//           city: '',
//           state: '',
//           zipCode: '',
//           country: 'USA'
//         },
//         size: {
//           value: '',
//           unit: 'sqft'
//         },
//         propertyType: 'residential',
//         images: [],
//         features: {
//           hasFrontYard: true,
//           hasBackYard: true,
//           hasTrees: false,
//           hasGarden: false,
//           hasSprinklerSystem: false,
//         },
//         accessInstructions: '',
//         specialRequirements: ''
//       }];

//       setFormData({
//         address: {
//           street: customer.address?.street || '',
//           city: customer.address?.city || '',
//           state: customer.address?.state || '',
//           zipCode: customer.address?.zipCode || '',
//           country: customer.address?.country || 'USA'
//         },
//         properties: mappedProperties,
//         notificationPreferences: customer.notificationPreferences || {
//           email: true,
//           sms: false
//         },
//         notes: currentBooking.notes || ''
//       });

//       const initialErrors = {
//         address: {
//           street: '',
//           city: '',
//           state: '',
//           zipCode: ''
//         },
//         properties: mappedProperties.map(() => ({
//           name: '',
//           address: {
//             street: '',
//             city: '',
//             state: '',
//             zipCode: ''
//           },
//           size: '',
//           accessInstructions: '',
//           specialRequirements: ''
//         }))
//       };
//       setErrors(initialErrors);
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch customer details:', error);
//       setLoading(false);
//       showErrorPopup('Failed to load customer details.');
//     }
//   };

//   // Handle customer selection for tenant admin
//   const handleCustomerSelect = async (customer) => {
//     try {
//       setLoading(true);
//       const apiClient = getTenantApiClient();
//       setSelectedCustomer(customer);
//       setShowCustomerSelector(false);
      
//       // Update current booking with selected customer
//       updateCurrentBooking({
//         ...currentBooking,
//         customerId: customer._id,
//         customerName: customer.user?.name || 'Customer'
//       });
      
//       // Fetch the selected customer's details
//       await fetchCustomerDetails(apiClient, customer._id);
//     } catch (error) {
//       console.error('Failed to load customer details:', error);
//       setLoading(false);
//       showErrorPopup('Failed to load customer details');
//     }
//   };

//   const showErrorPopup = (message) => {
//     setValidationMessage(message);
//     setShowValidationPopup(true);
//     setTimeout(() => {
//       setShowValidationPopup(false);
//     }, 5000);
//   };

//   const validateField = (field, value, isPropertyAddress = false) => {
//     const stringValue = value !== null && value !== undefined ? String(value) : '';
    
//     switch (field) {
//       case 'street':
//         if (stringValue.trim() === '') return 'Street address is required';
//         if (stringValue.length < 5) return 'Street address is too short';
//         if (stringValue.length > 100) return 'Street address is too long';
//         return '';
//       case 'city':
//         if (stringValue.trim() === '') return 'City is required';
//         if (!/^[a-zA-Z\s-]+$/.test(stringValue)) return 'City can only contain letters, spaces and hyphens';
//         if (stringValue.length < 2) return 'City name is too short';
//         if (stringValue.length > 50) return 'City name is too long';
//         return '';
//       case 'state':
//         if (stringValue.trim() === '') return 'State is required';
//         if (!/^[a-zA-Z\s-]+$/.test(stringValue)) return 'State can only contain letters, spaces and hyphens';
//         if (stringValue.length < 2) return 'State name is too short';
//         if (stringValue.length > 50) return 'State name is too long';
//         return '';
//       case 'zipCode':
//         if (stringValue.trim() === '') return 'PIN code is required';
//         if (!/^\d{6}$/.test(stringValue)) return 'PIN code must be exactly 6 digits';
//         return '';
//       case 'size':
//         if (value === null || value === undefined || stringValue.trim() === '') return 'Size is required';
//         if (isNaN(value)) return 'Size must be a number';
//         if (parseFloat(value) <= 0) return 'Size must be positive';
//         if (parseFloat(value) > 1000000) return 'Size is too large';
//         return '';
//       case 'name':
//         if (stringValue.trim() === '') return 'Property name is required';
//         if (stringValue.length < 2) return 'Property name is too short';
//         if (stringValue.length > 100) return 'Property name is too long';
//         return '';
//       case 'accessInstructions':
//         if (stringValue.length > 500) return 'Instructions cannot exceed 500 characters';
//         return '';
//       case 'specialRequirements':
//         if (stringValue.length > 1000) return 'Special requirements cannot exceed 1000 characters';
//         return '';
//       default:
//         return '';
//     }
//   };

//   const handlePropertyImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     const maxSize = 10 * 1024 * 1024; // 10MB
    
//     for (const file of files) {
//       if (!validTypes.includes(file.type)) {
//         showErrorPopup('Only JPG, PNG, and GIF images are allowed');
//         return;
//       }
//       if (file.size > maxSize) {
//         showErrorPopup('Image size must be less than 10MB');
//         return;
//       }
//     }

//     const currentProperty = formData.properties[activePropertyIndex];
//     if (!currentProperty._id) {
//       showErrorPopup('Please save the property first before uploading images');
//       return;
//     }

//     const uploadFormData = new FormData();
//     files.forEach(file => uploadFormData.append('images', file));

//     try {
//       setIsUploading(true);
//       setUploadProgress(0);
      
//       const response = await axios.post(
//         `${API_URL}/properties/${currentProperty._id}/images`,
//         uploadFormData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${userData.token}`
//           },
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percentCompleted);
//           }
//         }
//       );

//       // Get the publicIds of existing images to check for duplicates
//       const existingPublicIds = new Set(
//         currentProperty.images.map(img => img.publicId)
//       );

//       // Filter out any duplicates from the response
//       const newImages = response.data.data.filter(
//         img => !existingPublicIds.has(img.publicId)
//       );

//       // Only add truly new images
//       setFormData(prev => {
//         const updatedProperties = [...prev.properties];
//         updatedProperties[activePropertyIndex] = {
//           ...updatedProperties[activePropertyIndex],
//           images: [
//             ...updatedProperties[activePropertyIndex].images,
//             ...newImages
//           ]
//         };
//         return { ...prev, properties: updatedProperties };
//       });

//     } catch (error) {
//       console.error('Upload failed:', error);
//       showErrorPopup('Image upload failed: ' + (error.response?.data?.error || error.message));
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDeleteImage = async (publicId) => {
//     if (!window.confirm('Are you sure you want to delete this image?')) return;

//     const currentProperty = formData.properties[activePropertyIndex];
//     if (!currentProperty._id) {
//       showErrorPopup('Property not saved yet');
//       return;
//     }

//     try {
//       await axios.delete(
//         `${API_URL}/properties/${currentProperty._id}/images/${encodeURIComponent(publicId)}`,
//         { headers: { Authorization: `Bearer ${userData.token}` } }
//       );

//       setFormData(prev => {
//         const updatedProperties = [...prev.properties];
//         updatedProperties[activePropertyIndex].images = 
//           updatedProperties[activePropertyIndex].images.filter(img => img.publicId !== publicId);
//         return { ...prev, properties: updatedProperties };
//       });
//     } catch (error) {
//       console.error('Delete error:', error);
//       showErrorPopup('Failed to delete image. Please try again.');
//     }
//   };

//   const handleInputChange = useCallback((path, value) => {
//     setTimeout(() => {
//       setFormData(prev => ({
//         ...prev,
//         [path]: value
//       }));
//     }, 0);
//   }, []);

//   const handleNestedChange = useCallback((parent, field, value) => {
//     setTimeout(() => {
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [field]: value
//         }
//       }));

//       if (['address', 'notificationPreferences'].includes(parent)) {
//         const error = validateField(field, value);
//         setErrors(prev => ({
//           ...prev,
//           [parent]: {
//             ...prev[parent],
//             [field]: error
//           }
//         }));
//       }
//     }, 0);
//   }, []);

//   const handlePropertyChange = useCallback((index, field, value) => {
//     const processedValue = field === 'size.value' ?
//       (value === '' ? '' : Number(value)) :
//       value;

//     setTimeout(() => {
//       setFormData(prev => {
//         const updatedProperties = [...prev.properties];
//         if (field.includes('.')) {
//           const [parent, child] = field.split('.');
//           if (!updatedProperties[index][parent]) {
//             updatedProperties[index][parent] = {};
//           }
//           updatedProperties[index][parent][child] = processedValue;
//         } else {
//           updatedProperties[index][field] = processedValue;
//         }
//         return { ...prev, properties: updatedProperties };
//       });

//       let error = '';
//       if (field.startsWith('address.')) {
//         const addressField = field.split('.')[1];
//         error = validateField(addressField, processedValue, true);
//         setErrors(prev => {
//           const newErrors = {...prev};
//           if (!newErrors.properties[index]) {
//             newErrors.properties[index] = {
//               name: '',
//               address: { street: '', city: '', state: '', zipCode: '' },
//               size: '',
//               accessInstructions: '',
//               specialRequirements: ''
//             };
//           }
//           newErrors.properties[index].address[addressField] = error;
//           return newErrors;
//         });
//       } else {
//         error = validateField(field, processedValue);
//         setErrors(prev => {
//           const newErrors = {...prev};
//           if (!newErrors.properties[index]) {
//             newErrors.properties[index] = {
//               name: '',
//               address: { street: '', city: '', state: '', zipCode: '' },
//               size: '',
//               accessInstructions: '',
//               specialRequirements: ''
//             };
//           }
//           newErrors.properties[index][field] = error;
//           return newErrors;
//         });
//       }
//     }, 0);
//   }, []);

//   const addNewProperty = () => {
//     setFormData(prev => ({
//       ...prev,
//       properties: [
//         ...prev.properties,
//         {
//           name: `Property ${prev.properties.length + 1}`,
//           address: {
//             street: '',
//             city: '',
//             state: '',
//             zipCode: '',
//             country: 'USA'
//           },
//           size: {
//             value: '',
//             unit: 'sqft'
//           },
//           propertyType: 'residential',
//           images: [],
//           features: {
//             hasFrontYard: true,
//             hasBackYard: true,
//             hasTrees: false,
//             hasGarden: false,
//             hasSprinklerSystem: false,
//           },
//           accessInstructions: '',
//           specialRequirements: ''
//         }
//       ]
//     }));

//     setErrors(prev => ({
//       ...prev,
//       properties: [
//         ...prev.properties,
//         {
//           name: '',
//           address: {
//             street: '',
//             city: '',
//             state: '',
//             zipCode: ''
//           },
//           size: '',
//           accessInstructions: '',
//           specialRequirements: ''
//         }
//       ]
//     }));

//     setActivePropertyIndex(formData.properties.length);
//   };

//   const removeProperty = async (index) => {
//     if (formData.properties.length <= 1) {
//       showErrorPopup('You must have at least one property');
//       return;
//     }

//     const propertyToRemove = formData.properties[index];
    
//     // If property has an ID, delete it from backend
//     if (propertyToRemove._id) {
//       try {
//         await axios.delete(
//           `${API_URL}/properties/${propertyToRemove._id}`,
//           { headers: { Authorization: `Bearer ${userData.token}` } }
//         );
//       } catch (error) {
//         console.error('Failed to delete property:', error);
//         showErrorPopup('Failed to delete property from server');
//         return;
//       }
//     }
    
//     setFormData(prev => {
//       const updatedProperties = [...prev.properties];
//       updatedProperties.splice(index, 1);
//       return { ...prev, properties: updatedProperties };
//     });

//     setErrors(prev => {
//       const updatedErrors = {...prev};
//       updatedErrors.properties.splice(index, 1);
//       return updatedErrors;
//     });
    
//     if (index === activePropertyIndex) {
//       setActivePropertyIndex(Math.max(0, activePropertyIndex - 1));
//     }
//   };

//   const saveProperty = async (index) => {
//     const property = formData.properties[index];
    
//     // Validate property
//     const nameError = validateField('name', property.name);
//     const sizeError = validateField('size', property.size.value);
    
//     ['street', 'city', 'state', 'zipCode'].forEach(field => {
//       const error = validateField(field, property.address[field], true);
//       if (error) {
//         showErrorPopup(`Please fix validation errors for ${field}`);
//         return;
//       }
//     });

//     if (nameError || sizeError) {
//       showErrorPopup('Please fix validation errors');
//       return;
//     }

//     try {
//       const propertyData = {
//         name: property.name,
//         address: property.address,
//         size: property.size,
//         propertyType: property.propertyType,
//         features: {
//           hasFrontYard: property.features.hasFrontYard,
//           hasBackYard: property.features.hasBackYard,
//           hasTrees: property.features.hasTrees,
//           hasGarden: property.features.hasGarden,
//           hasSprinklerSystem: property.features.hasSprinklerSystem
//         },
//         accessInstructions: property.accessInstructions,
//         specialRequirements: property.specialRequirements
//       };

//       let response;
//       if (property._id) {
//         // Update existing property
//         response = await axios.put(
//           `${API_URL}/properties/${property._id}`,
//           propertyData,
//           { headers: { Authorization: `Bearer ${userData.token}` } }
//         );
//       } else {
//         // Create new property
//         response = await axios.post(
//           `${API_URL}/properties`,
//           propertyData,
//           { headers: { Authorization: `Bearer ${userData.token}` } }
//         );
//       }

//       // Update the property with the response data
//       setFormData(prev => {
//         const updatedProperties = [...prev.properties];
//         updatedProperties[index] = {
//           ...updatedProperties[index],
//           _id: response.data.data._id,
//           ...response.data.data
//         };
//         return { ...prev, properties: updatedProperties };
//       });

//       showErrorPopup('Property saved successfully!');
//     } catch (error) {
//       console.error('Failed to save property:', error);
//       showErrorPopup('Failed to save property: ' + (error.response?.data?.error || error.message));
//     }
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {...errors};

//     ['street', 'city', 'state', 'zipCode'].forEach(field => {
//       const error = validateField(field, formData.address[field]);
//       newErrors.address[field] = error;
//       if (error) isValid = false;
//     });

//     formData.properties.forEach((property, index) => {
//       const nameError = validateField('name', property.name);
//       newErrors.properties[index].name = nameError;
//       if (nameError) isValid = false;

//       ['street', 'city', 'state', 'zipCode'].forEach(field => {
//         const error = validateField(field, property.address[field], true);
//         newErrors.properties[index].address[field] = error;
//         if (error) isValid = false;
//       });

//       const sizeError = validateField('size', property.size.value);
//       newErrors.properties[index].size = sizeError;
//       if (sizeError) isValid = false;

//       const accessError = validateField('accessInstructions', property.accessInstructions);
//       newErrors.properties[index].accessInstructions = accessError;
//       if (accessError) isValid = false;

//       const requirementsError = validateField('specialRequirements', property.specialRequirements);
//       newErrors.properties[index].specialRequirements = requirementsError;
//       if (requirementsError) isValid = false;
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();

//     if (isTenantAdmin && !selectedCustomer) {
//       showErrorPopup('Please select a customer first');
//       return;
//     }

//     // Prevent form submission if Google Translate is actively modifying the DOM
//     if (isGoogleTranslateActive.current) {
//       await new Promise(resolve => setTimeout(resolve, 500));
//     }

//     if (!validateForm()) {
//       showErrorPopup('Please fix all validation errors before submitting');
//       return;
//     }

//     try {
//       // Save all properties first
//       for (let i = 0; i < formData.properties.length; i++) {
//         const property = formData.properties[i];
//         if (!property._id) {
//           await saveProperty(i);
//         }
//       }

//       // Update customer address (only if not tenant admin)
//       if (!isTenantAdmin) {
//         await axios.put(
//           `${API_URL}/customers/me`,
//           {
//             address: formData.address,
//             notificationPreferences: formData.notificationPreferences
//           },
//           { headers: { Authorization: `Bearer ${userData.token}` } }
//         );
//       }

//       updateCurrentBooking({
//         ...currentBooking,
//         properties: formData.properties,
//         notes: formData.notes,
//         // Ensure customer ID is set for tenant admin
//         customerId: isTenantAdmin ? selectedCustomer._id : currentBooking.customerId,
//         customerName: isTenantAdmin ? selectedCustomer.user?.name : customerData?.user?.name
//       });

//       onNext();
//     } catch (error) {
//       console.error('Failed to save details:', error);
//       showErrorPopup('Failed to save details. Please try again.');
//     }
//   }, [formData, currentBooking, userData, onNext, updateCurrentBooking, isTenantAdmin, selectedCustomer]);

//   // Add Customer Selector UI for tenant admin
//   const renderCustomerSelector = () => {
//     if (!isTenantAdmin) return null;

//     return (
//       <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//         <h3 className="text-lg font-medium mb-3">Select Customer</h3>
        
//         {!selectedCustomer ? (
//           <div>
//             <button
//               type="button"
//               onClick={() => setShowCustomerSelector(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//             >
//               Select Customer
//             </button>
            
//             {showCustomerSelector && (
//               <div className="mt-3 p-4 bg-white border rounded-lg max-h-60 overflow-y-auto">
//                 <h4 className="font-medium mb-2">Available Customers</h4>
//                 {customersList.length === 0 ? (
//                   <p className="text-gray-500">No customers found</p>
//                 ) : (
//                   customersList.map(customer => (
//                     <button
//                       key={customer._id}
//                       type="button"
//                       onClick={() => handleCustomerSelect(customer)}
//                       className="w-full text-left p-3 hover:bg-gray-100 rounded-md border-b last:border-b-0"
//                     >
//                       <div className="font-medium">{customer.user?.name || 'Unknown Customer'}</div>
//                       <div className="text-sm text-gray-600">{customer.user?.email}</div>
//                       <div className="text-sm text-gray-500">
//                         {customer.address?.city && `${customer.address.city}, ${customer.address.state}`}
//                       </div>
//                     </button>
//                   ))
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => setShowCustomerSelector(false)}
//                   className="mt-3 text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex items-center justify-between p-3 bg-white rounded-md border">
//             <div>
//               <div className="font-medium">{selectedCustomer.user?.name}</div>
//               <div className="text-sm text-gray-600">{selectedCustomer.user?.email}</div>
//               <div className="text-sm text-gray-500">
//                 {selectedCustomer.address?.city && `${selectedCustomer.address.city}, ${selectedCustomer.address.state}`}
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 setSelectedCustomer(null);
//                 setCustomerData(null);
//                 setFormData({
//                   address: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
//                   properties: [{
//                     name: 'Property 1',
//                     address: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
//                     size: { value: '', unit: 'sqft' },
//                     propertyType: 'residential',
//                     images: [],
//                     features: {
//                       hasFrontYard: true,
//                       hasBackYard: true,
//                       hasTrees: false,
//                       hasGarden: false,
//                       hasSprinklerSystem: false,
//                     },
//                     accessInstructions: '',
//                     specialRequirements: ''
//                   }],
//                   notificationPreferences: { email: true, sms: false },
//                   notes: ''
//                 });
//               }}
//               className="text-red-600 hover:text-red-800 text-sm"
//             >
//               Change Customer
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="py-8">
//         <div className="flex justify-center items-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-3">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (isTenantAdmin && !selectedCustomer) {
//     return (
//       <div className="py-8">
//         <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
//         {renderCustomerSelector()}
//         <div className="text-center py-8 text-gray-500">
//           Please select a customer to continue with booking
//         </div>
//       </div>
//     );
//   }

//   const currentProperty = formData.properties[activePropertyIndex];
//   const currentErrors = errors.properties[activePropertyIndex] || {
//     name: '',
//     address: { street: '', city: '', state: '', zipCode: '' },
//     size: '',
//     accessInstructions: '',
//     specialRequirements: ''
//   };

//   return (
//     <div className="py-8 relative">
//       <style jsx>{`
//         .google-translate-protected {
//           isolation: isolate;
//           contain: layout style;
//         }
//         .google-translate-protected input,
//         .google-translate-protected textarea,
//         .google-translate-protected select {
//           font-family: inherit !important;
//           font-size: inherit !important;
//         }
//         .notranslate {
//           -webkit-transform: translateZ(0);
//           transform: translateZ(0);
//         }
//       `}</style>

//       {showValidationPopup && (
//         <div className="fixed top-4 right-4 z-50">
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs md:max-w-md flex items-start">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm font-medium">{validationMessage}</p>
//             </div>
//             <button
//               onClick={() => setShowValidationPopup(false)}
//               className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
//               aria-label="Close"
//             >
//               <span className="sr-only">Close</span>
//               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
      
//       {/* Customer Selector for Tenant Admin */}
//       {renderCustomerSelector()}

//       {/* Show loading if data is being fetched for selected customer */}
//       {isTenantAdmin && selectedCustomer && !customerData && (
//         <div className="text-center py-4">Loading customer data...</div>
//       )}

//       {/* Main form - only show when we have customer data */}
//       {customerData && (
//         <form ref={formRef} onSubmit={handleSubmit}
//               className="notranslate google-translate-protected"
//               style={{ isolation: 'isolate' }}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Customer Information</h3>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={customerData.user?.name || selectedCustomer?.user?.name}
//                   disabled
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={customerData.user?.email || selectedCustomer?.user?.email}
//                   disabled
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={customerData.user?.phone || selectedCustomer?.user?.phone || ''}
//                   disabled
//                 />
//               </div>

//               <h3 className="text-lg font-medium mt-4">Customer Address</h3>
//               {['street', 'city', 'state', 'zipCode'].map((field) => (
//                 <div key={`personal-${field}`}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
//                     {field.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     type="text"
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       errors.address[field] ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     value={formData.address[field] || ''}
//                     onChange={(e) => {
//                       try {
//                         handleNestedChange('address', field, e.target.value);
//                       } catch (error) {
//                         console.warn('Input change error (Google Translate conflict):', error);
//                         setTimeout(() => {
//                           setFormData(prev => ({
//                             ...prev,
//                             address: {
//                               ...prev.address,
//                               [field]: e.target.value
//                             }
//                           }));
//                         }, 100);
//                       }
//                     }}
//                     translate="no"
//                     data-translate="no"
//                   />
//                   {errors.address[field] && (
//                     <p className="mt-1 text-sm text-red-600">{errors.address[field]}</p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-medium">
//                   Properties ({formData.properties.length})
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={addNewProperty}
//                   className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded"
//                 >
//                   + Add Property
//                 </button>
//               </div>

//               <div className="flex flex-wrap gap-2 mb-4">
//                 {formData.properties.map((property, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => setActivePropertyIndex(index)}
//                     className={`px-3 py-1 rounded-full text-sm ${
//                       index === activePropertyIndex
//                         ? 'bg-green-600 text-white'
//                         : 'bg-gray-100 text-gray-700'
//                     }`}
//                   >
//                     {property.name}
//                   </button>
//                 ))}
//               </div>

//               <div className="space-y-4 border-t pt-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="text-md font-medium">
//                     {currentProperty?.name || ''} Details
//                   </h4>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={() => saveProperty(activePropertyIndex)}
//                       className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded"
//                     >
//                       Save Property
//                     </button>
//                     {formData.properties.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeProperty(activePropertyIndex)}
//                         className="text-sm text-red-600"
//                       >
//                         Remove Property
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
//                   <input
//                     type="text"
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       currentErrors.name ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     value={currentProperty?.name}
//                     onChange={(e) => {
//                       try {
//                         handlePropertyChange(
//                           activePropertyIndex,
//                           'name',
//                           e.target.value
//                         );
//                       } catch (error) {
//                         console.warn('Property name change error (Google Translate conflict):', error);
//                       }
//                     }}
//                     translate="no"
//                     data-translate="no"
//                   />
//                   {currentErrors.name && (
//                     <p className="mt-1 text-sm text-red-600">{currentErrors.name}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
//                   <select
//                     className="w-full px-4 py-2 border rounded-md border-gray-300"
//                     value={currentProperty?.propertyType}
//                     onChange={(e) => handlePropertyChange(
//                       activePropertyIndex,
//                       'propertyType',
//                       e.target.value
//                     )}
//                   >
//                     <option value="residential">Residential</option>
//                     <option value="commercial">Commercial</option>
//                     <option value="industrial">Industrial</option>
//                     <option value="agricultural">Agricultural</option>
//                   </select>
//                 </div>

//                 <h4 className="text-md font-medium">Property Address</h4>
//                 {['street', 'city', 'state', 'zipCode'].map((field) => (
//                   <div key={`property-${field}`}>
//                     <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
//                       {field.replace(/([A-Z])/g, ' $1')}
//                     </label>
//                     <input
//                       type="text"
//                       className={`w-full px-4 py-2 border rounded-md ${
//                         currentErrors.address[field] ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       value={currentProperty?.address?.[field] || ''}
//                       onChange={(e) => {
//                         try {
//                           handlePropertyChange(
//                             activePropertyIndex,
//                             `address.${field}`,
//                             e.target.value
//                           );
//                         } catch (error) {
//                           console.warn(`Property ${field} change error (Google Translate conflict):`, error);
//                         }
//                       }}
//                       translate="no"
//                       data-translate="no"
//                     />
//                     {currentErrors.address[field] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {currentErrors.address[field]}
//                       </p>
//                     )}
//                   </div>
//                 ))}

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       className={`w-full px-4 py-2 border rounded-md ${
//                         currentErrors.size ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       value={currentProperty?.size?.value || ''}
//                       onChange={(e) => {
//                         try {
//                           handlePropertyChange(
//                             activePropertyIndex,
//                             'size.value',
//                             e.target.value
//                           );
//                         } catch (error) {
//                           console.warn('Property size change error (Google Translate conflict):', error);
//                         }
//                       }}
//                       translate="no"
//                       data-translate="no"
//                     />
//                     {currentErrors.size && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {currentErrors.size}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
//                     <select
//                       className="w-full px-4 py-2 border rounded-md border-gray-300"
//                       value={currentProperty?.size?.unit}
//                       onChange={(e) => handlePropertyChange(
//                         activePropertyIndex,
//                         'size.unit',
//                         e.target.value
//                       )}
//                     >
//                       <option value="sqft">Square Feet</option>
//                       <option value="acres">Acres</option>
//                       <option value="sqm">Square Meters</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Property Images (Multiple)
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handlePropertyImageUpload}
//                     disabled={isUploading || !currentProperty._id}
//                     multiple
//                     className="w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-green-50 file:text-green-700
//                       hover:file:bg-green-100"
//                   />
//                   {!currentProperty._id && (
//                     <p className="text-sm text-orange-600 mt-1">
//                       Save the property first to upload images
//                     </p>
//                   )}
//                   {isUploading && (
//                     <div className="mt-2">
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div 
//                           className="bg-green-600 h-2.5 rounded-full" 
//                           style={{ width: `${uploadProgress}%` }}
//                         ></div>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Uploading... {uploadProgress}%
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {currentProperty?.images?.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {currentProperty?.images.map((image) => (
//                         <div key={image.publicId || image.url} className="relative group">
//                           <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
//                             <img 
//                               src={image.url}
//                               alt="Property" 
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 e.target.onerror = null; 
//                                 e.target.src = '/placeholder-image.jpg';
//                               }}
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleDeleteImage(image.publicId)}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             aria-label="Delete image"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Access Instructions</label>
//                   <textarea
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       currentErrors.accessInstructions ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     value={currentProperty?.accessInstructions || ''}
//                     onChange={(e) => {
//                       try {
//                         handlePropertyChange(
//                           activePropertyIndex,
//                           'accessInstructions',
//                           e.target.value
//                         );
//                       } catch (error) {
//                         console.warn('Access instructions change error (Google Translate conflict):', error);
//                       }
//                     }}
//                     maxLength={500}
//                     translate="no"
//                     data-translate="no"
//                   />
//                   <p className="text-xs text-gray-500 text-right">
//                     {(currentProperty?.accessInstructions || '').length}/500 characters
//                   </p>
//                   {currentErrors.accessInstructions && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {currentErrors.accessInstructions}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
//                   <textarea
//                     className={`w-full px-4 py-2 border rounded-md ${
//                       currentErrors.specialRequirements ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     value={currentProperty?.specialRequirements || ''}
//                     onChange={(e) => {
//                       try {
//                         handlePropertyChange(
//                           activePropertyIndex,
//                           'specialRequirements',
//                           e.target.value
//                         );
//                       } catch (error) {
//                         console.warn('Special requirements change error (Google Translate conflict):', error);
//                       }
//                     }}
//                     maxLength={1000}
//                     translate="no"
//                     data-translate="no"
//                   />
//                   <p className="text-xs text-gray-500 text-right">
//                     {(currentProperty?.specialRequirements || '').length}/1000 characters
//                   </p>
//                   {currentErrors.specialRequirements && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {currentErrors.specialRequirements}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Property Features</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {Object.keys(currentProperty?.features || {}).map((feature) => (
//                       <label key={feature} className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={currentProperty?.features[feature]}
//                           onChange={(e) => handlePropertyChange(
//                             activePropertyIndex,
//                             `features.${feature}`,
//                             e.target.checked
//                           )}
//                           className="h-4 w-4 text-green-600 mr-2"
//                         />
//                         <span className="capitalize text-sm">
//                           {feature.replace(/([A-Z])/g, ' $1').replace('has ', '')}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Notifications</h3>
//               {['email', 'sms'].map((type) => (
//                 <label key={type} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={formData.notificationPreferences[type]}
//                     onChange={(e) => handleNestedChange(
//                       'notificationPreferences',
//                       type,
//                       e.target.checked
//                     )}
//                     className="h-4 w-4 text-green-600 mr-2"
//                   />
//                   <span className="capitalize">{type}</span>
//                 </label>
//               ))}
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Special Instructions</h3>
//               <textarea
//                 className="w-full px-4 py-2 border rounded-md"
//                 value={formData.notes}
//                 onChange={(e) => {
//                   try {
//                     handleInputChange('notes', e.target.value);
//                   } catch (error) {
//                     console.warn('Notes change error (Google Translate conflict):', error);
//                   }
//                 }}
//                 maxLength={1000}
//                 translate="no"
//                 data-translate="no"
//               />
//               <p className="text-xs text-gray-500 text-right">
//                 {formData.notes.length}/1000 characters
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 flex justify-between">
//             <Button type="button" variant="outline" onClick={onBack}>
//               Back to Scheduling
//             </Button>
//             <Button type="submit">
//               Continue to Review
//             </Button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CustomerDetails;