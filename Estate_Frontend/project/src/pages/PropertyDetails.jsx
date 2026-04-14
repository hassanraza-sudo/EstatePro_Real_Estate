import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bed, Bath, Square, MapPin, Tag, Star, ArrowLeft } from 'lucide-react';
import BookingForm from '../components/forms/BookingForm';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        toast.error('Failed to load property details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Property not found.</p>
        <button onClick={() => navigate('/properties')} className="text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>
      </div>
    );
  }

  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0].startsWith('http')
        ? property.images[0]
        : `http://localhost:5000${property.images[0]}`
      : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 hover:underline mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg mb-6">
            <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.address}, {property.city}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">Rs. {property.price?.toLocaleString()}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize flex items-center gap-1">
                <Tag className="w-3 h-3" /> {property.type}
              </span>
              {property.isFeatured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              {property.newListing && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">New Listing</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Bed className="w-5 h-5 mx-auto text-gray-500 mb-1" />
                <p className="text-gray-500 text-sm">Bedrooms</p>
                <p className="text-xl font-semibold text-gray-800">{property.bedrooms}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Bath className="w-5 h-5 mx-auto text-gray-500 mb-1" />
                <p className="text-gray-500 text-sm">Bathrooms</p>
                <p className="text-xl font-semibold text-gray-800">{property.bathrooms}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Square className="w-5 h-5 mx-auto text-gray-500 mb-1" />
                <p className="text-gray-500 text-sm">Area</p>
                <p className="text-xl font-semibold text-gray-800">{property.area} sq ft</p>
              </div>
            </div>

            {property.description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.user && (
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Listed By</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {property.user.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{property.user.name}</p>
                    <p className="text-sm text-gray-500">{property.user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {isAuthenticated ? (
            <BookingForm propertyId={id} />
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <p className="text-gray-600 mb-3">Please log in to book a viewing.</p>
              <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Login to Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
