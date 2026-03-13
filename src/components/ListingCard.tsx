import { Link } from "react-router-dom";
import { Star, MapPin, CheckCircle2, Zap } from "lucide-react";

interface ListingCardProps {
  listing: any;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  // 1. Fallback Image with better UI
  const image = listing.images?.[0]?.url || 
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800";

  const amenities = listing.amenities || [];
  
  // 2. Safe Rating Extraction (Prevents the "Object as Child" crash)
  const ratingValue = typeof listing.rating === 'object' 
    ? listing.rating?.average 
    : listing.rating;

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group relative block overflow-hidden rounded-[2.5rem] border border-[#e0f2ec] bg-white p-2 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(15,180,120,0.15)] hover:-translate-y-2"
    >
      {/* ================= IMAGE CONTAINER ================= */}
      <div className="relative aspect-[1.1/1] overflow-hidden rounded-[2rem]">
        <img
          src={image}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Price Badge - More prominent font weight */}
          <div className="flex flex-col rounded-2xl bg-white/90 backdrop-blur-md px-4 py-2 shadow-xl border border-white/20">
            <span className="text-[10px] uppercase tracking-tighter font-black text-[#0fb478]">Monthly</span>
            <span className="text-lg font-black text-[#1a332e] leading-none">
              ₹{listing.pricePerMonth?.toLocaleString()}
            </span>
          </div>
          
          {listing.type && (
            <div className="w-fit rounded-full bg-[#1a332e] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
              {listing.type}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
           {listing.isAvailable ? (
             <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black text-[#0fb478] shadow-sm">
                <Zap size={12} className="fill-[#0fb478]" />
                INSTANT BOOK
             </div>
           ) : (
             <div className="rounded-full bg-red-50/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black text-red-500">
                FULL
             </div>
           )}
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="p-4 space-y-4">
        
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-black text-[#1a332e] tracking-tight line-clamp-1 group-hover:text-[#0fb478] transition-colors">
              {listing.title}
            </h3>
            
            {/* Rating with fallback check */}
            {ratingValue > 0 ? (
              <div className="flex items-center gap-1 rounded-xl bg-[#fff9eb] px-2.5 py-1 border border-[#fef3c7] shrink-0">
                <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                <span className="text-xs font-black text-[#92400e]">{Number(ratingValue).toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-[#4a635d] bg-gray-50 px-2 py-1 rounded-lg">New</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[#4a635d]">
            <MapPin className="h-3.5 w-3.5 text-[#0fb478]" />
            <span className="text-xs font-bold opacity-80 uppercase tracking-wide italic">
              {listing.address?.city} • {listing.address?.state}
            </span>
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="flex flex-wrap gap-1.5">
          {amenities.slice(0, 3).map((a: string) => (
            <span
              key={a}
              className="rounded-xl bg-[#f0f9f6] px-3 py-1.5 text-[10px] font-black text-[#0fb478] border border-[#d1e9df] uppercase tracking-tighter"
            >
              {a}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="text-[10px] font-bold text-[#4a635d] flex items-center px-1">
              +{amenities.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f9f6]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#0fb478] animate-pulse" />
            <span className="text-[10px] font-black text-[#1a332e] uppercase tracking-widest">Verified PG</span>
          </div>
          
          <div className="flex items-center gap-2 text-[#0fb478] text-xs font-black uppercase tracking-tighter">
            View Details
            <div className="w-8 h-8 rounded-full bg-[#f9fbfb] border border-[#e0f2ec] flex items-center justify-center group-hover:bg-[#0fb478] group-hover:text-white transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;