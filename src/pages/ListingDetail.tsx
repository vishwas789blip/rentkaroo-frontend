import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { listingAPI, reviewAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  MapPin, Star, Share, Heart, Wifi, 
  Wind, UtensilsCrossed, Car, Dumbbell, Zap, WashingMachine,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const facilityIcons: Record<string, any> = {
  wifi: Wifi, ac: Wind, kitchen: UtensilsCrossed,
  parking: Car, gym: Dumbbell, security: Zap, laundry: WashingMachine,
};

const facilityLabels: Record<string, string> = {
  wifi: "High-speed Wi-Fi", ac: "Air conditioning",
  kitchen: "Modular Kitchen", parking: "Covered parking",
  gym: "Fitness Center", security: "24/7 CCTV Security", laundry: "Laundry Service",
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchReviews = async () => {
    try {
      const reviewsRes = await reviewAPI.getByListing(id);
      setReviews(reviewsRes.data?.data || []);
    } catch { setReviews([]); }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingRes = await listingAPI.getById(id);
        const data = listingRes.data?.data?.listing || listingRes.data?.data || listingRes.data;
        setListing(data);
        fetchReviews();
      } catch (err) {
        console.error("Listing fetch error:", err);
        setListing(null);
      } finally { setLoading(false); }
    };
    if (id) fetchData();
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing?.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch (err) { console.error(err); }
  };

  const handleReviewSubmit = async () => {
    if (!rating) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please write a comment");
    
    try {
      setSubmittingReview(true);
      await reviewAPI.create({ listingId: id, rating, comment });
      toast.success("Review posted!");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to post review");
    } finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#0fb478]" />
        <p className="font-bold text-[#1a332e] animate-pulse">Loading PG Details...</p>
      </div>
    </MainLayout>
  );

  if (!listing) return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh] text-center px-6">
        <div>
          <h2 className="text-3xl font-black text-[#1a332e] mb-4">Listing not found</h2>
          <Button className="bg-[#0fb478] rounded-xl px-8" onClick={() => navigate("/listings")}>Back to search</Button>
        </div>
      </div>
    </MainLayout>
  );

  const images = listing.images?.length > 0 
    ? listing.images.map((img: any) => img.url) 
    : ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : (typeof listing.rating === 'object' ? listing.rating.average : listing.rating) || "New";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#1a332e] tracking-tight">{listing.title}</h1>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4a635d]">
              <div className="flex items-center gap-1 bg-[#f0f9f6] text-[#0fb478] px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-[#0fb478]" />
                <span>{avgRating}</span>
              </div>
              <span>·</span>
              <span className="underline underline-offset-4">{reviews.length} reviews</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {listing.address?.city}, {listing.address?.state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-xl font-bold gap-2" onClick={handleShare}>
                <Share size={18}/> Share
              </Button>
              <Button variant="ghost" onClick={() => setSaved(!saved)} className={`rounded-xl font-bold gap-2 ${saved ? "text-red-500" : ""}`}>
                <Heart size={18} className={saved ? "fill-current" : ""} /> {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Gallery */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 aspect-video max-h-[35rem]">
            <div className="md:col-span-2 md:row-span-2 relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={imgIdx} src={images[imgIdx]} 
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1))} className="bg-white/90 p-2 rounded-full shadow-lg"><ChevronLeft /></button>
                  <button onClick={() => setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1))} className="bg-white/90 p-2 rounded-full shadow-lg"><ChevronRight /></button>
                </div>
              )}
            </div>
            {images.slice(1, 5).map((img: string, i: number) => (
              <div key={i} className="hidden md:block overflow-hidden bg-gray-100">
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Host Section */}
            <section className="flex items-center justify-between pb-8 border-b">
              <div>
                <h2 className="text-2xl font-black text-[#1a332e]">
                  {listing.type || "Studio PG"} in {listing.address?.city}
                </h2>
                <p className="text-[#0fb478] font-bold text-sm mt-1">
                  Managed by {listing.owner?.name || "Premium Host"}
                </p>
                <div className="flex gap-2 text-[#4a635d] font-medium mt-1">
                </div>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-[#1a332e] text-white flex items-center justify-center font-black text-xl uppercase">
                {(listing.owner?.name || "H")[0]}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h3 className="text-xl font-black text-[#1a332e] mb-6">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities?.map((a: string) => {
                  const Icon = facilityIcons[a] || Zap;
                  return (
                    <div key={a} className="flex items-center gap-4 p-4 rounded-2xl bg-[#f9fbfb] border border-[#e0f2ec]">
                      <Icon className="h-6 w-6 text-[#0fb478]" />
                      <span className="font-bold text-[#4a635d]">{facilityLabels[a] || a}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Description */}
            <section>
              <h3 className="text-xl font-black text-[#1a332e] mb-4">About this PG</h3>
              <p className="text-[#4a635d] leading-relaxed whitespace-pre-line">{listing.description}</p>
            </section>

            {/* Reviews Section */}
            <section className="pt-8 border-t">
              <div className="flex items-center gap-3 mb-8">
                <Star className="fill-[#0fb478] text-[#0fb478]" />
                <h3 className="text-2xl font-black text-[#1a332e]">{avgRating} · {reviews.length} reviews</h3>
              </div>

              {/* Review Input Form */}
              {isAuthenticated ? (
                <div className="mb-10 p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100">
                  <h4 className="font-bold text-[#1a332e] mb-4">Leave a Review</h4>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star className={`h-6 w-6 ${rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-4 rounded-xl border-none ring-1 ring-emerald-100 focus:ring-2 focus:ring-[#0fb478] outline-none min-h-[100px] mb-4"
                    placeholder="Tell us about your stay..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button 
                    onClick={handleReviewSubmit}
                    disabled={submittingReview}
                    className="bg-[#1a332e] text-white rounded-xl"
                  >
                    {submittingReview ? "Posting..." : "Submit Review"}
                  </Button>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center">
                   <p className="text-sm font-bold text-[#4a635d]">Log in to share your review</p>
                </div>
              )}

              {/* Review List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((r: any) => (
                  <div key={r._id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold uppercase">
                        {(r.user?.name || "U")[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1a332e]">{r.user?.name || "User"}</p>
                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-sm text-[#4a635d]">{r.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white border rounded-[2rem] p-8 shadow-xl space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-[#1a332e]">₹{listing.pricePerMonth?.toLocaleString()}</span>
                  <span className="text-[#4a635d] font-bold text-sm"> /mo</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-black text-[#0fb478]">
                  <Star size={14} className="fill-current" /> {avgRating}
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-[10px] font-black uppercase text-[#0fb478] mb-1">Allowed For</p>
                <p className="text-sm font-bold text-[#4a635d] capitalize">{listing.genderType || "Anyone"}</p>
              </div>

              <Button 
                onClick={() => {
                  if (!isAuthenticated) return navigate("/login");
                  if (user?.id === (listing.owner?._id || listing.owner)) return toast.error("Owner cannot book own PG");
                  navigate(`/booking/${listing._id}`);
                }}
                className="w-full h-14 text-lg font-black bg-[#0fb478] hover:bg-[#0d9a66] rounded-2xl shadow-lg shadow-emerald-100"
              >
                Book Now
              </Button>
              
              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm font-bold text-[#4a635d]">
                  <span className="underline">Monthly Rent</span>
                  <span>₹{listing.pricePerMonth?.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-black text-[#1a332e]">
                  <span>Total</span>
                  <span>₹{listing.pricePerMonth?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListingDetail;