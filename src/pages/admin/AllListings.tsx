import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { listingAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Listing = {
  _id: string;
  title: string;
  pricePerMonth: number;
  address?: {
    city?: string;
  };
};

export default function AllListings() {

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchListings = async () => {

      try {

        const res = await listingAPI.getAll();
        setListings(res.data.data.listings || []);

      } catch (err) {

        console.error(err);
        toast.error("Failed to fetch listings");

      } finally {

        setLoading(false);

      }

    };

    fetchListings();

  }, []);


  const handleDelete = async (id: string) => {

    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {

      await listingAPI.delete(id);

      setListings((prev) =>
        prev.filter((listing) => listing._id !== id)
      );

      toast.success("Listing deleted successfully");

    } catch (err) {

      console.error(err);
      toast.error("Failed to delete listing");

    }

  };

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-semibold mb-6">
          All Listings
        </h1>

        {loading ? (

          <p>Loading listings...</p>

        ) : listings.length === 0 ? (

          <p className="text-muted-foreground">
            No listings available
          </p>

        ) : (

          <div className="space-y-4">

            {listings.map((listing) => (

              <div
                key={listing._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >

                <div>

                  <p className="font-medium">
                    {listing.title}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {listing.address?.city || "Unknown city"}
                  </p>

                  <p className="text-sm font-semibold">
                    ₹{listing.pricePerMonth}
                  </p>

                </div>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(listing._id)}
                >
                  Delete
                </Button>

              </div>

            ))}

          </div>

        )}

      </div>

    </DashboardLayout>

  );

}