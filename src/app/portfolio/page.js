// 'use client';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Container from '../../components/ui/Container';
// import { toast } from 'react-hot-toast';

// export default function PortfolioPage() {
//   const [portfolios, setPortfolios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_URL}/portfolio`);
//         if (response.data.success) {
//           setPortfolios(response.data.data);
//         } else {
//           toast.error('Failed to fetch portfolios');
//         }
//       } catch (error) {
//         console.error('Error fetching portfolios:', error);
//         toast.error('Failed to fetch portfolios');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPortfolios();
//   }, []);

//   const handlePortfolioClick = (portfolio) => {
//     setSelectedPortfolio(portfolio);
//     setIsModalOpen(true);
//   };

//   return (
//     <Container>
//       <div className="py-12">
//         <h1 className="text-3xl font-bold text-center mb-8">Our Portfolio</h1>
        
//         {loading ? (
//           <div className="text-center py-8">Loading...</div>
//         ) : portfolios.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">No portfolio items found</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {portfolios.map((portfolio) => (
//               <div
//                 key={portfolio._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
//                 onClick={() => handlePortfolioClick(portfolio)}
//               >
//                 {portfolio.images[0] && (
//                   <div className="relative h-64">
//                     <img
//                       src={portfolio.images[0].url}
//                       alt={portfolio.title}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                       <span className="text-white text-lg font-semibold">View Details</span>
//                     </div>
//                   </div>
//                 )}
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
//                   <p className="text-gray-600 mb-2">{portfolio.location}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-500">
//                       {new Date(portfolio.projectDate).toLocaleDateString()}
//                     </span>
//                     <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                       {portfolio.serviceType}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Portfolio Detail Modal */}
//         {isModalOpen && selectedPortfolio && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-2xl font-bold text-gray-900">{selectedPortfolio.title}</h2>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Image Gallery */}
//               {selectedPortfolio.images.length > 0 && (
//                 <div className="mb-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     {selectedPortfolio.images.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image.url}
//                         alt={`${selectedPortfolio.title} - Image ${index + 1}`}
//                         className="w-full h-64 object-cover rounded-lg"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Project Details */}
//               <div className="grid grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Project Details</h3>
//                   <div className="space-y-2">
//                     <p><span className="font-medium">Location:</span> {selectedPortfolio.location}</p>
//                     <p><span className="font-medium">Service Type:</span> {selectedPortfolio.serviceType}</p>
//                     <p><span className="font-medium">Project Date:</span> {new Date(selectedPortfolio.projectDate).toLocaleDateString()}</p>
//                     {selectedPortfolio.clientName && (
//                       <p><span className="font-medium">Client:</span> {selectedPortfolio.clientName}</p>
//                     )}
//                     {selectedPortfolio.projectDuration && (
//                       <p><span className="font-medium">Duration:</span> {selectedPortfolio.projectDuration}</p>
//                     )}
//                     {selectedPortfolio.projectSize && (
//                       <p><span className="font-medium">Project Size:</span> {selectedPortfolio.projectSize}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Description</h3>
//                   <p className="text-gray-600">{selectedPortfolio.description}</p>
//                 </div>
//               </div>

//               {/* Challenges and Solutions */}
//               {(selectedPortfolio.challenges || selectedPortfolio.solutions) && (
//                 <div className="grid grid-cols-2 gap-6 mb-6">
//                   {selectedPortfolio.challenges && (
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2">Challenges</h3>
//                       <p className="text-gray-600">{selectedPortfolio.challenges}</p>
//                     </div>
//                   )}
//                   {selectedPortfolio.solutions && (
//                     <div>
//                       <h3 className="text-lg font-semibold mb-2">Solutions</h3>
//                       <p className="text-gray-600">{selectedPortfolio.solutions}</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Customer Feedback */}
//               {selectedPortfolio.customerFeedback && (
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold mb-2">Customer Feedback</h3>
//                   <p className="text-gray-600">{selectedPortfolio.customerFeedback}</p>
//                 </div>
//               )}

//               {/* Tags */}
//               {selectedPortfolio.tags && selectedPortfolio.tags.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Tags</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedPortfolio.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </Container>
//   );
// } 







'use client';
import { useState, useEffect } from 'react';
import Container from '../../components/ui/Container';
import { toast } from 'react-hot-toast';
import { useTenant } from '../../contexts/TenantContext';
import { getTenantApiClient } from '../../lib/api/apiClient';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Get tenant context
  const { tenant, isLoading: tenantLoading, isClient } = useTenant();

  useEffect(() => {
    // Wait for tenant to load and client-side rendering
    if (tenantLoading || !isClient) return;
    
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        
        const apiClient = getTenantApiClient();
        // Use tenant public on tenant domains; aggregate all on main domain
        const endpoint = tenant ? '/portfolio/public' : '/portfolio/all';
        const response = await apiClient.get(endpoint);
        
        if (response.data.success) {
          setPortfolios(response.data.data);
        } else {
          toast.error('Failed to fetch portfolios');
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        toast.error('Failed to fetch portfolios');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [tenant, tenantLoading, isClient]);

  const handlePortfolioClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          {tenant ? `${tenant.name}'s Portfolio` : 'All Portfolios'}
        </h1>
        
        {loading || tenantLoading || !isClient ? (
          <div className="text-center py-8">Loading...</div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {tenant ? `${tenant.name} hasn't added any portfolio items yet.` : 'No portfolio items found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handlePortfolioClick(portfolio)}
              >
                {portfolio.images && portfolio.images[0] && (
                  <div className="relative h-64">
                    <img
                      src={portfolio.images[0].url}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-lg font-semibold">View Details</span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
                  <p className="text-gray-600 mb-2">{portfolio.location}</p>
                  {/* Show tenant name if we're on the main domain viewing all portfolios */}
                  {!tenant && portfolio.tenant && (
                    <p className="text-gray-500 text-sm mb-2">By: {portfolio.tenant.name}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(portfolio.projectDate).toLocaleDateString()}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {portfolio.serviceType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Detail Modal */}
        {isModalOpen && selectedPortfolio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPortfolio.title}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Show tenant info if on main domain */}
              {!tenant && selectedPortfolio.tenant && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">Company: {selectedPortfolio.tenant.name}</p>
                </div>
              )}

              {/* Image Gallery */}
              {selectedPortfolio.images && selectedPortfolio.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPortfolio.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`${selectedPortfolio.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Location:</span> {selectedPortfolio.location}</p>
                    <p><span className="font-medium">Service Type:</span> {selectedPortfolio.serviceType}</p>
                    <p><span className="font-medium">Project Date:</span> {new Date(selectedPortfolio.projectDate).toLocaleDateString()}</p>
                    {selectedPortfolio.clientName && (
                      <p><span className="font-medium">Client:</span> {selectedPortfolio.clientName}</p>
                    )}
                    {selectedPortfolio.projectDuration && (
                      <p><span className="font-medium">Duration:</span> {selectedPortfolio.projectDuration}</p>
                    )}
                    {selectedPortfolio.projectSize && (
                      <p><span className="font-medium">Project Size:</span> {selectedPortfolio.projectSize}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedPortfolio.description}</p>
                </div>
              </div>

              {/* Challenges and Solutions */}
              {(selectedPortfolio.challenges || selectedPortfolio.solutions) && (
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {selectedPortfolio.challenges && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Challenges</h3>
                      <p className="text-gray-600">{selectedPortfolio.challenges}</p>
                    </div>
                  )}
                  {selectedPortfolio.solutions && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Solutions</h3>
                      <p className="text-gray-600">{selectedPortfolio.solutions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Feedback */}
              {selectedPortfolio.customerFeedback && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Customer Feedback</h3>
                  <p className="text-gray-600">{selectedPortfolio.customerFeedback}</p>
                </div>
              )}

              {/* Tags */}
              {selectedPortfolio.tags && selectedPortfolio.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolio.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}