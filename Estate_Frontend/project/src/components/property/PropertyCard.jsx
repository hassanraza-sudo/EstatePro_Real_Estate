import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Heart, Star } from "lucide-react";

const PropertyCard = ({ property, saved = false, onSaveToggle }) => {
  const {
    _id,
    id,
    title,
    price,
    address,
    city,
    bedrooms,
    bathrooms,
    area,
    type,
    isFeatured = false,
    newListing = false,
    images = [],
  } = property;

  const propertyId = _id || id;

  const imageUrl =
    images.length > 0
      ? images[0].startsWith("http")
        ? images[0]
        : `http://localhost:5000${images[0]}`
      : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            onSaveToggle && onSaveToggle(propertyId);
          }}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
        <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
          {isFeatured && (
            <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
          {newListing && (
            <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">New</span>
          )}
          <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold capitalize">{type}</span>
        </div>
      </div>

      <Link to={`/properties/${propertyId}`} className="block p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-lg font-bold text-blue-600 shrink-0 ml-2">Rs.{price?.toLocaleString()}</p>
        </div>
        <div className="flex items-center text-gray-500 mb-3 text-sm">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="line-clamp-1">{address}{city ? `, ${city}` : ""}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-100 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms} Bed{bedrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms} Bath{bathrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{area} sq ft</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
