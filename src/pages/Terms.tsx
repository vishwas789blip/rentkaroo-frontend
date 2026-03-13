import MainLayout from "@/layouts/MainLayout";
import { Scale, UserCheck, Home, AlertCircle, FileText, Download } from "lucide-react";

export default function Terms() {
  const policies = [
    {
      id: "01",
      title: "User Responsibilities",
      icon: <UserCheck className="text-orange-600" size={22} />,
      desc: "Users must provide accurate, current, and complete information while creating accounts, booking properties, or listing their PG accommodations."
    },
    {
      id: "02",
      title: "Property Listings",
      icon: <Home className="text-blue-600" size={22} />,
      desc: "PG owners are solely responsible for ensuring that all listing details, high-quality images, and pricing information are accurate and up to date."
    },
    {
      id: "03",
      title: "Platform Usage",
      icon: <AlertCircle className="text-red-600" size={22} />,
      desc: "Any misuse of the platform, including fraudulent bookings, spam, or misleading listings, may result in immediate account suspension."
    }
  ];

  return (
    <MainLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider">
                  <Scale size={14} /> Legal Framework
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Terms & Conditions</h1>
                <p className="text-gray-500 max-w-xl">
                  Please read these terms carefully before using the RentKaroo platform. 
                  By accessing our services, you agree to be bound by these rules.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid gap-8">
            {policies.map((item) => (
              <div key={item.id} className="group relative pl-12 md:pl-16">
                {/* Numbering Line */}
                <div className="absolute left-0 top-0 text-4xl md:text-5xl font-black text-gray-100 group-hover:text-gray-200 transition-colors select-none">
                  {item.id}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Agreement Footer */}
          <div className="mt-16 p-8 bg-orange-50/50 rounded-3xl border border-orange-100 border-dashed">
            <div className="flex gap-4">
              <FileText className="text-orange-600 shrink-0" size={24} />
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900">Acceptance of Terms</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  By continuing to use RentKaroo, you acknowledge that you have read and understood 
                  these terms. We reserve the right to update these conditions at any time. 
                  Users will be notified of significant changes via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}