import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Mail, Home, Eye, EyeOff, Lock, Loader2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ================= LEFT SIDE: VISUAL PANEL ================= */}
      <div className="relative hidden w-[40%] lg:block bg-[#1a332e]">
        {/* Background Image with Overlay */}
        <img
          src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          alt="Interior"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0fb478]/80 to-[#1a332e]/95" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
            RentKaroo
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-black leading-[1.1]">
              Welcome <br /> back.
            </h1>
            <p className="text-emerald-50/70 text-lg font-medium max-w-sm">
              Log in to manage your bookings, explore new PGs, and stay connected with the community.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg"><ShieldCheck size={20} /></div>
                <span className="text-sm font-bold">Secure Authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg"><Zap size={20} /></div>
                <span className="text-sm font-bold">Fast Dashboard Access</span>
              </div>
            </div>
          </div>

          <p className="text-xs font-bold tracking-widest opacity-40 uppercase">
            Est. 2026
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM PANEL ================= */}
      <div className="flex w-full items-center justify-center px-8 lg:w-[60%] lg:px-20">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-[#1a332e]">Sign In</h2>
            <p className="text-[#4a635d] font-medium">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0fb478] ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#cedcd7]" />
                  <input
                    type="email"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-[#f8faf9] py-5 pl-14 pr-4 font-bold text-[#1a332e] outline-none transition-all border-2 border-transparent focus:border-[#0fb478] focus:bg-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0fb478]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#cedcd7]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl bg-[#f8faf9] py-5 pl-14 pr-14 font-bold text-[#1a332e] outline-none transition-all border-2 border-transparent focus:border-[#0fb478] focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#cedcd7] hover:text-[#0fb478] transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1a332e] py-5 text-lg font-black text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Log In <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-100">
                <Link to="/forgot-password" size="sm" className="text-sm font-bold text-[#4a635d] hover:text-[#0fb478]">
                  Forgot your password?
                </Link>
                <p className="text-sm font-bold text-[#4a635d]">
                  Already a member?{" "}
                  <Link to="/register" className="text-[#0fb478] hover:underline underline-offset-4">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}