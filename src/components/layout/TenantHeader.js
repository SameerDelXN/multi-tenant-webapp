// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import {usePathname, useRouter } from 'next/navigation';
// import { useTenant } from '../../contexts/TenantContext';
// import { useDashboard } from '../../contexts/DashboardContext';
// import Link from 'next/link';
// import { 
//   User, LogOut, Settings, ChevronDown, ChevronRight 
// } from 'lucide-react';

// export default function TenantHeader() {
//   const { tenantConfig, isLoading, error, isClient } = useTenant();
//   const { userData, logout } = useDashboard();
//     const [scrolled, setScrolled] = useState(false);
//      const pathname = usePathname();
//      const router = useRouter();
//      const [activeNavItem, setActiveNavItem] = useState('/');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   // Handle clicks outside dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//    useEffect(() => {
//     setActiveNavItem(pathname);
    
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [pathname]);

//   const handleLogout = () => {
//     logout();
//     setShowDropdown(false);
//   };

//   // Helper function to get dashboard path based on role
//   const getDashboardPath = (role) => {
//     switch(role) {
//       case 'admin':
//         return '/admin';
//       case 'professional':
//         return '/professional';
//       case 'customer':
//         return '/customers';
//         case 'tenantAdmin':
//         return '/admin';
//       default:
//         return '/';
//     }
//   };



//   const handleBookNowClick = (e) => {
//     e.preventDefault();
//     const token = userData?.token;
//     const role = userData?.role || '';
//     if (token && role === 'customer') {
//       router.push('/services');
//     } else {
//       router.push('/login?redirect=/booking');
//     }
//   };

//   // Show loading state until client-side hydration is complete
//   if (!isClient || isLoading) {
//     return (
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
//             <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   if (error) {
//     return (
//       <header className="bg-red-50 border-b border-red-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="text-red-800">
//               <strong>Error:</strong> {error}
//             </div>
//             <Link 
//               href={process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000'}
//               className="text-red-600 hover:text-red-800 underline"
//             >
//               Go to Main Site
//             </Link>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   // If no tenant config, show default header
//   if (!tenantConfig) {
//     return (
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">
//                   Landscaping Services
//                 </h1>
//               </div>
//             </div>

//             <nav className="hidden md:flex space-x-8">
//               <Link 
//                 href="/" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Home
//               </Link>
//               <Link 
//                 href="/services" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Services
//               </Link>
//               <Link 
//                 href="/gallery" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Gallery
//               </Link>
//               <Link 
//                 href="/contact" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Contact
//               </Link>
//             </nav>

 
           
//             <div className="flex items-center space-x-2">
//               <Link
//                 href="/login"
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Login
//               </Link>
//               {/* <Link
//                 href="/signup"
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
//               >
//                 Sign Up
//               </Link> */}

// <div className="hidden md:block">
//   <button
//     onClick={handleBookNowClick}
//     className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
//   >
//     Book Now
//   </button>
// </div>
              

              
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white shadow-sm border-b">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Tenant Branding */}
//           <div className="flex items-center space-x-4">
//             {tenantConfig?.logo && (
//               <img 
//                 src={tenantConfig.logo} 
//                 alt={`${tenantConfig.name} logo`}
//                 className="h-8 w-auto"
//               />
//             )}
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {tenantConfig?.name || 'Landscaping Services'}
//               </h1>
//               {tenantConfig?.businessPhone && (
//                 <p className="text-sm text-gray-500">
//                   {tenantConfig.businessPhone}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             <Link 
//               href="/" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Home
//             </Link>
//             <Link 
//               href="/services" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Services
//             </Link>
//             <Link 
//               href="/gallery" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Gallery
//             </Link>
//             <Link 
//               href="/contact" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Contact
//             </Link>
//           </nav>




//           {/* <div className="hidden md:block">
//                 <button
//                   onClick={handleBookNowClick}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                     scrolled || pathname !== '/' 
//                       ? 'bg-green-600 text-white hover:bg-green-700' 
//                       : 'bg-white text-green-700 hover:bg-green-50'
//                   }`}
//                 >
//                   Book Now
//                 </button>
//               </div> */}

//           {/* User Menu */}
//           <div className="flex items-center space-x-4">
//            <div className="hidden md:block">
//   <button
//     onClick={handleBookNowClick}
//     className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
//   >
//     Book Now
//   </button>
// </div>
//             {userData ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button 
//                   onClick={toggleDropdown}
//                   className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100"
//                   aria-label="Open user menu"
//                 >
//                   {userData.profileImage ? (
//                     <img 
//                       src={userData.profileImage} 
//                       alt="Profile" 
//                       className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
//                       <User className="w-4 h-4" />
//                     </div>
//                   )}
//                   <ChevronDown className="w-4 h-4 text-gray-500" />
//                 </button>
                
//                 {showDropdown && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
//                       <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
//                     </div>
                    
//                     <div className="py-1">
//                       <Link 
//                         href={getDashboardPath(userData?.role)} 
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <User className="w-4 h-4 mr-3 text-gray-500" />
//                         Profile
//                       </Link>
//                       <Link 
//                         href={`${getDashboardPath(userData?.role)}/settings`} 
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <Settings className="w-4 h-4 mr-3 text-gray-500" />
//                         Settings
//                       </Link>
//                       <div className="h-px bg-gray-100 my-1"></div>
//                       <button 
//                         onClick={handleLogout}
//                         className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         <LogOut className="w-4 h-4 mr-3" />
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link
//                   href="/login"
//                   className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Login
//                 </Link>
                

//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }












// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useTenant } from '../../contexts/TenantContext';
// import { useDashboard } from '../../contexts/DashboardContext';
// import Link from 'next/link';
// import { 
//   User, LogOut, Settings, ChevronDown, ChevronRight, Languages 
// } from 'lucide-react';

// export default function TenantHeader() {
//   const { tenantConfig, isLoading, error, isClient } = useTenant();
//   const { userData, logout } = useDashboard();
//   const [scrolled, setScrolled] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const [activeNavItem, setActiveNavItem] = useState('/');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const dropdownRef = useRef(null);
//   const languageDropdownRef = useRef(null);
//   const translateElementRef = useRef(null);
//   const [translateInitialized, setTranslateInitialized] = useState(false);

//   // Handle clicks outside dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//       if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
//         setShowLanguageDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Initialize Google Translate with better error handling
//   useEffect(() => {
//     let observer = null;
//     let isInitialized = false;
//     let timeoutId = null;

//     const initGoogleTranslate = () => {
//       if (window.google && window.google.translate && !isInitialized) {
//         isInitialized = true;
        
//         // Clear any existing timeout
//         if (timeoutId) {
//           clearTimeout(timeoutId);
//         }
        
//         timeoutId = setTimeout(() => {
//           try {
//             const selectField = document.querySelector('.goog-te-combo');
//             if (selectField) {
//               // Set initial language
//               setCurrentLanguage(selectField.value || 'en');
//               setTranslateInitialized(true);
              
//               // Wrap observer in try-catch to prevent errors
//               observer = new MutationObserver((mutations) => {
//                 try {
//                   mutations.forEach((mutation) => {
//                     if (mutation.type === 'childList' || mutation.type === 'attributes') {
//                       const currentSelectField = document.querySelector('.goog-te-combo');
//                       if (currentSelectField && currentSelectField.value !== currentLanguage) {
//                         setCurrentLanguage(currentSelectField.value);
//                       }
//                     }
//                   });
//                 } catch (observerError) {
//                   console.warn('Google Translate observer error:', observerError);
//                 }
//               });
              
//               // Observe changes more carefully
//               const translateElement = document.getElementById('google_translate_element');
//               if (translateElement && observer) {
//                 try {
//                   observer.observe(translateElement, { 
//                     childList: true, 
//                     subtree: true,
//                     attributes: true
//                   });
//                 } catch (observeError) {
//                   console.warn('Failed to set up Google Translate observer:', observeError);
//                 }
//               }
//             }
//           } catch (initError) {
//             console.error('Google Translate initialization error:', initError);
//             setTranslateInitialized(false);
//           }
//         }, 1000); // Increased delay for better stability
//       }
//     };
    
//     // Try to initialize immediately if available
//     initGoogleTranslate();
    
//     // Set up polling with better error handling
//     let attempts = 0;
//     const maxAttempts = 50;
//     const timer = setInterval(() => {
//       attempts++;
//       try {
//         if (window.google && window.google.translate && !isInitialized) {
//           initGoogleTranslate();
//           clearInterval(timer);
//         } else if (attempts >= maxAttempts) {
//           clearInterval(timer);
//           console.warn('Google Translate failed to load after 5 seconds');
//           setTranslateInitialized(false);
//         }
//       } catch (pollingError) {
//         console.error('Error during Google Translate polling:', pollingError);
//         clearInterval(timer);
//       }
//     }, 100);
    
//     return () => {
//       clearInterval(timer);
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//       if (observer) {
//         try {
//           observer.disconnect();
//         } catch (disconnectError) {
//           console.warn('Error disconnecting observer:', disconnectError);
//         }
//       }
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const toggleLanguageDropdown = () => {
//     setShowLanguageDropdown(!showLanguageDropdown);
//   };

//   useEffect(() => {
//     setActiveNavItem(pathname);
    
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [pathname]);

//   const handleLogout = () => {
//     logout();
//     setShowDropdown(false);
//   };

//   // Helper function to get dashboard path based on role
//   const getDashboardPath = (role) => {
//     switch(role) {
//       case 'admin':
//         return '/admin';
//       case 'professional':
//         return '/professional';
//       case 'customer':
//         return '/customers';
//       case 'tenantAdmin':
//         return '/admin';
//       default:
//         return '/';
//     }
//   };

//   const handleBookNowClick = (e) => {
//     e.preventDefault();
//     const token = userData?.token;
//     const role = userData?.role || '';
//     if (token && role === 'customer') {
//       router.push('/services');
//     } else {
//       router.push('/login?redirect=/booking');
//     }
//   };

//   // Enhanced Google Translate language change with error handling
// const changeLanguage = (langCode) => {
//   try {
//     const selectField = document.querySelector('.goog-te-combo');
//     if (selectField) {
//       selectField.value = langCode;
//       // Use a custom event to avoid DOM conflicts
//       const event = new Event('change', { bubbles: true });
//       selectField.dispatchEvent(event);
//       setCurrentLanguage(langCode);
//       setShowLanguageDropdown(false);
//     }
//   } catch (error) {
//     console.warn('Language change error:', error);
//   }
// };

//   const getLanguageName = (code) => {
//     const languages = {
//       en: 'English',
//       es: 'Español',
//       hi: 'हिन्दी',
//     };
//     return languages[code] || code;
//   };

//   // Show loading state until client-side hydration is complete
//   if (!isClient || isLoading) {
//     return (
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
//             <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   if (error) {
//     return (
//       <header className="bg-red-50 border-b border-red-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="text-red-800">
//               <strong>Error:</strong> {error}
//             </div>
//             <Link 
//               href={process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000'}
//               className="text-red-600 hover:text-red-800 underline"
//             >
//               Go to Main Site
//             </Link>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   // If no tenant config, show default header
//   if (!tenantConfig) {
//     return (
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">
//                   Landscaping Services
//                 </h1>
//               </div>
//             </div>

//             <nav className="hidden md:flex space-x-8">
//               <Link 
//                 href="/" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Home
//               </Link>
//               <Link 
//                 href="/services" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Services
//               </Link>
//               <Link 
//                 href="/gallery" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Gallery
//               </Link>
//               <Link 
//                 href="/contact" 
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Contact
//               </Link>
//             </nav>

//             <div className="flex items-center space-x-2">
//               <Link
//                 href="/login"
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Login
//               </Link>
//               <div className="hidden md:block">
//                 <button
//                   onClick={handleBookNowClick}
//                   className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white shadow-sm border-b">
//       {/* Google Translate Element (hidden with better isolation) */}
//       <div 
//         ref={translateElementRef}
//         id="google_translate_element" 
//         style={{
//           display: 'none',
//           position: 'absolute',
//           left: '-9999px',
//           top: '-9999px',
//           visibility: 'hidden'
//         }}
//       ></div>
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Tenant Branding */}
//           <div className="flex items-center space-x-4">
//             {tenantConfig?.logo && (
//               <img 
//                 src={tenantConfig.logo} 
//                 alt={`${tenantConfig.name} logo`}
//                 className="h-8 w-auto"
//               />
//             )}
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {tenantConfig?.name || 'Landscaping Services'}
//               </h1>
//               {tenantConfig?.businessPhone && (
//                 <p className="text-sm text-gray-500">
//                   {tenantConfig.businessPhone}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             <Link 
//               href="/" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Home
//             </Link>
//             <Link 
//               href="/services" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Services
//             </Link>
//             <Link 
//               href="/gallery" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Gallery
//             </Link>
//             <Link 
//               href="/contact" 
//               className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//             >
//               Contact
//             </Link>
//           </nav>

//           {/* User Menu */}
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:block">
//               <button
//                 onClick={handleBookNowClick}
//                 className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
//               >
//                 Book Now
//               </button>
//             </div>
            
//             {/* Language Selector - Only show if initialized */}
//             {translateInitialized && (
//               <div className="relative" ref={languageDropdownRef}>
//                 <button 
//                   onClick={toggleLanguageDropdown}
//                   className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 text-gray-700"
//                   aria-label="Change language"
//                 >
//                   <span className="text-sm hidden sm:inline">
//                     {getLanguageName(currentLanguage)}
//                   </span>
//                   <ChevronDown className="w-4 h-4" />
//                 </button>
                
//                 {showLanguageDropdown && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
//                     <button 
//                       onClick={() => changeLanguage('en')}
//                       className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
//                         currentLanguage === 'en' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
//                       }`}
//                     >
//                       English
//                     </button>
//                     <button 
//                       onClick={() => changeLanguage('es')}
//                       className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
//                         currentLanguage === 'es' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
//                       }`}
//                     >
//                       Español
//                     </button>
//                     <button 
//                       onClick={() => changeLanguage('hi')}
//                       className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
//                         currentLanguage === 'hi' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
//                       }`}
//                     >
//                       हिन्दी
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {userData ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button 
//                   onClick={toggleDropdown}
//                   className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100"
//                   aria-label="Open user menu"
//                 >
//                   {userData.profileImage ? (
//                     <img 
//                       src={userData.profileImage} 
//                       alt="Profile" 
//                       className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
//                       <User className="w-4 h-4" />
//                     </div>
//                   )}
//                   <ChevronDown className="w-4 h-4 text-gray-500" />
//                 </button>
                
//                 {showDropdown && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
//                       <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
//                     </div>
                    
//                     <div className="py-1">
//                       <Link 
//                         href={getDashboardPath(userData?.role)} 
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <User className="w-4 h-4 mr-3 text-gray-500" />
//                         Profile
//                       </Link>
//                       <Link 
//                         href={`${getDashboardPath(userData?.role)}/settings`} 
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <Settings className="w-4 h-4 mr-3 text-gray-500" />
//                         Settings
//                       </Link>
//                       <div className="h-px bg-gray-100 my-1"></div>
//                       <button 
//                         onClick={handleLogout}
//                         className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         <LogOut className="w-4 h-4 mr-3" />
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link
//                   href="/login"
//                   className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//                 >
//                   Login
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTenant } from '../../contexts/TenantContext';
import { useDashboard } from '../../contexts/DashboardContext';
import Link from 'next/link';
import { 
  User, LogOut, Settings, ChevronDown, ChevronRight, Languages 
} from 'lucide-react';

export default function TenantHeader() {
  const { tenantConfig, isLoading, error, isClient } = useTenant();
  const { userData, logout } = useDashboard();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState('/');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const [translateInitialized, setTranslateInitialized] = useState(false);
  const [translateLoadAttempts, setTranslateLoadAttempts] = useState(0);

  // Add Google Translate CSS styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
      }
      
      .goog-te-menu-frame {
        z-index: 1000 !important;
      }
      
      body {
        top: 0 !important;
        position: static !important;
      }
      
      .goog-tooltip {
        display: none !important;
      }
      
      .goog-tooltip:hover {
        display: none !important;
      }
      
      .goog-text-highlight {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      #google_translate_element {
        display: none;
      }
      
      .goog-te-gadget {
        display: none !important;
      }
      
      .goog-te-combo {
        display: none !important;
      }
      
      .skiptranslate {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style && document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load Google Translate script
  useEffect(() => {
    // Only try to load if not already loaded
    if (!window.google || !window.google.translate) {
      const scriptId = 'google-translate-script';
      
      // Check if script already exists
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        
        document.head.appendChild(script);
      }
      
      // Define the callback function
      window.googleTranslateElementInit = () => {
        console.log('Google Translate script loaded');
        initGoogleTranslate();
      };
    } else {
      // If already loaded, initialize directly
      initGoogleTranslate();
    }
  }, []);

  // Simplified Google Translate initialization
  const initGoogleTranslate = () => {
    try {
      // Create the translate element if it doesn't exist
      if (!document.getElementById('google_translate_element')) {
        const translateElement = document.createElement('div');
        translateElement.id = 'google_translate_element';
        translateElement.style.display = 'none';
        document.body.appendChild(translateElement);
      }

      // Initialize Google Translate with simpler options
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,hi',
        layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
      }, 'google_translate_element');

      setTranslateInitialized(true);
      console.log('Google Translate initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Translate:', error);
      setTranslateInitialized(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  useEffect(() => {
    setActiveNavItem(pathname);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin':
        return '/admin';
      case 'professional':
        return '/professional';
      case 'customer':
        return '/customers';
      case 'tenantAdmin':
        return '/admin';
      default:
        return '/';
    }
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    const token = userData?.token;
    const role = userData?.role || '';
    if (token && role === 'customer') {
      router.push('/services');
    } else {
      router.push('/login?redirect=/booking');
    }
  };


// const handleBookNowClick = (e) => {
//   e.preventDefault();
//   const token = userData?.token;
//   const role = userData?.role || '';
  
//   // Allow both customers and tenantAdmin to book now
//   if (token && (role === 'customer' || role === 'tenantAdmin')) {
//     router.push('/services');
//   } else {
//     router.push('/login?redirect=/booking');
//   }
// };



  // Enhanced Google Translate language change with error handling
  // CORRECT language change function
  const changeLanguage = (langCode) => {
    try {
      // Method 1: Use the Google Translate select element directly
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        selectField.value = langCode;
        
        // Create and dispatch the change event properly
        const event = new Event('change', { 
          bubbles: true,
          cancelable: true 
        });
        
        // Set the value first, then dispatch event
        selectField.value = langCode;
        selectField.dispatchEvent(event);
        
        // Also try to trigger Google's internal change handler
        if (selectField.onchange) {
          selectField.onchange(event);
        }
        
        setCurrentLanguage(langCode);
        setShowLanguageDropdown(false);
        return;
      }
      
      // Method 2: Use iframe approach (Google Translate uses iframes)
      const iframe = document.querySelector('.goog-te-menu-frame');
      if (iframe && iframe.contentWindow) {
        try {
          const select = iframe.contentWindow.document.querySelector('.goog-te-combo');
          if (select) {
            select.value = langCode;
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
            setCurrentLanguage(langCode);
            setShowLanguageDropdown(false);
            return;
          }
        } catch (e) {
          console.log('Could not access iframe content:', e);
        }
      }
      
      // Method 3: Use Google's API correctly
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        try {
          // Get the instance properly
          const translateElement = document.getElementById('google_translate_element');
          if (translateElement) {
            // This is the correct way to trigger translation
            const frame = document.querySelector('.goog-te-banner-frame');
            if (frame && frame.contentWindow) {
              frame.contentWindow.postMessage({
                command: 'translate',
                lang: langCode
              }, '*');
            }
            
            setCurrentLanguage(langCode);
            setShowLanguageDropdown(false);
            return;
          }
        } catch (e) {
          console.log('Google API method failed:', e);
        }
      }
      
      // Method 4: Fallback - use cookie approach (Google Translate respects this)
      document.cookie = `googtrans=/en/${langCode}; path=/; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`;
      window.location.reload();
      
    } catch (error) {
      console.error('Language change error:', error);
      
      // Ultimate fallback - redirect with language parameter
      window.location.href = `${window.location.pathname}?hl=${langCode}`;
    }
  };

  const getLanguageName = (code) => {
    const languages = {
      en: 'English',
      es: 'Español',
      hi: 'हिन्दी',
    };
    return languages[code] || code;
  };

  // Show loading state until client-side hydration is complete
  if (!isClient || isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <Link 
              href={process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000'}
              className="text-red-600 hover:text-red-800 underline"
            >
              Go to Main Site
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // If no tenant config, show default header
  if (!tenantConfig) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {tenantConfig?.name || 'Business Name'}
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/services" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Services
              </Link>
              <Link 
                href="/gallery" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Gallery
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <div className="hidden md:block">
                <button
                  onClick={handleBookNowClick}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
              
              {/* Language dropdown for default header too */}
              {translateInitialized && (
                <div className="relative" ref={languageDropdownRef}>
                  <button 
                    onClick={toggleLanguageDropdown}
                    className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 text-gray-700"
                    aria-label="Change language"
                  >
                    <Languages className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">
                      {getLanguageName(currentLanguage)}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showLanguageDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button 
                        onClick={() => changeLanguage('en')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          currentLanguage === 'en' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => changeLanguage('es')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          currentLanguage === 'es' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        Español
                      </button>
                      <button 
                        onClick={() => changeLanguage('hi')}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          currentLanguage === 'hi' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        हिन्दी
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Tenant Branding */}
          <div className="flex items-center space-x-4">
            {tenantConfig?.logo && (
              <img 
                src={tenantConfig.logo} 
                alt={`${tenantConfig.name} logo`}
                className="h-8 w-auto"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {tenantConfig?.name || 'Business Name'}
              </h1>
              {tenantConfig?.businessPhone && (
                <p className="text-sm text-gray-500">
                  {tenantConfig.businessPhone}
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Services
            </Link>
            <Link 
              href="/gallery" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Gallery
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <button
                onClick={handleBookNowClick}
                className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
              >
                Book Now
              </button>
            </div>
            
            {/* Language Selector - Only show if initialized */}
            {translateInitialized && (
              <div className="relative" ref={languageDropdownRef}>
                <button 
                  onClick={toggleLanguageDropdown}
                  className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 text-gray-700"
                  aria-label="Change language"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">
                    {getLanguageName(currentLanguage)}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentLanguage === 'en' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => changeLanguage('es')}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentLanguage === 'es' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Español
                    </button>
                    <button 
                      onClick={() => changeLanguage('hi')}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentLanguage === 'hi' ? 'bg-gray-50 text-green-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* {!translateInitialized && (
              <div className="text-xs text-gray-400">
                Translation loading...
              </div>
            )} */}
            
            {userData ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100"
                  aria-label="Open user menu"
                >
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href={getDashboardPath(userData?.role)} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        Profile
                      </Link>
                      <Link 
                        href={`${getDashboardPath(userData?.role)}/settings`} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-500" />
                        Settings
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}





// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useTenant } from '../../contexts/TenantContext';
// import { useDashboard } from '../../contexts/DashboardContext';
// import Link from 'next/link';
// import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
// import GoogleTranslate from '../GoogleTranslate';
// import LanguageSelector from '../LanguageSelector';

// export default function TenantHeader() {
//   const { tenantConfig, isLoading, error, isClient } = useTenant();
//   const { userData, logout } = useDashboard();
//   const [scrolled, setScrolled] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const [activeNavItem, setActiveNavItem] = useState('/');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [translateInitialized, setTranslateInitialized] = useState(false);
//   const dropdownRef = useRef(null);

//   // Handle clicks outside dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   useEffect(() => {
//     setActiveNavItem(pathname);
    
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [pathname]);

//   const handleLogout = () => {
//     logout();
//     setShowDropdown(false);
//   };

//   const getDashboardPath = (role) => {
//     switch(role) {
//       case 'admin': return '/admin';
//       case 'professional': return '/professional';
//       case 'customer': return '/customers';
//       case 'tenantAdmin': return '/admin';
//       default: return '/';
//     }
//   };

//   const handleBookNowClick = (e) => {
//     e.preventDefault();
//     const token = userData?.token;
//     const role = userData?.role || '';
//     if (token && role === 'customer') {
//       router.push('/services');
//     } else {
//       router.push('/login?redirect=/booking');
//     }
//   };

//   const handleLanguageChange = (langCode) => {
//     setCurrentLanguage(langCode);
//   };

//   const handleTranslateInitialized = () => {
//     setTranslateInitialized(true);
//   };

//   // Show loading state
//   if (!isClient || isLoading) {
//     return (
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
//             <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   if (error) {
//     return (
//       <header className="bg-red-50 border-b border-red-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="text-red-800">
//               <strong>Error:</strong> {error}
//             </div>
//             <Link 
//               href={process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000'}
//               className="text-red-600 hover:text-red-800 underline"
//             >
//               Go to Main Site
//             </Link>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   if (!tenantConfig) {
//     return (
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">
//                   Landscaping Services
//                 </h1>
//               </div>
//             </div>

//             <nav className="hidden md:flex space-x-8">
//               <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
//               <Link href="/services" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Services</Link>
//               <Link href="/gallery" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Gallery</Link>
//               <Link href="/contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
//             </nav>

//             <div className="flex items-center space-x-2">
//               <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
//               <div className="hidden md:block">
//                 <button onClick={handleBookNowClick} className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300">Book Now</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white shadow-sm border-b">
//       {/* Google Translate Component (handles all the DOM manipulation) */}
//       <GoogleTranslate 
//         onLanguageChange={handleLanguageChange}
//         onInitialized={handleTranslateInitialized}
//       />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Tenant Branding */}
//           <div className="flex items-center space-x-4">
//             {tenantConfig?.logo && (
//               <img src={tenantConfig.logo} alt={`${tenantConfig.name} logo`} className="h-8 w-auto" />
//             )}
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {tenantConfig?.name || 'Landscaping Services'}
//               </h1>
//               {tenantConfig?.businessPhone && (
//                 <p className="text-sm text-gray-500">{tenantConfig.businessPhone}</p>
//               )}
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="hidden md:flex space-x-8">
//             <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
//             <Link href="/services" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Services</Link>
//             <Link href="/gallery" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Gallery</Link>
//             <Link href="/contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
//           </nav>

//           {/* User Menu */}
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:block">
//               <button onClick={handleBookNowClick} className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300">Book Now</button>
//             </div>
            
//             {/* Language Selector */}
//             <LanguageSelector 
//               onLanguageChange={handleLanguageChange}
//               currentLanguage={currentLanguage}
//               isTranslateInitialized={translateInitialized}
//             />
            
//             {userData ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100" aria-label="Open user menu">
//                   {userData.profileImage ? (
//                     <img src={userData.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
//                       <User className="w-4 h-4" />
//                     </div>
//                   )}
//                   <ChevronDown className="w-4 h-4 text-gray-500" />
//                 </button>
                
//                 {showDropdown && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
//                       <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
//                     </div>
                    
//                     <div className="py-1">
//                       <Link href={getDashboardPath(userData?.role)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                         <User className="w-4 h-4 mr-3 text-gray-500" />Profile
//                       </Link>
//                       <Link href={`${getDashboardPath(userData?.role)}/settings`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                         <Settings className="w-4 h-4 mr-3 text-gray-500" />Settings
//                       </Link>
//                       <div className="h-px bg-gray-100 my-1"></div>
//                       <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
//                         <LogOut className="w-4 h-4 mr-3" />Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }