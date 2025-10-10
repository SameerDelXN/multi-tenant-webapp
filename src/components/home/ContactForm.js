// "use client";

// import React, { useState } from 'react';
// import { 
//   Mail, 
//   Phone, 
//   MapPin 
// } from 'lucide-react';

// const ContactForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     service: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         alert('Your message has been sent successfully!');
//       } else {
//         alert('There was an issue sending your message.');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('There was an error submitting the form.');
//     }

//     // Reset the form
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       service: '',
//       message: ''
//     });
//   };

//   return (
//     <section className="min-h-screen pt-24 pb-12 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-6xl mx-auto">
//           <div className="grid md:grid-cols-2">
//             {/* Left Column - Contact Information */}
//             <div className="bg-green-700 p-8 lg:p-12 text-white">
//               <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Transform Your Outdoor Space?</h2>
//               <p className="mb-6 text-green-100">
//                 Get in touch with us today to discuss your landscaping needs and receive a free consultation.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <Phone className="h-5 w-5 mr-3 text-green-300 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-semibold">Phone</p>
//                     <a href="tel:+15551234567" className="text-green-100 hover:text-white">
//                       602-793-0597
//                     </a>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start">
//                   <Mail className="h-5 w-5 mr-3 text-green-300 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-semibold">Email</p>
//                     <a href="mailto:info@greenscapes.com" className="text-green-100 hover:text-white">
//                       grochin2@gmail.com
//                     </a>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start">
//                   <MapPin className="h-5 w-5 mr-3 text-green-300 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-semibold">Address</p>
//                     <address className="not-italic text-green-100">
//                       9719 E Clinton St,<br/> 
//                       Scottsdale, AZ 85260.
//                     </address>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
//                 <ul className="space-y-1 text-green-100">
//                   <li>Monday - Friday: 7:00 AM - 5:30 PM</li>
//                   <li>Saturday: 7:00 AM - 3:00 PM</li>
//                   <li>Sunday: Closed</li>
//                 </ul>
//               </div>
//             </div>
            
//             {/* Right Column - Contact Form */}
//             <div className="p-8 lg:p-12">
//               <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="firstName" className="block text-gray-700 mb-1 text-sm">First Name</label>
//                     <input 
//                       type="text" 
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label htmlFor="lastName" className="block text-gray-700 mb-1 text-sm">Last Name</label>
//                     <input 
//                       type="text" 
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="email" className="block text-gray-700 mb-1 text-sm">Email</label>
//                     <input 
//                       type="email" 
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label htmlFor="phone" className="block text-gray-700 mb-1 text-sm">Phone</label>
//                     <input 
//                       type="tel" 
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label htmlFor="service" className="block text-gray-700 mb-1 text-sm">Service Interested In</label>
//                   <select 
//                     id="service"
//                     name="service"
//                     value={formData.service}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                     required
//                   >
//                     <option value="">Select a service</option>
//                     <option value="palm-trimming">Palm Trimming</option>
//                     <option value="tree-trimming">Tree Trimming</option>
//                     <option value="palm-skinning">Palm Skinning</option>
//                     <option value="paver-grass">Paver Grass</option>
//                     <option value="landscape-design">Landscape Design</option>
//                     <option value="irrigation-systems">Irrigation Systems</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label htmlFor="message" className="block text-gray-700 mb-1 text-sm">Message</label>
//                   <textarea 
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                     required
//                   ></textarea>
//                 </div>
                
//                 <button 
//                   type="submit"
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-300 text-sm"
//                 >
//                   Submit Request
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactForm; 




"use client";

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';

const ContactForm = () => {
  const { tenant, tenantConfig, getTenantApiClient } = useTenant();
  const [contactInfo, setContactInfo] = useState({
    phone: '602-793-0597',
    email: 'grochin2@gmail.com',
    address: '9719 E Clinton St, Scottsdale, AZ 85260',
    businessHours: [
      'Monday - Friday: 7:00 AM - 5:30 PM',
      'Saturday: 7:00 AM - 3:00 PM',
      'Sunday: Closed'
    ]
  });
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  // Fetch tenant info on component mount
  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const apiClient = getTenantApiClient();
        const response = await apiClient.get('/public/contact-info');

        const data = response.data;
        if (data.success) {
          setContactInfo({
            phone: data.data?.phone || tenantConfig?.businessPhone || '602-793-0597',
            email: data.data?.email || tenantConfig?.businessEmail || 'grochin2@gmail.com',
            address: data.data?.address || tenantConfig?.address || '9719 E Clinton St, Scottsdale, AZ 85260',
            businessHours: (
              Array.isArray(data.data?.businessHours)
                ? data.data.businessHours
                : (
                    data.data?.businessHours
                      ? String(data.data.businessHours).split('\n')
                      : [
                          'Monday - Friday: 7:00 AM - 5:30 PM',
                          'Saturday: 7:00 AM - 3:00 PM',
                          'Sunday: Closed'
                        ]
                  )
            )
          });
        }
      } catch (error) {
        console.error('Error fetching tenant info:', error);
        // Fallback to default values if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantInfo();
  }, [tenant?.subdomain, tenantConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Domain': tenant?.subdomain || '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Your message has been sent successfully!');
      } else {
        alert('There was an issue sending your message.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }

    // Reset the form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen pt-24 pb-12 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Contact Information */}
            <div className="bg-green-700 p-8 lg:p-12 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Transform Your Outdoor Space?</h2>
              <p className="mb-6 text-green-100">
                Get in touch with us today to discuss your landscaping needs and receive a free consultation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-green-100 hover:text-white">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-green-100 hover:text-white">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <address className="not-italic text-green-100">
                      {contactInfo.address}
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                <ul className="space-y-1 text-green-100">
                  {contactInfo.businessHours.map((hours, index) => (
                    <li key={index}>{hours}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Right Column - Contact Form */}
            <div className="p-8 lg:p-12">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-1 text-sm">First Name</label>
                    <input 
                      type="text" 
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-1 text-sm">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1 text-sm">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1 text-sm">Phone</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-gray-700 mb-1 text-sm">Service Interested In</label>
                  <select 
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="palm-trimming">Palm Trimming</option>
                    <option value="tree-trimming">Tree Trimming</option>
                    <option value="palm-skinning">Palm Skinning</option>
                    <option value="paver-grass">Paver Grass</option>
                    <option value="landscape-design">Landscape Design</option>
                    <option value="irrigation-systems">Irrigation Systems</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-1 text-sm">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-300 text-sm"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
