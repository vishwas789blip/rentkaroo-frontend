import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      await authAPI.forgotPassword(email);
      toast.success("Reset link sent to your email 📧");
      setEmail("");
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;