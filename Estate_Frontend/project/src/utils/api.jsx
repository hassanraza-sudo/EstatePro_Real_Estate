// Mock API functions
const PROPERTIES_DATA = [
  {
    id: 1,
    title: "Modern House in Karachi",
    address: "123 Street A, Karachi",
    city: "Karachi",
    type: "house",
    price: 150000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    isFeatured: true,
    newListing: true,
    description: "A beautiful modern house with a garden.",
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Garden", "Garage"],
    propertyType: "house",
    yearBuilt: 2015,
    parkingSpaces: 2,
    agentId: 1,
    agentName: "Hassan Raza",
    agentPhone: "0301-2984495",
    agentEmail: "hassan@estatepro.com",
  },
  {
    id: 2,
    title: "Luxury Apartment in Lahore",
    address: "456 Avenue B, Lahore",
    city: "Lahore",
    type: "luxury",
    price: 250000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    isFeatured: true,
    newListing: false,
    description: "Spacious apartment with a city view.",
    images: [
      "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Balcony", "Elevator"],
    propertyType: "apartment",
    yearBuilt: 2018,
    parkingSpaces: 1,
    agentId: 2,
    agentName: "Shaista Khan",
    agentPhone: "0312-1234567",
    agentEmail: "shaista@estatepro.com",
  },
  {
    id: 3,
    title: "Commercial Plaza in Islamabad",
    address: "789 Plaza Road, Islamabad",
    city: "Islamabad",
    type: "commercial",
    price: 500000,
    bedrooms: 0,
    bathrooms: 2,
    area: 4000,
    isFeatured: false,
    newListing: true,
    description: "Perfect for office and retail business.",
    images: [
      "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Lift", "Basement"],
    propertyType: "commercial",
    yearBuilt: 2020,
    parkingSpaces: 3,
    agentId: 3,
    agentName: "Sarah Johnson",
    agentPhone: "0311-9999999",
    agentEmail: "sarah@estatepro.com",
  },
  {
    id: 4,
    title: "Budget Apartment in Multan",
    address: "101 Green St, Multan",
    city: "Multan",
    type: "apartment",
    price: 95000,
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    isFeatured: false,
    newListing: false,
    description: "Affordable living in the heart of Multan.",
    images: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Nearby Markets", "Parking"],
    propertyType: "apartment",
    yearBuilt: 2010,
    parkingSpaces: 1,
    agentId: 4,
    agentName: "Ali Raza",
    agentPhone: "0333-1234567",
    agentEmail: "ali@estatepro.com",
  },
  {
    id: 5,
    title: "Villa with Pool in Hyderabad",
    address: "88 Luxury Lane, Hyderabad",
    city: "Hyderabad",
    type: "house",
    price: 400000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3000,
    isFeatured: true,
    newListing: false,
    description: "Spacious villa with private pool and lawn.",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Pool", "Lawn", "Garage"],
    propertyType: "house",
    yearBuilt: 2016,
    parkingSpaces: 3,
    agentId: 5,
    agentName: "Tariq Hussain",
    agentPhone: "0300-1112223",
    agentEmail: "tariq@estatepro.com",
  },
  {
    id: 6,
    title: "Shop for Rent in Faisalabad",
    address: "23 Market Road, Faisalabad",
    city: "Faisalabad",
    type: "commercial",
    price: 130000,
    bedrooms: 0,
    bathrooms: 1,
    area: 700,
    isFeatured: false,
    newListing: false,
    description: "Ideal for a retail shop or mini-mart.",
    images: [
      "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Security Shutters", "Street Parking"],
    propertyType: "commercial",
    yearBuilt: 2012,
    parkingSpaces: 1,
    agentId: 6,
    agentName: "Nida Aftab",
    agentPhone: "0345-8765432",
    agentEmail: "nida@estatepro.com",
  },
  {
    id: 7,
    title: "Luxury Penthouse in Karachi",
    address: "98 Sky Tower, Clifton, Karachi",
    city: "Karachi",
    type: "luxury",
    price: 800000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    isFeatured: true,
    newListing: true,
    description: "Penthouse with panoramic sea view.",
    images: [
      "https://images.pexels.com/photos/271800/pexels-photo-271800.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    amenities: ["Terrace", "Sea View", "Private Lift", "Smart Home"],
    propertyType: "penthouse",
    yearBuilt: 2021,
    parkingSpaces: 2,
    agentId: 7,
    agentName: "Ahsan Qureshi",
    agentPhone: "0307-5550007",
    agentEmail: "ahsan@estatepro.com",
  },
];

// Fetch all properties
export const fetchProperties = async (filters = {}) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let filteredProperties = [...PROPERTIES_DATA];

  // Apply filters
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredProperties = filteredProperties.filter((property) =>
      property.address.toLowerCase().includes(location)
    );
  }

  if (filters.priceMin) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price >= parseInt(filters.priceMin)
    );
  }

  if (filters.priceMax) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price <= parseInt(filters.priceMax)
    );
  }

  if (filters.bedrooms) {
    filteredProperties = filteredProperties.filter(
      (property) => property.bedrooms >= parseInt(filters.bedrooms)
    );
  }

  if (filters.bathrooms) {
    filteredProperties = filteredProperties.filter(
      (property) => property.bathrooms >= parseInt(filters.bathrooms)
    );
  }

  if (filters.propertyType) {
    filteredProperties = filteredProperties.filter(
      (property) => property.propertyType === filters.propertyType
    );
  }

  if (filters.type) {
    filteredProperties = filteredProperties.filter(
      (property) => property.type.toLowerCase() === filters.type.toLowerCase()
    );
  }

  // More filters can be added as needed

  return filteredProperties;
};

// Fetch featured properties
export const fetchFeaturedProperties = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return PROPERTIES_DATA.filter((property) => property.isFeatured);
};

// Fetch a single property by ID
export const fetchPropertyById = async (id) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const property = PROPERTIES_DATA.find(
    (property) => property.id === parseInt(id)
  );

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

// Save a property (favorite/bookmark)
export const saveProperty = async (propertyId, userId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would update a database
  return { success: true, message: "Property saved successfully" };
};

// Remove a saved property
export const removeSavedProperty = async (propertyId, userId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real app, this would update a database
  return { success: true, message: "Property removed from saved list" };
};

// Fetch saved properties for a user
export const fetchSavedProperties = async (userId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // For demo purposes, return a subset of properties as "saved"
  return PROPERTIES_DATA.slice(0, 3);
};

// Add a new property
export const addProperty = async (propertyData) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real app, this would add to a database
  const newProperty = {
    id: PROPERTIES_DATA.length + 1,
    ...propertyData,
    createdAt: new Date().toISOString(),
  };

  return { success: true, property: newProperty };
};

// Update a property
export const updateProperty = async (propertyId, propertyData) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real app, this would update a database
  return { success: true, message: "Property updated successfully" };
};

// Delete a property
export const deleteProperty = async (propertyId) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would delete from a database
  return { success: true, message: "Property deleted successfully" };
};

// Book a property viewing
export const bookPropertyViewing = async (bookingData) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real app, this would create a booking in a database
  return {
    success: true,
    message: "Viewing scheduled successfully",
    bookingId: Math.floor(Math.random() * 1000000),
  };
};

// Fetch analytics data for dashboard
export const fetchAnalytics = async (userId, userRole) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Different data based on user role
  if (userRole === "admin") {
    return {
      totalProperties: 256,
      totalUsers: 1248,
      totalAgents: 42,
      totalSales: 186,
      revenue: 2450000,
      recentActivity: [
        {
          id: 1,
          type: "sale",
          property: "Luxury Penthouse",
          amount: 1750000,
          date: "2023-07-15",
        },
        {
          id: 2,
          type: "rental",
          property: "Downtown Apartment",
          amount: 3500,
          date: "2023-07-14",
        },
        {
          id: 3,
          type: "sale",
          property: "Suburban Home",
          amount: 575000,
          date: "2023-07-12",
        },
        {
          id: 4,
          type: "sale",
          property: "Beachfront Condo",
          amount: 675000,
          date: "2023-07-10",
        },
      ],
      propertyDistribution: {
        house: 45,
        apartment: 30,
        condo: 15,
        townhouse: 5,
        commercial: 3,
        land: 2,
      },
    };
  } else if (userRole === "agent") {
    return {
      totalListings: 24,
      activeListings: 18,
      totalClients: 36,
      totalSales: 12,
      revenue: 240000,
      recentActivity: [
        {
          id: 1,
          type: "sale",
          property: "Modern Waterfront Villa",
          amount: 1250000,
          date: "2023-07-15",
        },
        {
          id: 2,
          type: "viewing",
          property: "Luxury Penthouse",
          client: "John Smith",
          date: "2023-07-14",
        },
        {
          id: 3,
          type: "inquiry",
          property: "Beachfront Condo",
          client: "Sarah Johnson",
          date: "2023-07-12",
        },
        {
          id: 4,
          type: "sale",
          property: "Downtown Apartment",
          amount: 850000,
          date: "2023-07-10",
        },
      ],
      propertyDistribution: {
        house: 10,
        apartment: 8,
        condo: 4,
        townhouse: 2,
      },
    };
  } else if (userRole === "landlord") {
    return {
      totalProperties: 8,
      occupiedProperties: 6,
      vacantProperties: 2,
      totalIncome: 12500,
      recentActivity: [
        {
          id: 1,
          type: "rental",
          property: "Modern Urban Loft",
          tenant: "Michael Brown",
          amount: 3500,
          date: "2023-07-15",
        },
        {
          id: 2,
          type: "maintenance",
          property: "Historic Brownstone",
          issue: "Plumbing",
          date: "2023-07-13",
        },
        {
          id: 3,
          type: "payment",
          property: "Suburban Apartment",
          tenant: "Emma Wilson",
          amount: 2200,
          date: "2023-07-10",
        },
        {
          id: 4,
          type: "inquiry",
          property: "Downtown Condo",
          client: "David Lee",
          date: "2023-07-08",
        },
      ],
      propertyDistribution: {
        house: 3,
        apartment: 3,
        condo: 2,
      },
    };
  } else {
    // Buyer/Tenant
    return {
      savedProperties: 12,
      viewingRequests: 5,
      recentSearches: [
        {
          id: 1,
          location: "Miami, FL",
          filters: { bedrooms: 3, price: "500000-1000000" },
          date: "2023-07-15",
        },
        {
          id: 2,
          location: "New York, NY",
          filters: { bedrooms: 2, type: "apartment" },
          date: "2023-07-13",
        },
        {
          id: 3,
          location: "San Francisco, CA",
          filters: { propertyType: "condo" },
          date: "2023-07-10",
        },
      ],
      upcomingViewings: [
        {
          id: 1,
          property: "Modern Waterfront Villa",
          date: "2023-07-20",
          time: "10:00 AM",
        },
        {
          id: 2,
          property: "Downtown Luxury Apartment",
          date: "2023-07-22",
          time: "2:30 PM",
        },
      ],
    };
  }
};
