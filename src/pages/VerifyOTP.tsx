import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ShieldCheck, Loader2, ArrowRight } from "lucide-react";

export default function VerifyOTP() {

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Please register first");
      navigate("/register");
    }
  }, [email, navigate]);

  const handleChange = (value: string, index: number) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }

  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {

    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    const filledOtp = [...otp];

    newOtp.forEach((digit, i) => {
      if (i < 6) filledOtp[i] = digit;
    });

    setOtp(filledOtp);

    inputsRef.current[5].focus();
  };

  const handleVerify = async (e: React.FormEvent) => {

    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return toast.error("Enter 6-digit OTP");
    }

    setLoading(true);

    try {

      const response = await axios.post(
        "https://rentkaroo-backend-n49e.onrender.com/api/v1/auth/verify-otp",
        {
          email,
          otp: otpCode
        }
      );

      if (response.data.success) {
        toast.success("Account Verified!");
        navigate("/login");
      }

    } catch (error: any) {

      toast.error(error.response?.data?.message || "Invalid OTP");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">

      {/* LEFT PANEL */}

      <div className="relative hidden w-[35%] lg:block bg-[#1a332e]">
        <div className="absolute inset-0 bg-[#0fb478]/80" />

        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white text-center">

          <ShieldCheck size={80} className="mx-auto mb-6 opacity-50" />

          <h1 className="text-4xl font-black mb-4">
            Security First
          </h1>

          <p className="font-bold opacity-80">
            We've sent a verification code to your email.
          </p>

        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex w-full flex-col justify-center px-8 lg:w-[65%] lg:px-24">

        <div className="mx-auto w-full max-w-md space-y-8">

          <div>

            <h2 className="text-4xl font-black text-[#1a332e]">
              Verify OTP
            </h2>

            <p className="text-[#4a635d] font-bold">
              Code sent to <span className="text-[#0fb478]">{email}</span>
            </p>

          </div>

          <form onSubmit={handleVerify} className="space-y-6">

            <div className="flex justify-between gap-3">

              {otp.map((digit, index) => (

                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-[#0fb478] outline-none"
                />

              ))}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1a332e] py-4 text-lg font-black text-white hover:bg-black disabled:opacity-50"
            >

              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Verify Account
                  <ArrowRight size={20} />
                </>
              )}

            </button>

          </form>

        </div>

      </div>

    </div>
  );

}