import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { supportAPI } from "@/services/api";
import { X } from "lucide-react"; // Assuming you use lucide-react for icons

export default function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Reply Modal
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await supportAPI.getAll();
      setTickets(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      // Note: Ensure your supportAPI has a 'reply' method defined
      await supportAPI.reply(selectedTicket._id, { message: replyMessage });
      
      alert("Reply sent and ticket resolved!");
      setReplyMessage("");
      setSelectedTicket(null);
      fetchTickets(); // Refresh the list
    } catch (err) {
      console.error("Reply error:", err);
      alert("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Support Requests</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading requests...</p>
        ) : tickets.length === 0 ? (
          <p className="text-muted-foreground">No support requests yet.</p>
        ) : (
          <div className="grid gap-4">
            {tickets.map((t) => (
              <div key={t._id} className="border rounded-xl p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      t.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {t.status}
                    </span>
                    <h3 className="font-bold text-gray-800">{t.subject}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{t.message}</p>
                  <p className="text-xs text-muted-foreground">From: {t.name} ({t.email})</p>
                </div>

                <button 
                  onClick={() => setSelectedTicket(t)}
                  className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View & Reply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- REPLY MODAL --- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-1">Reply to Ticket</h2>
            <p className="text-sm text-muted-foreground mb-4">Subject: {selectedTicket.subject}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm italic border-l-4 border-gray-300">
              "{selectedTicket.message}"
            </div>

            <form onSubmit={handleReply} className="space-y-4">
              <textarea
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                rows={5}
                placeholder="Write your response here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Reply & Resolve"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}