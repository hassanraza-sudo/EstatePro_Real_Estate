import React, { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, Home, Building2, Warehouse } from 'lucide-react';

const SearchFilters = ({ onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    bedrooms: initialFilters.bedrooms || '',
    bathrooms: initialFilters.bathrooms || '',
    propertyType: initialFilters.propertyType || '',
    ...initialFilters
  });
  
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };
  
  const handleReset = () => {
    setFilters({
      location: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      areaMin: '',
      areaMax: '',
      yearBuiltMin: '',
      yearBuiltMax: '',
      amenities: []
    });
    onSearch({});
  };

  const propertyTypes = [
    { value: 'house', label: 'House', icon: <Home size={16} /> },
    { value: 'apartment', label: 'Apartment', icon: <Building2 size={16} /> },
    { value: 'condo', label: 'Condo', icon: <Building2 size={16} /> },
    { value: 'townhouse', label: 'Townhouse', icon: <Home size={16} /> },
    { value: 'land', label: 'Land', icon: <Warehouse size={16} /> },
    { value: 'commercial', label: 'Commercial', icon: <Warehouse size={16} /> }
  ];

  return (
    <div className="bg-slate-400 p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        {/* Main search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-800" />
          </div>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter city, address or ZIP code"
            className="input pl-10"
          />
        </div>
        
        {/* Basic filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor="priceRange" className="label">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                placeholder="Min"
                className="input"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                placeholder="Max"
                className="input"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="bedrooms" className="label">Bedrooms</label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="bathrooms" className="label">Bathrooms</label>
            <select
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleChange}
              className="input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="propertyType" className="label">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="input"
            >
              <option value="">Any</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Advanced filters */}
        <div className="mt-4">
          <button
            type="button"
            className="flex items-center text-blue-600 text-sm font-medium"
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            {advancedOpen ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Fewer Filters
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                More Filters
              </>
            )}
          </button>
          
          {advancedOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 animate-fadeIn">
              <div>
                <label htmlFor="areaRange" className="label">Area (sq ft)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="areaMin"
                    value={filters.areaMin}
                    onChange={handleChange}
                    placeholder="Min"
                    className="input"
                  />
                  <input
                    type="number"
                    name="areaMax"
                    value={filters.areaMax}
                    onChange={handleChange}
                    placeholder="Max"
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="yearBuilt" className="label">Year Built</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="yearBuiltMin"
                    value={filters.yearBuiltMin}
                    onChange={handleChange}
                    placeholder="From"
                    className="input"
                  />
                  <input
                    type="number"
                    name="yearBuiltMax"
                    value={filters.yearBuiltMax}
                    onChange={handleChange}
                    placeholder="To"
                    className="input"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="label">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Pool', 'Garage', 'Fireplace', 'Air Conditioning', 'Gym', 'Garden'].map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={amenity.toLowerCase().replace(' ', '-')}
                        name="amenities"
                        value={amenity}
                        checked={filters.amenities?.includes(amenity) || false}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFilters(prev => ({
                            ...prev,
                            amenities: e.target.checked
                              ? [...(prev.amenities || []), value]
                              : (prev.amenities || []).filter(a => a !== value)
                          }));
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={amenity.toLowerCase().replace(' ', '-')}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            <X className="h-4 w-4 " />
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Search className="h-4 w-4 " />
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;