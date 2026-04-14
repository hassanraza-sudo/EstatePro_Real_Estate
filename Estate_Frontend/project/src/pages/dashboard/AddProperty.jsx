import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    type: "house",
    price: "",
    description: "",
    images: [],
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    isFeatured: false,
    newListing: true,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/properties/upload-image",
        formDataImg,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // res.data.imageUrl is like "/uploads/filename.jpg"
      const relativePath = res.data.imageUrl;
      const fullUrl = `http://localhost:5000${relativePath}`;

      setFormData((prev) => ({ ...prev, images: [relativePath] }));
      setPreviewImage(fullUrl);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/properties", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Property added successfully!");
      navigate("/dashboard/my-properties");
    } catch (error) {
      console.error("Error adding property:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add property.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" value={formData.title} onChange={handleChange} required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" id="address" value={formData.address} onChange={handleChange} required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" id="city" value={formData.city} onChange={handleChange} required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Property Type</label>
            <select id="type" value={formData.type} onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (PKR)</label>
            <input type="number" id="price" value={formData.price} onChange={handleChange} required min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={formData.description} onChange={handleChange} rows="3"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input type="number" id="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input type="number" id="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
            <input type="number" id="area" value={formData.area} onChange={handleChange} min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="flex space-x-6">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="newListing" checked={formData.newListing} onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="text-sm text-gray-700">New Listing</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {uploading && <p className="text-sm text-blue-500 mt-1">Uploading image...</p>}
          {previewImage && (
            <img src={previewImage} alt="Preview" className="mt-3 h-40 object-cover rounded-xl shadow" />
          )}
        </div>

        <button type="submit" disabled={submitting || uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg shadow transition">
          {submitting ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
