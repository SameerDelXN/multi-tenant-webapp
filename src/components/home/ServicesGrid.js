"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { useTenant } from '@/contexts/TenantContext';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getTenantApiClient } = useTenant();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const apiClient = getTenantApiClient();
        // Use aggregate public services endpoint so main domain shows all tenants
        const response = await apiClient.get('/services/public');
        const data = response.data;
        console.log(data);
        if (Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const navigateToServiceDetail = (serviceId) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-3">
            Our Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Landscaping Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your outdoor spaces with our comprehensive range of premium landscaping and lawn care services.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
            >
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 font-medium">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.slice(0, 6).map((service, index) => (
              <div 
                key={index}
                onClick={() => navigateToServiceDetail(service._id)}
                className="group cursor-pointer transition-all duration-300 hover:translate-y-[-5px]"
              >
                <Card 
                  hoverable 
                  className="h-full flex flex-col overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {service.image?.url ? (
                      <img
                        src={service.image.url}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-green-700">
                        {service.price ? `$${service.price}` : 'Contact for pricing'}
                      </span>
                    </div>
                  </div>

                  <Card.Content className="flex-grow p-5">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      {service.duration && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration} min
                        </span>
                      )}
                      <span className="text-green-600 font-medium group-hover:text-green-700 inline-flex items-center">
                        Learn More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            ))}
          </div>
        )}
        
        {services.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/services')}
              className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center mx-auto"
            >
              <span>View All Services</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ServicesGrid;