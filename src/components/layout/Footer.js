// import React from 'react';
// import Link from 'next/link';
// import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="container mx-auto px-4 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Brand and Social Icons */}
//           <div>
//             <h3 className="text-2xl font-bold mb-4 text-green-600 hover:text-green-500 transition-colors duration-300">Gildardo Rochin</h3>
//             <p className="text-gray-400 mb-6 hover:text-green-100 transition-colors duration-300">
//               Professional landscaping services to transform your outdoor space into a beautiful and functional environment.
//             </p>
//             <div className="flex space-x-4">
//               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
//                 <Facebook size={20} />
//               </a>
//               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
//                 <Twitter size={20} />
//               </a>
//               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
//                 <Instagram size={20} />
//               </a>
//               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
//                 <Linkedin size={20} />
//               </a>
//             </div>
//           </div>
          
//           {/* Services Links */}
//           <div>
//             <h4 className="text-lg font-semibold mb-6 hover:text-green-500 transition-colors duration-300">Our Services</h4>
//             <ul className="space-y-3">
//               <li>
//                 <Link href="/services/palm-trimming" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Palm Trimming
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/services/tree-trimming" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Tree Trimming
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/services/palm-skinning" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Palm Skinning
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/services/paver-grass" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Paver Grass
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/services/landscape-design" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Landscape Design
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/services/irrigation-systems" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Irrigation Systems
//                 </Link>
//               </li>
//             </ul>
//           </div>
          
//           {/* Company Links */}
//           <div>
//             <h4 className="text-lg font-semibold mb-6 hover:text-green-500 transition-colors duration-300">Company</h4>
//             <ul className="space-y-3">
//               <li>
//                 <Link href="/about" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/gallery" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Projects
//                 </Link>
//               </li>
//               {/* <li>
//                 <Link href="/testimonials" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Testimonials
//                 </Link>
//               </li> */}
//               <li>
//                 <Link href="/careers" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Careers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/faq" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   FAQ
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>
          
//           {/* Contact Info */}
//           <div>
//             <h4 className="text-lg font-semibold mb-6 hover:text-green-500 transition-colors duration-300">Contact Us</h4>
//             <ul className="space-y-3">
//               <li className="flex items-start group">
//                 <span className="text-gray-400 group-hover:text-green-500 transition-colors duration-300">
//                   Office Address: 9719 E Clinton St<br/> Scottsdale, AZ 85260.
//                 </span>
//               </li>
//               <li className="flex items-center group">
//                 <span className="text-gray-400 group-hover:text-green-500 transition-colors duration-300">
//                   602-793-0597
//                 </span>
//               </li>
//               <li className="flex items-center group">
//                 <span className="text-gray-400 group-hover:text-green-500 transition-colors duration-300">
//                   grochin2@gmail.com
//                 </span>
//               </li>
//               <li className="flex items-center group">
//                 <span className="text-gray-400 group-hover:text-green-500 transition-colors duration-300">
//                   Mon-Fri: 7:00 AM - 5:30 PM
//                 </span>
//               </li>
//               <li className="flex items-center group">
//                 <span className="text-gray-400 group-hover:text-green-500 transition-colors duration-300">
//                   Sat: 7:00 AM - 3:00 PM
//                 </span>
//               </li>
//                <li className="flex items-center group">
//                 <span className="text-gray-400 group-hover:text-green-500 transition-colors duration-300">
//                   Sun: Closed
//                 </span>
//                 </li>
//             </ul>
//           </div>
//         </div>
//       </div>
      
//       {/* Bottom Bar */}
//       <div className="bg-gray-950 py-4">
//         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
//           <p className="text-gray-500 text-sm mb-4 md:mb-0 hover:text-green-500 transition-colors duration-300">
//             Â© {new Date().getFullYear()} Gildardo Rochin. All rights reserved.
//           </p>
//           <div className="flex space-x-6">
//             <Link href="/privacy-policy" className="text-gray-500 hover:text-green-500 text-sm transition-colors duration-300">
//               Privacy Policy
//             </Link>
//             <Link href="/terms-of-service" className="text-gray-500 hover:text-green-500 text-sm transition-colors duration-300">
//               Terms of Service
//             </Link>
//             <Link href="/sitemap" className="text-gray-500 hover:text-green-500 text-sm transition-colors duration-300">
//               Sitemap
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';

const Footer = () => {
  const { tenant, tenantConfig, getTenantApiClient } = useTenant();
  const [contactInfo, setContactInfo] = useState({
    businessName: '',
    phone: '602-793-0597',
    email: 'grochin2@gmail.com',
    address: '9719 E Clinton St, Scottsdale, AZ 85260',
    businessHours: [
      'Monday - Friday: 7:00 AM - 5:30 PM',
      'Saturday: 7:00 AM - 3:00 PM',
      'Sunday: Closed'
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        

        const apiClient = getTenantApiClient();
        const response = await apiClient.get('/public/contact-info');

        const data = response.data;
        if (data.success) {
          setContactInfo({
            businessName: (data.data?.businessName || data.data?.name || tenantConfig?.name || ''),
            phone: data.data?.phone || tenantConfig?.businessPhone || '602-793-0597',
            email: data.data?.email || tenantConfig?.businessEmail || 'grochin2@gmail.com',
            address: data.data?.address || tenantConfig?.address || '9719 E Clinton St, Scottsdale, AZ 85260',
            businessHours: (Array.isArray(data.data?.businessHours) ? data.data.businessHours : (data.data?.businessHours ? String(data.data.businessHours).split('\\n') : null)) || [
              'Monday - Friday: 7:00 AM - 5:30 PM',
              'Saturday: 7:00 AM - 3:00 PM',
              'Sunday: Closed'
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching tenant info:', error);
        // Fallback to default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchTenantInfo();
  }, []);

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          Loading contact information...
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Social Icons */}
          <div>
            {contactInfo.businessName && (
              <h3 className="text-2xl font-bold mb-4 text-green-600 hover:text-green-500 transition-colors duration-300">{contactInfo.businessName}</h3>
            )}
            <p className="text-gray-400 mb-6 hover:text-green-100 transition-colors duration-300">
              Professional landscaping services to transform your outdoor space into a beautiful and functional environment.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 hover:text-green-500 transition-colors duration-300">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Palm Trimming
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Tree Trimming
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Palm Skinning
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Paver Grass
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Landscape Design
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Irrigation Systems
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 hover:text-green-500 transition-colors duration-300">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-500 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 hover:text-green-500 transition-colors duration-300">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-300">Address</p>
                  <address className="not-italic text-gray-400 hover:text-green-100 transition-colors duration-300">
                    {contactInfo.address}
                  </address>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-300">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-gray-400 hover:text-green-100 transition-colors duration-300">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-300">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-gray-400 hover:text-green-100 transition-colors duration-300">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="pt-2">
                <h5 className="font-medium text-gray-300 mb-2">Business Hours</h5>
                <ul className="space-y-1 text-gray-400">
                  {contactInfo.businessHours.map((hours, index) => (
                    <li key={index} className="hover:text-green-100 transition-colors duration-300">
                      {hours}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0 hover:text-green-500 transition-colors duration-300">
            Â© {new Date().getFullYear()} {contactInfo.businessName || 'Landscaping Services'}. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-500 hover:text-green-500 text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/" className="text-gray-500 hover:text-green-500 text-sm transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/" className="text-gray-500 hover:text-green-500 text-sm transition-colors duration-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


