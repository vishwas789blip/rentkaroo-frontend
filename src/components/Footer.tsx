import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Github, Linkedin, Instagram, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#f9fbfb] border-t border-[#e0f2ec] mt-20">
      <div className="container mx-auto px-6 pt-16 pb-8">
        
        <div className="grid gap-12 md:grid-cols-12 mb-16">

          {/* Brand & Mission - 4 Columns */}
          <div className="md:col-span-4 space-y-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-black text-[#1a332e]"
            >
              <div className="rounded-xl bg-[#0fb478] p-2 shadow-lg shadow-[#0fb478]/20">
                <Home className="h-5 w-5 text-white" />
              </div>
              RentKaroo
            </Link>

            <p className="text-[#4a635d] text-sm leading-relaxed max-w-sm font-medium">
              We're on a mission to simplify student living. From verified listings to seamless bookings, find your next home away from home with confidence.
            </p>

            {/* Social Icons - Themed */}
            <div className="flex gap-3">
              {[Instagram, Linkedin, Github].map((Icon, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#e0f2ec] text-[#4a635d] hover:bg-[#0fb478] hover:text-white hover:border-[#0fb478] transition-all duration-300 shadow-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - 2 Columns */}
          <div className="md:col-span-2">
            <h4 className="text-[#1a332e] font-black text-xs uppercase tracking-[0.15em] mb-6">
              Platform
            </h4>
            <ul className="space-y-4 text-sm font-bold text-[#4a635d]">
              <li><Link to="/listings" className="hover:text-[#0fb478] transition-colors">Browse PGs</Link></li>
              <li><Link to="/listings" className="hover:text-[#0fb478] transition-colors">Safety Hub</Link></li>
              <li><Link to="/register" className="hover:text-[#0fb478] transition-colors">Partner with us</Link></li>
            </ul>
          </div>

          {/* Support - 2 Columns */}
          <div className="md:col-span-2">
            <h4 className="text-[#1a332e] font-black text-xs uppercase tracking-[0.15em] mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-sm font-bold text-[#4a635d]">
              <li><Link to="/help" className="hover:text-[#0fb478] transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-[#0fb478] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-[#0fb478] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter - 4 Columns */}
          <div className="md:col-span-4 space-y-6">
            {/* <h4 className="text-[#1a332e] font-black text-xs uppercase tracking-[0.15em] mb-4">
              Get Updates
            </h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white border border-[#e0f2ec] rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#0fb478] outline-none transition-all pr-12 shadow-sm"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#0fb478] text-white px-3 rounded-xl hover:bg-[#1a332e] transition-colors">
                <Send size={16} />
              </button>
            </div> */}
            
            <div className="pt-4 space-y-3">
               <div className="flex items-center gap-3 text-sm font-bold text-[#1a332e]">
                 <div className="p-2 bg-[#f0f9f6] rounded-lg text-[#0fb478]"><Mail size={16} /></div>
                 support@rentkaroo.com
               </div>
               <div className="flex items-center gap-3 text-sm font-bold text-[#1a332e]">
                 <div className="p-2 bg-[#f0f9f6] rounded-lg text-[#0fb478]"><Phone size={16} /></div>
                 +91 9410448110
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e0f2ec] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-[#4a635d] tracking-wide">
            © {new Date().getFullYear()} RENTKAROO TECHNOLOGIES. MADE IN INDIA 🇮🇳
          </p>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0fb478] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4a635d]">
              System Status: All systems live
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;