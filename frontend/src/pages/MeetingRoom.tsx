import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPhoneSlash, FaVideo, FaSpinner } from "react-icons/fa";

const MeetingRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const jitsiApiRef = React.useRef<any>(null);
  const hasJoined = React.useRef(false);

  useEffect(() => {
    const fetchDetails = async () => {
      // Check URL params first
      const searchParams = new URLSearchParams(window.location.search);
      const serviceFromUrl = searchParams.get("service");

      if (serviceFromUrl) {
        setConsultation({ service: serviceFromUrl });
        setLoading(false);
        return;
      }

      try {
        const hostname = window.location.hostname;
        const apiUrl =
          import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
        const res = await fetch(`${apiUrl}/api/consultations/${id}/public`);
        if (res.ok) {
          const data = await res.json();
          setConsultation(data);
        } else {
          setConsultation({ error: `${res.status} ${res.statusText}` });
        }
      } catch (err: any) {
        console.error("Failed to fetch meeting details", err);
        setConsultation({ error: err.message || "Network Error" });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Determine the display name (User or Admin)
  const displayName = "Participant";

  // Separate function for the API call to complete the session
  const completeSession = async (force: boolean = false) => {
    // If not forced (auto-event), strictly check joined status
    if (!force && !hasJoined.current) return;

    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

      if (id) {
        const res = await fetch(`${apiUrl}/api/consultations/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Failed to complete session:", errData);
          if (force) {
            alert(
              `Note: Session ended, but status update failed: ${errData.error || res.statusText}`,
            );
          }
        } else {
          console.log("Session completed successfully via API.");
        }
      }
    } catch (error: any) {
      console.error("Error completing session:", error);
      if (force) {
        alert(`Network Error: Update failed - ${error.message}`);
      }
    }
  };

  // Handle Jitsi internal events (Automatic)
  const handleJitsiEvent = () => {
    if (hasJoined.current) {
      completeSession(false);
    }
  };

  // Handle Manual "End & Return" Button Click
  const handleManualExit = async () => {
    // Automatically complete on exit as per user request (no prompt)
    await completeSession(true);
    navigate("/");
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (jitsiApiRef.current) return;

    // Internal init function
    const initJitsi = () => {
      // Double check to be sure
      if (jitsiApiRef.current) return;

      const domain = "meet.jit.si";
      const options = {
        roomName: `GlobalUSHRC_Consultation_${id}`,
        width: "100%",
        height: "100%",
        parentNode: document.getElementById("jitsi-container"),
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "profile",
            "chat",
            "recording",
            "livestreaming",
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "invite",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "download",
            "help",
            "mute-everyone",
            "e2ee",
          ],
        },
        userInfo: {
          displayName: displayName,
        },
      };

      // @ts-ignore
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      // Event Listener for hangup / leave
      api.addEventListeners({
        videoConferenceJoined: () => {
          hasJoined.current = true;
        },
        videoConferenceLeft: handleJitsiEvent,
        readyToClose: handleJitsiEvent,
      });
    };

    // Load Jitsi Script if not already loaded
    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.JitsiMeetExternalAPI) {
          initJitsi();
        }
      };
    }

    // Cleanup function
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [id]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700 relative">
        <div className="flex items-center gap-4 z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <FaVideo />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight">
              Live Consultation Session
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              ID: {id} • Secure encrypted channel
            </p>
          </div>
        </div>

        {/* Central Service Display - Always Visible */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-white text-sm md:text-lg font-serif tracking-wide border-b border-white/20 pb-1 text-center whitespace-nowrap">
            Consultation Service Type :{" "}
            <span className="font-light opacity-90">
              {loading
                ? "Loading..."
                : consultation?.service
                  ? consultation.service
                  : consultation?.error
                    ? `Error: ${consultation.error}`
                    : "Unavailable"}
            </span>
          </h2>
        </div>

        <button
          onClick={handleManualExit}
          className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 z-10"
        >
          <FaPhoneSlash /> End & Return
        </button>
      </div>

      {/* Main Meeting Area */}
      <div className="flex-grow relative bg-slate-950 flex items-center justify-center">
        {/* Company Logo Overlay - Top Left */}
        <img
          src="/logo.png"
          alt="Company Logo"
          className="absolute top-6 left-6 w-32 md:w-40 z-50 opacity-90 pointer-events-none drop-shadow-2xl"
        />

        {loading && (
          <div className="text-white flex flex-col items-center gap-4 absolute z-0">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <p className="text-sm font-medium tracking-widest uppercase">
              Preparing Secure Room...
            </p>
          </div>
        )}

        {/* Jitsi Container */}
        <div id="jitsi-container" className="w-full h-full"></div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-t border-slate-700 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <div>Powered by Global US HRC Secure Connect</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-500">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            System Active
          </span>
          <span>Latency: Optimal</span>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default MeetingRoom;
