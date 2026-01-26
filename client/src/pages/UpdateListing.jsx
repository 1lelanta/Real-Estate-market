import React, { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setFormData(data);
        setUploadedImages(data.imageUrls || []);
      } catch (err) {
        setError("Failed to fetch listing.");
        console.error(err);
      }
    };
    fetchListing();
  }, [params.listingId]);

  // Upload image to Supabase
  const storeImage = async (file) => {
    const filePath = `uploads/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("image").upload(filePath, file);
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from("image").getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one image.");
    if (files.length + uploadedImages.length > 6) return alert("You can only have up to 6 images.");

    setUploading(true);
    try {
      const promises = Array.from(files).map((file) => storeImage(file));
      const imageUrls = await Promise.all(promises);
      setUploadedImages((prev) => [...prev, ...imageUrls]);
      setFiles([]);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (url) => {
    const path = url.split("/storage/v1/object/public/image/")[1];
    const { error } = await supabase.storage.from("image").remove([path]);
    if (error) {
      alert("Failed to delete image.");
      console.error(error);
      return;
    }
    setUploadedImages((prev) => prev.filter((img) => img !== url));
  };

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

    setFormData((prev) => ({ ...prev, [id]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.regularPrice < formData.discountPrice) {
      setError("Discount price must be less than regular price.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrls: uploadedImages, userRef: currentUser?._id }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Failed to update listing.");
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating.");
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto gap-4">
      <h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left Section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
          />

          <textarea
            id="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" checked={formData.type === "sale"} onChange={handleChange} />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" checked={formData.type === "rent"} onChange={handleChange} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" checked={formData.parking} onChange={handleChange} />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" checked={formData.furnished} onChange={handleChange} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" checked={formData.offer} onChange={handleChange} />
              <span>Offer</span>
            </div>
          </div>

          {/* Numeric fields */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <input type="number" id="bedrooms" min={1} max={10} value={formData.bedrooms} onChange={handleChange} className="p-3 border rounded-lg" />
              <p>Bed</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="bathrooms" min={1} max={10} value={formData.bathrooms} onChange={handleChange} className="p-3 border rounded-lg" />
              <p>Bath</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" id="regularPrice" min={0} value={formData.regularPrice} onChange={handleChange} className="p-3 border rounded-lg" />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input type="number" id="discountPrice" min={0} value={formData.discountPrice} onChange={handleChange} className="p-3 border rounded-lg" />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images: <span className="font-normal text-gray-600 ml-2">first image is cover (max 6)</span>
          </p>

          <div className="flex gap-4">
            <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="p-3 border rounded w-full" />
            <button type="button" onClick={handleImageSubmit} disabled={uploading} className="p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative border rounded-lg overflow-hidden">
                  <img src={url} alt={`uploaded-${index}`} className="h-40 w-full object-cover" />
                  {index === 0 && <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Cover</span>}
                  <button type="button" onClick={() => handleDeleteImage(url)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} className="p-3 bg-slate-700 text-white rounded-lg uppercase font-bold hover:opacity-95">
            {loading ? "Updating..." : "Update Listing"}
          </button>

          {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
