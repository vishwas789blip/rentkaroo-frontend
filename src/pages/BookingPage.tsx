import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { listingAPI, bookingAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, Users, ArrowLeft, Loader2, Info } from "lucide-react";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState(1);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await listingAPI.getById(id);
        // Matching your backend response structure
        const data = res.data?.data?.listing || res.data?.data || res.data;
        setListing(data);
      } catch (err) {
        toast.error("Failed to load listing");
        navigate("/listings");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id, navigate]);

  const duration = checkInDate && checkOutDate
    ? Math.max(0, (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalAmount = duration > 0 && listing
    ? Math.round((listing.pricePerMonth / 30) * duration * numberOfRooms)
    : 0;

  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate || duration <= 0) {
      toast.error("Please select valid stay dates");
      return;
    }

    try {
      setSubmitting(true);
      
      // Matches your router: router.post("/", authenticate, authorize("user")...)
      await bookingAPI.create({
        pgListingId: id,
        checkInDate,
        checkOutDate,
        numberOfRooms,
      });

      toast.success("Booking request sent!");
      
      // Matches your requirement: Redirect to user bookings dashboard
      navigate("/dashboard/user");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Details</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#fcfdfc] py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors mb-10"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            BACK TO SEARCH
          </button>

          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* FORM SECTION */}
            <div className="lg:col-span-3 space-y-10">
              <section>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Confirm Booking</h1>
                <p className="text-gray-500 font-medium">Review your dates and room selection before confirming.</p>
              </section>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 ml-1">Arrival</label>
                    <input
                      type="date"
                      min={today}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-5 font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 ml-1">Departure</label>
                    <input
                      type="date"
                      min={checkInDate || today}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-5 font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">Rooms</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Max: {listing?.rooms?.availableRooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setNumberOfRooms(p => Math.max(1, p - 1))}
                      className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black hover:bg-gray-100"
                    >–</button>
                    <span className="font-black w-4 text-center">{numberOfRooms}</span>
                    <button
                      onClick={() => setNumberOfRooms(p => Math.min(listing?.rooms?.availableRooms || 1, p + 1))}
                      className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black hover:bg-gray-100"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY SECTION */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-emerald-900/5 sticky top-10">
                <img
                  src={listing.images?.[0]?.url}
                  alt={listing.title}
                  className="w-full h-48 rounded-3xl object-cover mb-6"
                />
                
                <h3 className="text-xl font-black text-gray-900 mb-6">{listing.title}</h3>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Duration</span>
                    <span className="text-gray-900">{duration} Days</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Monthly</span>
                    <span className="text-gray-900">₹{listing.pricePerMonth?.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Total Price</span>
                    <span className="text-3xl font-black text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={!totalAmount || submitting}
                  className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all shadow-lg shadow-emerald-600/20"
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </Button>

                <p className="mt-6 flex gap-2 text-[10px] font-bold text-gray-400 leading-tight">
                  <Info size={14} className="shrink-0" />
                  BY PROCEEDING, YOU AGREE TO THE PROPERTY RULES AND PAYMENT TERMS.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingPage;