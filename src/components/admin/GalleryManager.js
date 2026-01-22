'use client';
import { useState, useEffect } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useTenant } from '../../contexts/TenantContext';
import Button from '../ui/Button';
import Container from '../ui/Container';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const GalleryManager = () => {
  const { userData } = useDashboard();
  const { tenant } = useTenant();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'residential',
    projectDate: '',
    clientName: '',
    projectDuration: '',
    tags: '',
    status: 'draft',
    images: [],
    thumbnailIndex: 0
  });

  // Fetch galleries for current tenant
  // Fetch galleries for current tenant admin
const fetchGalleries = async () => {
  if (!userData?.token) {
    toast.error('Authentication token missing. Please log in again.');
    return;
  }

  try {
    setLoading(true);
    const response = await axios.get(`${API_URL}/gallery`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
        // Include tenant subdomain if needed
        ...(tenant?.subdomain && { 'X-Tenant-Subdomain': tenant.subdomain })
      },
      params: {
        // Add any additional filtering params if needed
      }
    });

    if (response.data.success) {
      // Filter galleries client-side as an additional safety measure
      const filteredGalleries = response.data.data.filter(gallery => {
        // If user is tenant admin, only show galleries they created
        if (userData.role === 'tenantAdmin') {
          return gallery.createdBy === userData.id;
        }
        return true;
      });
      
      setGalleries(filteredGalleries);
    } else {
      toast.error('Failed to fetch galleries');
    }
  } catch (error) {
    console.error('Error fetching galleries:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch galleries');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (userData?.token) {
      fetchGalleries();
    }
  }, [userData, tenant]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file, // Store the File object
      isNew: true // Mark as new image
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    // Create preview URLs for new images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Remove image from preview and form data
  const handleRemoveImage = async (index) => {
    try {
      const image = formData.images[index];
      
      // If we're in edit mode and the image is an existing one (not new)
      if (selectedGallery?._id && !image.isNew && image._id) {
        setDeletingImageId(image._id);
        
        const response = await axios.delete(
          `${API_URL}/gallery/${selectedGallery._id}/images/${image._id}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        if (!response.data.success) {
          toast.error(response.data.message || 'Failed to delete image from server');
          return;
        }

        // Update the gallery data with the server response
        setSelectedGallery(response.data.data);
        
        // Update form data with the server response
        setFormData(prev => ({
          ...prev,
          images: response.data.data.images.map(img => ({
            ...img,
            isNew: false
          })),
          thumbnailIndex: response.data.data.thumbnailIndex || 0
        }));
        
        // Update preview URLs
        setImagePreviewUrls(response.data.data.images.map(img => img.url));
      } else {
        // For new images or when not in edit mode, just remove from local state
        setFormData(prev => {
          const newImages = [...prev.images];
          newImages.splice(index, 1);
          
          // Adjust thumbnail index if needed
          let newThumbnailIndex = prev.thumbnailIndex;
          if (index < prev.thumbnailIndex) {
            newThumbnailIndex = Math.max(0, prev.thumbnailIndex - 1);
          } else if (index === prev.thumbnailIndex) {
            newThumbnailIndex = 0; // Reset to first image if thumbnail was removed
          }
          
          return {
            ...prev,
            images: newImages,
            thumbnailIndex: newThumbnailIndex
          };
        });

        setImagePreviewUrls(prev => {
          const newUrls = [...prev];
          // If it's a blob URL (new image), revoke it
          if (newUrls[index]?.startsWith('blob:')) {
            URL.revokeObjectURL(newUrls[index]);
          }
          newUrls.splice(index, 1);
          return newUrls;
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image. Please try again.');
    } finally {
      setDeletingImageId(null);
    }
  };

  // Cleanup preview URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviewUrls]);

  // Reset form
  const resetForm = () => {
    // Revoke all blob URLs before resetting
    imagePreviewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'residential',
      projectDate: '',
      clientName: '',
      projectDuration: '',
      tags: '',
      status: 'draft',
      images: [],
      thumbnailIndex: 0
    });
    setSelectedGallery(null);
    setImagePreviewUrls([]);
  };

  // Handle edit gallery
  const handleEdit = (gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      location: gallery.location,
      category: gallery.category,
      projectDate: new Date(gallery.projectDate).toISOString().split('T')[0],
      clientName: gallery.clientName || '',
      projectDuration: gallery.projectDuration || '',
      tags: gallery.tags.join(', '),
      status: gallery.status,
      images: gallery.images.map(img => ({
        ...img,
        isNew: false
      })),
      thumbnailIndex: gallery.thumbnailIndex || 0
      
    });
    // Set preview URLs for existing images
    setImagePreviewUrls(gallery.images.map(img => img.url));
    setIsModalOpen(true);
  };

  // Handle thumbnail selection
  const handleSelectThumbnail = (index) => {
    setFormData(prev => ({
      ...prev,
      thumbnailIndex: index
    }));
  };

  // Prepare form data for submission
  const prepareFormData = () => {
    const formDataToSend = new FormData();
    
    // Append all text fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('projectDate', formData.projectDate);
    formDataToSend.append('clientName', formData.clientName);
    formDataToSend.append('projectDuration', formData.projectDuration);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('thumbnailIndex', formData.thumbnailIndex.toString());
    
    // Append new image files
    formData.images.forEach((image) => {
      if (image.isNew && image.file) {
        formDataToSend.append('images', image.file);
      }
    });
    
    return formDataToSend;
  };

  // Handle gallery creation
 const handleCreateGallery = async (e) => {
    e.preventDefault();
    
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.location || 
        !formData.category || !formData.projectDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Validate at least one image is uploaded
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    // Validate thumbnail index is within bounds
    if (formData.thumbnailIndex < 0 || formData.thumbnailIndex >= formData.images.length) {
      toast.error('Please select a valid thumbnail image');
      return;
    }

    const formDataToSend = prepareFormData();
if (!tenant?.subdomain) {
  toast.error('Tenant not detected. Please refresh.');
  return;
}

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_URL}/gallery`, formDataToSend, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`,
          // Add tenant header if needed
          ...(tenant?.subdomain && { 'X-Tenant-Subdomain': tenant.subdomain })
        },
      });
      
      if (response.data.success) {
        toast.success('Gallery created successfully');
        setIsModalOpen(false);
        fetchGalleries();
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to create gallery');
      }
    } catch (error) {
      console.error('Error creating gallery:', error);
      toast.error(error.response?.data?.message || 'Failed to create gallery');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle gallery update with tenant context
  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    if (!selectedGallery?._id) {
      toast.error('No gallery selected for update');
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.location || 
        !formData.category || !formData.projectDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Validate thumbnail index is within bounds
    if (formData.thumbnailIndex < 0 || formData.thumbnailIndex >= formData.images.length) {
      toast.error('Please select a valid thumbnail image');
      return;
    }

    const formDataToSend = prepareFormData();

    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `${API_URL}/gallery/${selectedGallery._id}`, 
        formDataToSend,
        {
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userData.token}`,
            // Add tenant header if needed
            ...(tenant?.subdomain && { 'X-Tenant-Subdomain': tenant.subdomain })
          },
        }
      );

      if (response.data.success) {
        toast.success('Gallery updated successfully');
        setIsModalOpen(false);
        fetchGalleries();
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to update gallery');
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      toast.error(error.response?.data?.message || 'Failed to update gallery');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle gallery deletion with tenant context
  const handleDeleteGallery = async (id) => {
    if (!userData?.token) {
      toast.error('Authentication token missing. Please log in again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`${API_URL}/gallery/${id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            // Add tenant header if needed
            ...(tenant?.subdomain && { 'X-Tenant-Subdomain': tenant.subdomain })
          },
        });

        if (response.data.success) {
          toast.success('Gallery deleted successfully');
          fetchGalleries();
        } else {
          toast.error('Failed to delete gallery');
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        toast.error(error.response?.data?.message || 'Failed to delete gallery');
      }
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header with Add New button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gallery Items</h2>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Add New Gallery
          </Button>
        </div>
        
        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No galleries found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {galleries.map((gallery) => (
  <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
    {gallery.images.length > 0 && (
      <img
        src={gallery.images[gallery.thumbnailIndex || 0].url}
        alt={gallery.title}
        className="w-full h-48 object-cover"
      />
    )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{gallery.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(gallery.projectDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEdit(gallery)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteGallery(gallery._id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Modal for Add/Edit Gallery */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedGallery ? 'Edit Gallery' : 'Add New Gallery'}
                </h3>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={selectedGallery ? handleUpdateGallery : handleCreateGallery}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location *</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="event">Event</option>
                          <option value="landscaping">Landscaping</option>
                          <option value="garden">Garden</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Date *</label>
                        <input
                          type="date"
                          name="projectDate"
                          value={formData.projectDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Client Name</label>
                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project Duration</label>
                        <input
                          type="text"
                          name="projectDuration"
                          value={formData.projectDuration}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Images *</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="mt-1 block w-full"
                        accept="image/*"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedGallery ? 'Add additional images' : 'Upload at least one image'}
                      </p>
                    </div>
                    
                    {/* Image Preview Grid with Thumbnail Selection */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Thumbnail Image *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <div 
                                className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                                  formData.thumbnailIndex === index ? 'border-green-600' : 'border-transparent'
                                }`}
                                onClick={() => handleSelectThumbnail(index)}
                              >
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover"
                                />
                                {formData.thumbnailIndex === index && (
                                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <div className="bg-green-600 text-white rounded-full p-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                disabled={deletingImageId === formData.images[index]?._id}
                                className={`absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  deletingImageId === formData.images[index]?._id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={isSubmitting || formData.images.length === 0}
                    onClick={selectedGallery ? handleUpdateGallery : handleCreateGallery}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {selectedGallery ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      selectedGallery ? 'Update' : 'Create'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default GalleryManager;