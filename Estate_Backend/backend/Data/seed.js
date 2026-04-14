const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const Property = require("../models/Property");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

const dummyProperties = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    title: "Family House in Peshawar",
    address: "12 Peace Colony, Peshawar",
    city: "Peshawar",
    type: "house",
    price: 180000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1700,
    isFeatured: false,
    newListing: false,
    description: "Comfortable family house with 3 bedrooms.",
    images: [
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    title: "Corner Plot in Quetta",
    address: "11A Model Town, Quetta",
    city: "Quetta",
    type: "land",
    price: 210000,
    bedrooms: 0,
    bathrooms: 0,
    area: 3600,
    isFeatured: false,
    newListing: false,
    description: "Corner residential plot in a gated society.",
    images: [
      "https://mir-s3-cdn-cf.behance.net/projects/404/33fe8b95043147.Y3JvcCwzMzgxLDI2NDQsMjE0MiwxMzA1.jpg",
    ],
  },
  {
    title: "Office Space in Rawalpindi",
    address: "56 Business Center, Rawalpindi",
    city: "Rawalpindi",
    type: "commercial",
    price: 300000,
    bedrooms: 0,
    bathrooms: 2,
    area: 1500,
    isFeatured: false,
    newListing: true,
    description: "Fully furnished office with 5 rooms.",
    images: [
      "https://img.cofynd.com/images/latest_images_2024/1da40ebb49f1d61f1afc177c2f9cd02379efb972.webp",
    ],
  },
  {
    title: "Elegant Villa in Sukkur",
    address: "17 River Side, Sukkur",
    city: "Sukkur",
    type: "house",
    price: 350000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    isFeatured: false,
    newListing: false,
    description: "Peaceful villa located near the riverbank.",
    images: [
      "https://images.pexels.com/photos/259597/pexels-photo-259597.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    title: "Studio Apartment in Sialkot",
    address: "Apartment 404, Sky Heights, Sialkot",
    city: "Sialkot",
    type: "apartment",
    price: 100000,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    isFeatured: false,
    newListing: false,
    description: "Ideal for students and working professionals.",
    images: [
      "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    title: "Luxury Farmhouse in Murree",
    address: "Hill View Road, Murree",
    city: "Murree",
    type: "luxury",
    price: 900000,
    bedrooms: 6,
    bathrooms: 5,
    area: 5000,
    isFeatured: true,
    newListing: true,
    description: "A luxurious farmhouse with breathtaking mountain views.",
    images: [
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    title: "Ultra Modern Bungalow in Islamabad",
    address: "F-6 Sector, Islamabad",
    city: "Islamabad",
    type: "house",
    price: 750000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    isFeatured: true,
    newListing: false,
    description: "Bungalow with smart home features and a rooftop garden.",
    images: [
      "https://images.pexels.com/photos/534174/pexels-photo-534174.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    title: "Luxury Lakefront Apartment in Rawal Lake",
    address: "Lake View Residency, Islamabad",
    city: "Islamabad",
    type: "apartment",
    price: 850000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    isFeatured: true,
    newListing: true,
    description: "Lake-facing apartment with modern architecture.",
    images: [
      "https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
];

const seedData = async () => {
  try {
    await Property.deleteMany({});
    await Property.insertMany(dummyProperties);
    console.log("Data seeded successfully!");
  } catch (err) {
    console.error("Failed to seed data:", err);
  } finally {
    mongoose.connection.close();
  }
};
