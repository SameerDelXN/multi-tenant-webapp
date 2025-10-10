"use client";
import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useStore from '../../lib/store';
import { useSearchParams } from 'next/navigation';
import { useTenant } from '../../contexts/TenantContext';

const ServiceSelection = ({ onNext }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const { getTenantApiClient, tenant } = useTenant();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const fetchServices = async () => {
    try {
      const apiClient = getTenantApiClient();
      const endpoint = tenant ? '/services' : '/services/public';
      const response = await apiClient.get(endpoint);

      setServices(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
{{ ... }}
  };

  useEffect(() => {
    setLoading(true);
    fetchServices();
  }, [tenant]);

  // Handle URL parameters
  useEffect(() => {
    const urlServiceId = searchParams.get('serviceId');
    if (urlServiceId && services.length > 0) {
      const selectedService = services.find(service => service._id === urlServiceId);
      if (selectedService) {
        updateCurrentBooking({ 
          serviceId: urlServiceId,
          selectedService: selectedService 
        });
      }
    }
  }, [searchParams, updateCurrentBooking, services]);

  const handleSelectService = (serviceId) => {
    const selectedService = services.find(service => service._id === serviceId);
    updateCurrentBooking({ 
      serviceId,
      selectedService
    });
    onNext();
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Browse Our Services</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No services available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service._id} 
              hoverable 
              className={`cursor-pointer h-full transition-all ${
                currentBooking.serviceId === service._id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => handleSelectService(service._id)}
            >
              <div className="aspect-[16/9] bg-gray-100 rounded-t-md overflow-hidden">
                {service.image?.url ? (
                  <img
                    src={service.image.url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                {service.tenantId?.name && (
                  <p className="text-sm text-gray-500">Provider: {service.tenantId.name}</p>
                )}
                {service.price && (
                  <p className="text-lg font-medium mt-2">${service.price.toFixed(2)}</p>
                )}
              </div>

              <div className="px-4 pb-4">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectService(service._id);
                  }}
                >
                  Select Service
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;