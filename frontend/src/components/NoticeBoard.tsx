import { useState, useEffect } from "react";
import { FaBell, FaInfoCircle } from "react-icons/fa";

interface Notice {
  id: number;
  content: string;
  priority: "normal" | "high";
  date: string;
}

const NoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const hostname = window.location.hostname;
        const apiUrl =
          import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
        const res = await fetch(`${apiUrl}/api/notices`);
        if (res.ok) {
          const data = await res.json();
          // Sort recent first
          data.sort(
            (a: Notice, b: Notice) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setNotices(data);
          console.log("NoticeBoard fetched successfully:", data);
        } else {
          console.error("NoticeBoard fetch failed:", res.status);
        }
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading || notices.length === 0) {
    if (notices.length === 0 && !loading) {
      console.log("NoticeBoard: No notices to display.");
    }
    return null;
  }

  console.log("NoticeBoard: Rendering", notices.length, "notices.");

  return (
    <div className="bg-slate-900 py-3 border-b border-slate-800 overflow-hidden relative z-[40] mt-20 md:mt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 animate-pulse shadow-sm min-w-max">
            <FaBell className="text-xl" />
            <span className="font-black uppercase tracking-[0.2em] text-xs">
              Notice Board
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden h-10 flex items-center">
            <div
              className={`flex gap-12 whitespace-nowrap ${notices.length > 1 ? "animate-marquee" : ""}`}
            >
              {notices.map((notice) => (
                <div key={notice.id} className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${notice.priority === "high" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-blue-500"}`}
                  ></span>
                  <p
                    className={`text-sm font-black tracking-wide ${notice.priority === "high" ? "text-red-400" : "text-blue-300"}`}
                  >
                    {notice.content}
                    <span className="ml-3 text-[10px] text-slate-400 font-medium">
                      ({new Date(notice.date).toLocaleDateString()})
                    </span>
                  </p>
                </div>
              ))}
              {/* Duplicate for seamless loop if multiple */}
              {notices.length > 1 &&
                notices.map((notice) => (
                  <div
                    key={`${notice.id}-dup`}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${notice.priority === "high" ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-blue-500"}`}
                    ></span>
                    <p
                      className={`text-sm font-bold tracking-wide ${notice.priority === "high" ? "text-red-700" : "text-slate-700"}`}
                    >
                      {notice.content}
                      <span className="ml-3 text-[10px] text-slate-400 font-medium">
                        ({new Date(notice.date).toLocaleDateString()})
                      </span>
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
            <FaInfoCircle className="text-lg" />
            <span className="font-bold text-[10px] uppercase tracking-widest">
              Global US HRC Updates
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee ${notices.length * 10}s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default NoticeBoard;
