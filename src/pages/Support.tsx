import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { supportAPI } from "@/services/api";
import { MessageCircle, Clock, CheckCircle } from "lucide-react";

export default function MySupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await supportAPI.getUserTickets();
        setTickets(res.data.data || []);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">My Support Requests</h1>

        {loading ? (
          <p>Loading your requests...</p>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 border rounded-xl border-dashed">
            <p className="text-muted-foreground">You haven't submitted any tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((t) => (
              <div key={t._id} className="border rounded-2xl overflow-hidden bg-white shadow-sm">
                {/* User's Original Message */}
                <div className="p-5 border-b bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{t.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                      t.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{t.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Submitted on: {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Admin Reply Section */}
                {t.adminReply?.message ? (
                  <div className="p-5 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-2 text-blue-700">
                      <MessageCircle size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Official Response</span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      {t.adminReply.message}
                    </p>
                    <p className="text-[10px] text-blue-500 mt-2">
                      Replied on: {new Date(t.adminReply.repliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 flex items-center gap-2 text-muted-foreground italic text-xs">
                    <Clock size={14} />
                    Waiting for admin response...
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}