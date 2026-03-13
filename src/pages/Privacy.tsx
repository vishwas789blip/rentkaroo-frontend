import MainLayout from "@/layouts/MainLayout";
import { ShieldCheck, Eye, Lock, Database, Info } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="text-blue-600" size={24} />,
      content: "We collect personal information such as your name, email address, contact details, and booking information when you create an account or make a reservation."
    },
    {
      title: "How We Use Information",
      icon: <Eye className="text-purple-600" size={24} />,
      content: "Your information helps us provide better services, manage bookings, communicate updates, and improve the overall user experience on our platform."
    },
    {
      title: "Data Protection",
      icon: <Lock className="text-green-600" size={24} />,
      content: "We use industry-standard encryption, secure servers, and best practices to protect your data from unauthorized access or disclosure."
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50/50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At <span className="font-bold text-black">RentKaroo</span>, your privacy is our top priority. 
              This policy explains how we handle your data with transparency and care.
            </p>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest pt-4">
              Last Updated: March 2026
            </div>
          </div>

          {/* Policy Cards */}
          <div className="grid gap-6">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="p-3 bg-gray-50 rounded-xl">
                  {section.icon}
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Info / Contact */}
          <div className="bg-black text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Info className="text-blue-400" />
              <p className="text-sm font-medium">
                Have questions about your data? Our support team is here to help.
              </p>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}