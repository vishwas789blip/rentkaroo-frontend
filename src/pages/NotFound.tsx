import { useNavigate } from "react-router-dom";
import { MoveLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Simple Large Text */}
        <div className="space-y-2">
          <h1 className="text-9xl font-light text-gray-200 tracking-tighter">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Page not found
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Sorry, we couldn’t find the page you’re looking for. Check the URL or return home.
          </p>
        </div>

        {/* Minimalist Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={() => navigate("/")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl transition-all"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-900 font-bold h-12"
          >
            <MoveLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>

        {/* Subtle Brand Footer */}
        <div className="pt-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
            RentKaroo Support
          </p>
        </div>

      </div>
    </div>
  );
};

export default NotFound;