import React, { useState } from "react";
import { supabase } from "../supabase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  // Upload image to Supabase
  const storeImage = async (file) => {
    const filePath = `uploads/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("image").upload(filePath, file);
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("image")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // Handle image upload
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one image.");
    if (files.length > 6) return alert("You can only upload up to 6 images.");

    setUploading(true);
    try {
      const promises = Array.from(files).map((file) => storeImage(file));
      const imageUrls = await Promise.all(promises);
      setUploadedImages((prev) => [...prev, ...imageUrls]);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.message);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Delete uploaded image
  const handleDeleteImage = async (url) => {
    const path = url.split("/storage/v1/object/public/image/")[1];
    const { error } = await supabase.storage.from("image").remove([path]);
    if (error) {
      console.error("Delete failed:", error.message);
      alert("Failed to delete image.");
      return;
    }
    setUploadedImages((prev) => prev.filter((img) => img !== url));
  };

  // Handle form changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
      return;
    }

    if (id === "furnished" || id === "offer" || id === "parking") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  // ✅ FINAL FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      if (formData.regularPrice < formData.discountPrice) {
        setLoading(false);
        return setError("Discount price must be less than regular price");
      }

      if (uploadedImages.length === 0) {
        setLoading(false);
        return setError("Please upload at least one image");
      }

      const res = await fetch(`${BACKEND_URL}/api/listing/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 THIS FIXES YOUR ERROR
        body: JSON.stringify({
          ...formData,
          userRef: currentUser?._id,
          imageUrls: uploadedImages,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto gap-4">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="flex gap-2">
            <input
              type="checkbox"
              id="parking"
              checked={formData.parking}
              onChange={handleChange}
            />
            Parking
          </div>

          <div className="flex gap-2">
            <input
              type="checkbox"
              id="furnished"
              checked={formData.furnished}
              onChange={handleChange}
            />
            Furnished
          </div>

          <div className="flex gap-2">
            <input
              type="checkbox"
              id="offer"
              checked={formData.offer}
              onChange={handleChange}
            />
            Offer
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />

          <button type="button" onClick={handleImageSubmit}>
            {uploading ? "Uploading..." : "Upload Images"}
          </button>

          <button type="submit">
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;