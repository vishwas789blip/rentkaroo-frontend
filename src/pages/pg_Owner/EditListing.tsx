import { useState } from "react";
import api from "@/services/api";

interface Props {
  listingId: string;
  existingData: any;
}

export default function EditListing({ listingId, existingData }: Props) {
  const [title, setTitle] = useState(existingData.title);
  const [description, setDescription] = useState(existingData.description);
  const [pricePerMonth, setPrice] = useState(existingData.pricePerMonth);
  const [city, setCity] = useState(existingData.address.city);
  const [state, setState] = useState(existingData.address.state);
  const [street, setStreet] = useState(existingData.address.street);
  const [pincode, setPincode] = useState(existingData.address.pincode);
  const [availableRooms, setRooms] = useState(existingData.rooms.availableRooms);
  const [roomType, setRoomType] = useState(existingData.rooms.roomType);

  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("pricePerMonth", String(pricePerMonth));

      formData.append("street", street);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);

      formData.append("availableRooms", String(availableRooms));
      formData.append("roomType", roomType);

      if (images) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);
        });
      }

      await api.put(`/pg-listings/${listingId}`, formData);

      alert("Listing updated successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 w-full"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-full"
      />

      <input
        type="number"
        value={pricePerMonth}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Price"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        placeholder="Street"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Pincode"
        className="border p-2 w-full"
      />

      <input
        type="number"
        value={availableRooms}
        onChange={(e) => setRooms(Number(e.target.value))}
        placeholder="Available Rooms"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        placeholder="Room Type"
        className="border p-2 w-full"
      />

      <input
        type="file"
        multiple
        onChange={(e) => setImages(e.target.files)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2"
      >
        {loading ? "Updating..." : "Update Listing"}
      </button>

    </form>
  );
}