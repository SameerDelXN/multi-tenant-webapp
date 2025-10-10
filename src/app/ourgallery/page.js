"use client";
import { useState, useEffect } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import Container from "../../components/ui/Container";
import { toast } from "react-hot-toast";
import { getTenantApiClient } from "../../lib/api/apiClient";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Search,
  Filter,
  X,
} from "lucide-react";

const GalleryManager = () => {
  const { userData } = useDashboard();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const apiClient = getTenantApiClient();

  // Fetch galleries
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/gallery');
      console.log("Fetched galleries data:", response.data);
      if (response.data.success) {
        setGalleries(response.data.data);
      } else {
        console.error("Failed to fetch galleries");
        toast.error("Failed to load gallery items");
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error("Error loading gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [userData]);

  // Filter galleries based on search term and category
  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch =
      searchTerm === "" ||
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      (gallery.category &&
        gallery.category.toLowerCase() === filterCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Categories derived from gallery data
  const categories = [
    "all",
    ...new Set(
      galleries
        .filter((gallery) => gallery.category)
        .map((gallery) => gallery.category.toLowerCase())
    ),
  ];

  // Handle gallery click - open lightbox
  const openGallery = (gallery, index = 0) => {
    setSelectedGallery(gallery);
    setCurrentImageIndex(index);
    document.body.style.overflow = "hidden"; // Prevent scrolling when lightbox is open
  };

  // Close lightbox
  const closeGallery = () => {
    setSelectedGallery(null);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  // Navigate through images in lightbox
  const nextImage = () => {
    if (selectedGallery && selectedGallery.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedGallery.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedGallery && selectedGallery.images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedGallery.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <div className="space-y-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-green-800">
            Landscaping Gallery
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search galleries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none w-full sm:w-48"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            {/* View toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${
                  viewMode === "grid"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${
                  viewMode === "list"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : filteredGalleries.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No galleries found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                onClick={() => openGallery(gallery)}
              >
                <div className="relative h-56 overflow-hidden">
                  {gallery.images && gallery.images.length > 0 ? (
                    <img
                      src={gallery.images[gallery.thumbnailIndex || 0].url}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  {gallery.category && (
                    <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {gallery.category}
                    </span>
                  )}
                  {gallery.images && gallery.images.length > 1 && (
                    <span className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                      +{gallery.images.length - 1} photos
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {gallery.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {gallery.location}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(gallery.projectDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg cursor-pointer"
                onClick={() => openGallery(gallery)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-48 h-40">
                    {gallery.images && gallery.images.length > 0 ? (
                      <img
                        src={gallery.images[gallery.thumbnailIndex || 0].url}
                        alt={gallery.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    {gallery.images && gallery.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        +{gallery.images.length - 1} photos
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {gallery.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {gallery.location}
                        </p>
                      </div>
                      {gallery.category && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {gallery.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(gallery.projectDate)}
                    </p>
                    {gallery.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for gallery view */}
      {selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>

            {/* Main image container */}
            <div className="flex-grow flex items-center justify-center p-4">
              {selectedGallery.images &&
                selectedGallery.images[currentImageIndex] && (
                  <img
                    src={selectedGallery.images[currentImageIndex].url}
                    alt={`${selectedGallery.title} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="max-h-full max-w-full object-contain"
                  />
                )}

              {/* Navigation arrows */}
              {selectedGallery.images && selectedGallery.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Image info and thumbnails */}
            <div className="bg-white p-4 md:p-6">
              <div className="container mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {selectedGallery.title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {selectedGallery.location}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(selectedGallery.projectDate)}
                  </p>
                  {selectedGallery.category && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {selectedGallery.category}
                    </span>
                  )}
                </div>

                {selectedGallery.description && (
                  <p className="text-gray-700 mt-3">
                    {selectedGallery.description}
                  </p>
                )}

                {/* Thumbnails */}
                {selectedGallery.images &&
                  selectedGallery.images.length > 1 && (
                    <div className="mt-4">
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {selectedGallery.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                              currentImageIndex === index
                                ? "border-green-600"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      <div className="text-center text-sm text-gray-500 mt-2">
                        Image {currentImageIndex + 1} of{" "}
                        {selectedGallery.images.length}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default GalleryManager;
