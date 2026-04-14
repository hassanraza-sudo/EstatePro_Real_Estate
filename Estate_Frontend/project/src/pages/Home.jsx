import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  MapPin,
  Building,
  Home as HomeIcon,
  Warehouse,
  DollarSign,
  Star,
} from "lucide-react";
import PropertyCard from "../components/property/PropertyCard.jsx";
import { fetchFeaturedProperties } from "../utils/api.jsx";

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const data = await fetchFeaturedProperties();
        setFeaturedProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    getProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/properties?location=${searchParams.location}&type=${searchParams.propertyType}&price=${searchParams.priceRange}`;
  };

  return (
    <div className="min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
            alt="hero"
            className="w-full h-full object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
            Discover Your <span className="text-blue-400">Dream Home</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 mt-5">
            Browse top listings with ease and confidence.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-12 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-6 md:p-10 grid gap-4 md:grid-cols-4 items-center"
          >
            <div className="relative">
              <MapPin className="absolute top-3.5 left-3 text-white/70 w-5 h-5" />
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleChange}
                placeholder="City, ZIP, or Address"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-white/80 text-gray-800 placeholder:text-gray-500 focus:ring-2 ring-blue-300"
              />
            </div>

            <div className="relative">
              <Building className="absolute top-3.5 left-3 text-white/70 w-5 h-5" />
              <select
                name="propertyType"
                value={searchParams.propertyType}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-white/80 text-gray-800 focus:ring-2 ring-blue-300"
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="relative">
              <DollarSign className="absolute top-3.5 left-3 text-white/70 w-5 h-5" />
              <select
                name="priceRange"
                value={searchParams.priceRange}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-white/80 text-gray-800 focus:ring-2 ring-blue-300"
              >
                <option value="">Any Price</option>
                <option value="0-100000">$0 - $100,000</option>
                <option value="100000-300000">$100,000 - $300,000</option>
                <option value="300000-500000">$300,000 - $500,000</option>
                <option value="500000-1000000">$500,000 - $1,000,000</option>
                <option value="1000000+">$1,000,000+</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-sky-700 hover:bg-sky-900 text-white font-semibold rounded-lg flex items-center justify-center transition-all"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800">Featured Properties</h2>
            <Link
              to="/properties"
              className="text-blue-600 hover:underline flex items-center"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="h-12 w-12 border-4 border-blue-600 border-b-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            Browse by Property Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[{ name: "Houses", icon: HomeIcon, count: 5, path: "/properties?type=house" },
              { name: "Apartments", icon: Building, count: 4, path: "/properties?type=apartment" },
              { name: "Commercial", icon: Warehouse, count: 3, path: "/properties?type=commercial" },
              { name: "Luxury", icon: Star, count: 3, path: "/properties?type=luxury" },
            ].map((type, index) => (
              <Link
                key={index}
                to={type.path}
                className="bg-zinc-200 hover:bg-zinc-300 p-6 rounded-xl shadow hover:shadow-md transition flex flex-col items-center"
              >
                <type.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {type.name}
                </h3>
                <p className="text-blue-600 font-medium mt-1">
                  {type.count} Properties
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[{ step: 1, title: "Find Properties", description: "Browse listings to discover the perfect place." },
              { step: 2, title: "Contact Agent", description: "Get in touch with top-rated agents." },
              { step: 3, title: "Close the Deal", description: "Secure your property with confidence." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="h-16 w-16 flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-bold rounded-full mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-sky-500 to-zinc-500 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10">
            Join thousands of happy customers. Start your journey to your dream property today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/properties"
              className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Browse Properties
            </Link>
            <Link
              to="/contact"
              className="border border-white py-3 px-6 rounded-lg hover:bg-white hover:text-blue-700 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
