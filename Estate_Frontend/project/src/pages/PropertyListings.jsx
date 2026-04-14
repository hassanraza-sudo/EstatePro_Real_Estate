import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PropertyCard from "../components/property/PropertyCard";

const PropertyListing = () => {
  const [params] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const location = params.get("location") || "";
        const type = params.get("type") || "";
        const price = params.get("price") || "";

        const res = await axios.get(`http://localhost:5000/api/properties`, {
          params: { location, type, price },
        });

        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [params]);

  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-center mt-8 mb-4">
        Search Results
      </h2>
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <p className="text-center col-span-full">No properties found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyListing;
