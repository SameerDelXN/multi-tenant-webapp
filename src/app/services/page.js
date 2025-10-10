"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, ChevronRight, Loader2, Calendar, Clock, ArrowRight } from 'lucide-react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import apiClient from '../../lib/api/apiClient';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../../contexts/DashboardContext';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();
  const { userData } = useDashboard();

  const handleAuthAction = (path) => {
    if (userData) {
      router.push(path);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Use public aggregate services endpoint so main domain shows all tenants
        const response = await apiClient.get('/services/public');
        setServices(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchServices();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(services.map(service => service.category || 'uncategorized').filter(Boolean))];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
      <p className="text-gray-600 font-medium">Loading services...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-6">
      <div className="flex items-center mb-3">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <h3 className="text-lg font-medium text-red-800">Unable to load services</h3>
      </div>
      <p className="text-red-700 mb-4">{error}</p>
      <button
        onClick={() => {
          setLoading(true);
          setError(null);
        }}
        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderCategories = () => (
    <div className="mb-8 overflow-x-auto pb-1">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <>
      {categories.length > 1 && renderCategories()}
      
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No services found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredServices.map((service) => {
            // Extract all unique features from all packages
            const allFeatures = [
              ...new Set(
                service.packages?.flatMap(pkg => pkg.additionalFeatures || []) || []
              ),
            ];

            // Limit features display for consistent height
            const displayFeatures = allFeatures.slice(0, 3);
            const hasMoreFeatures = allFeatures.length > 3;

            return (
              <div
                key={service._id || service.id}
                className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all group h-full"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image container - fixed height */}
                  <div className="w-full md:w-2/5 lg:w-1/3 relative h-56 md:h-auto md:aspect-[5/3] overflow-hidden flex-shrink-0">
                    <img
                      src={service.image?.url || '/api/placeholder/800/600'}
                      alt={service.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {service.category && (
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {service.category}
                      </div>
                    )}
                  </div>
                  
                  {/* Content container with fixed height */}
                  <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 flex flex-col h-full md:min-h-64">
                    <div className="flex-grow">
                      <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-2 line-clamp-1">{service.name}</h2>
                      
                      {/* Description - fixed to exactly 2 lines */}
                      <div className="mb-3 h-12"> {/* Fixed height for description */}
                        <p className="text-gray-700 text-sm md:text-base line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                      
                      {/* Features section - fixed height */}
                      <div className="mb-4 h-32"> {/* Fixed height for features */}
                        <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
                          Key Features
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-sm">
                          {displayFeatures.length > 0 ? (
                            displayFeatures.map((feature, i) => (
                              <div key={i} className="flex items-start">
                                <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-1.5">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                </div>
                                <span className="text-gray-700 line-clamp-1">{feature}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic text-sm col-span-2">Contact for details</p>
                          )}
                        </div>
                        
                        {hasMoreFeatures && (
                          <div className="mt-1 text-green-600 font-medium text-xs flex items-center">
                            <span>+{allFeatures.length - 3} more features</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Service details - fixed height */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 h-5"> {/* Fixed height for details */}
                      {service.estimatedTime && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-green-600" />
                          <span>{service.estimatedTime}</span>
                        </div>
                      )}
                      {service.availability && (
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-green-600" />
                          <span>{service.availability}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action buttons - fixed height */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 h-12"> {/* Fixed height for buttons */}
                      <button onClick={() => handleAuthAction(`/booknow?serviceId=${service._id || service.id}`)} className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-1.5 px-4 rounded-md transition-colors">
                        Book Now
                      </button>
                      <button onClick={() => handleAuthAction('/contact')} className="inline-flex items-center border border-green-600 text-green-700 hover:bg-green-50 font-medium text-sm py-1.5 px-4 rounded-md transition-colors">
                        Get Quote
                      </button>
                      <Link href={`/services/${service._id || service.id}`} className="ml-auto">
                        <span className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-sm py-1 group">
                          Details
                          <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <>
      <PageHeader
        title="Professional Landscaping Services"
        description="Creating and maintaining beautiful outdoor spaces for your home or business"
        backgroundImage="/images/services-header.jpg"
      />
      
      <Container className="py-10 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">Our Expert Services</h2>
          <p className="text-base text-gray-600">
            We offer comprehensive landscaping solutions tailored to your specific needs and environment.
            From design and installation to maintenance and seasonal care, our professional team delivers 
            exceptional quality and value.
          </p>
        </div>
        
        {loading ? renderLoading() : error ? renderError() : renderServices()}
        
        <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl p-6 md:p-8 mt-12 shadow-md">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/4 text-center md:text-left mb-5 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Ready to Transform Your Outdoor Space?</h2>
              <p className="text-green-50 text-sm md:text-base max-w-2xl">
                Contact us today for a free consultation and estimate. Our experts are ready to help you
                create and maintain the landscape of your dreams.
              </p>
            </div>
            <div className="md:w-1/4 md:text-right flex justify-center md:justify-end">
              <Link href="/contact">
                <span className="inline-flex items-center bg-white text-green-800 hover:bg-green-50 font-bold py-2 px-5 rounded-lg transition-colors shadow-sm">
                  Contact Us <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}







// "use client";
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, ChevronRight, Loader2, Calendar, Clock, ArrowRight, Building2 } from 'lucide-react';
// import Container from '../../components/ui/Container';
// import PageHeader from '../../components/layout/PageHeader';
// import apiClient from '../../lib/api/apiClient';
// import { useRouter } from 'next/navigation';
// import { useDashboard } from '../../contexts/DashboardContext';

// export default function ServicesPage() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [currentTenant, setCurrentTenant] = useState(null);
//   const router = useRouter();
//   const { userData } = useDashboard();

//   // Function to extract subdomain
//   const extractSubdomain = () => {
//     if (typeof window === 'undefined') return null;
//     const host = window.location.hostname;
    
//     // For local development with subdomains (e.g., tenant.localhost:3000)
//     if (host.includes('localhost')) {
//       const parts = host.split('.');
//       if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
//         return parts[0];
//       }
//       return null;
//     }
    
//     // For production domains (e.g., tenant.example.com)
//     const parts = host.split('.');
//     if (parts.length <= 2) return null; // No subdomain (example.com)
//     if (parts[0] === 'www') return parts.length > 3 ? parts[1] : null;
//     return parts[0];
//   };

//   const handleAuthAction = (path) => {
//     if (userData) {
//       router.push(path);
//     } else {
//       router.push(`/login?redirect=${encodeURIComponent(path)}`);
//     }
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const subdomain = extractSubdomain();
//         setCurrentTenant(subdomain);
        
//         const response = await apiClient.get('/services');
//         setServices(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchServices();
//   }, []);

//   // Get unique categories
//   const categories = ['all', ...new Set(services.map(service => service.category || 'uncategorized').filter(Boolean))];

//   const filteredServices = selectedCategory === 'all' 
//     ? services 
//     : services.filter(service => service.category === selectedCategory);

//   const renderLoading = () => (
//     <div className="flex flex-col items-center justify-center py-16">
//       <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
//       <p className="text-gray-600 font-medium">Loading services...</p>
//     </div>
//   );

//   const renderError = () => (
//     <div className="bg-red-50 border border-red-200 rounded-lg p-5 my-6">
//       <div className="flex items-center mb-3">
//         <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//         <h3 className="text-lg font-medium text-red-800">Unable to load services</h3>
//       </div>
//       <p className="text-red-700 mb-4">{error}</p>
//       <button
//         onClick={() => {
//           setLoading(true);
//           setError(null);
//         }}
//         className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md transition-colors"
//       >
//         Try Again
//       </button>
//     </div>
//   );

//   const renderCategories = () => (
//     <div className="mb-8 overflow-x-auto pb-1">
//       <div className="flex space-x-2 min-w-max">
//         {categories.map(category => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-4 py-1.5 rounded-full font-medium transition-all ${
//               selectedCategory === category
//                 ? 'bg-green-600 text-white shadow-md'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             {category.charAt(0).toUpperCase() + category.slice(1)}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   const renderServices = () => (
//     <>
//       {currentTenant && (
//         <div className="flex items-center justify-center mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <Building2 className="h-5 w-5 text-blue-600 mr-2" />
//           <span className="text-blue-800 font-medium">
//             Viewing services for <span className="font-bold capitalize">{currentTenant}</span>
//           </span>
//         </div>
//       )}
      
//       {!currentTenant && (
//         <div className="flex items-center justify-center mb-6 bg-gray-100 border border-gray-200 rounded-lg p-4">
//           <Building2 className="h-5 w-5 text-gray-600 mr-2" />
//           <span className="text-gray-800 font-medium">
//             Viewing services from all providers
//           </span>
//         </div>
//       )}
      
//       {categories.length > 1 && renderCategories()}
      
//       {filteredServices.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-lg text-gray-600">No services found in this category.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6">
//           {filteredServices.map((service) => {
//             // Extract all unique features from all packages
//             const allFeatures = [
//               ...new Set(
//                 service.packages?.flatMap(pkg => pkg.additionalFeatures || []) || []
//               ),
//             ];

//             // Limit features display for consistent height
//             const displayFeatures = allFeatures.slice(0, 3);
//             const hasMoreFeatures = allFeatures.length > 3;

//             return (
//               <div
//                 key={service._id || service.id}
//                 className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all group h-full"
//               >
//                 <div className="flex flex-col md:flex-row h-full">
//                   {/* Image container - fixed height */}
//                   <div className="w-full md:w-2/5 lg:w-1/3 relative h-56 md:h-auto md:aspect-[5/3] overflow-hidden flex-shrink-0">
//                     <img
//                       src={service.image?.url || '/api/placeholder/800/600'}
//                       alt={service.name}
//                       className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
//                     />
//                     {service.category && (
//                       <div className="absolute top-3 left-3 bg-green-600 text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
//                         {service.category}
//                       </div>
//                     )}
//                     {service.tenantName && !currentTenant && (
//                       <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
//                         {service.tenantName}
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Content container with fixed height */}
//                   <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 flex flex-col h-full md:min-h-64">
//                     <div className="flex-grow">
//                       <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-2 line-clamp-1">{service.name}</h2>
                      
//                       {/* Description - fixed to exactly 2 lines */}
//                       <div className="mb-3 h-12"> {/* Fixed height for description */}
//                         <p className="text-gray-700 text-sm md:text-base line-clamp-2">
//                           {service.description}
//                         </p>
//                       </div>
                      
//                       {/* Features section - fixed height */}
//                       <div className="mb-4 h-32"> {/* Fixed height for features */}
//                         <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center">
//                           <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
//                           Key Features
//                         </h3>
                        
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-sm">
//                           {displayFeatures.length > 0 ? (
//                             displayFeatures.map((feature, i) => (
//                               <div key={i} className="flex items-start">
//                                 <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-1.5">
//                                   <CheckCircle className="h-3 w-3 text-green-600" />
//                                 </div>
//                                 <span className="text-gray-700 line-clamp-1">{feature}</span>
//                               </div>
//                             ))
//                           ) : (
//                             <p className="text-gray-500 italic text-sm col-span-2">Contact for details</p>
//                           )}
//                         </div>
                        
//                         {hasMoreFeatures && (
//                           <div className="mt-1 text-green-600 font-medium text-xs flex items-center">
//                             <span>+{allFeatures.length - 3} more features</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Service details - fixed height */}
//                     <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 h-5"> {/* Fixed height for details */}
//                       {service.estimatedTime && (
//                         <div className="flex items-center">
//                           <Clock className="h-3.5 w-3.5 mr-1 text-green-600" />
//                           <span>{service.estimatedTime}</span>
//                         </div>
//                       )}
//                       {service.availability && (
//                         <div className="flex items-center">
//                           <Calendar className="h-3.5 w-3.5 mr-1 text-green-600" />
//                           <span>{service.availability}</span>
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Action buttons - fixed height */}
//                     <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 h-12"> {/* Fixed height for buttons */}
//                       <button onClick={() => handleAuthAction(`/booknow?serviceId=${service._id || service.id}`)} className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-1.5 px-4 rounded-md transition-colors">
//                         Book Now
//                       </button>
//                       <button onClick={() => handleAuthAction('/contact')} className="inline-flex items-center border border-green-600 text-green-700 hover:bg-green-50 font-medium text-sm py-1.5 px-4 rounded-md transition-colors">
//                         Get Quote
//                       </button>
//                       <Link href={`/services/${service._id || service.id}`} className="ml-auto">
//                         <span className="inline-flex items-center text-green-700 hover:text-green-800 font-medium text-sm py-1 group">
//                           Details
//                           <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
//                         </span>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </>
//   );

//   return (
//     <>
//       <PageHeader
//         title={currentTenant ? `${currentTenant.charAt(0).toUpperCase() + currentTenant.slice(1)}'s Landscaping Services` : "Professional Landscaping Services"}
//         description={currentTenant ? 
//           `Professional landscaping services from ${currentTenant}` : 
//           "Discover landscaping services from our network of professional providers"
//         }
//         backgroundImage="/images/services-header.jpg"
//       />
      
//       <Container className="py-10 md:py-16">
//         <div className="max-w-3xl mx-auto text-center mb-10">
//           <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
//             {currentTenant ? `${currentTenant.charAt(0).toUpperCase() + currentTenant.slice(1)}'s Services` : "Our Network of Services"}
//           </h2>
//           <p className="text-base text-gray-600">
//             {currentTenant ? 
//               "Explore our comprehensive landscaping solutions tailored to your specific needs and environment." :
//               "Discover landscaping services from our network of professional providers. From design and installation to maintenance and seasonal care."
//             }
//           </p>
//         </div>
        
//         {loading ? renderLoading() : error ? renderError() : renderServices()}
        
//         <div className="bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl p-6 md:p-8 mt-12 shadow-md">
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="md:w-3/4 text-center md:text-left mb-5 md:mb-0">
//               <h2 className="text-xl md:text-2xl font-bold mb-2">Ready to Transform Your Outdoor Space?</h2>
//               <p className="text-green-50 text-sm md:text-base max-w-2xl">
//                 Contact us today for a free consultation and estimate. Our experts are ready to help you
//                 create and maintain the landscape of your dreams.
//               </p>
//             </div>
//             <div className="md:w-1/4 md:text-right flex justify-center md:justify-end">
//               <Link href="/contact">
//                 <span className="inline-flex items-center bg-white text-green-800 hover:bg-green-50 font-bold py-2 px-5 rounded-lg transition-colors shadow-sm">
//                   Contact Us <ArrowRight className="ml-1.5 h-4 w-4" />
//                 </span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// }