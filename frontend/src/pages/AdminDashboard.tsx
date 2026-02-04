import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import {
  FaFileAlt,
  FaDownload,
  FaSyncAlt,
  FaEnvelope,
  FaTrash,
  FaDatabase,
  FaRegCalendarAlt,
  FaGlobeAmericas,
  FaHome,
  FaBriefcase,
  FaBell,
  FaSignOutAlt,
  FaPrint,
  FaNewspaper,
  FaUserPlus,
  FaVideo,
  FaCheckCircle,
  FaKey,
  FaUsers,
} from "react-icons/fa";
import { Editor, EditorProvider } from "react-simple-wysiwyg";

interface UploadedFile {
  name: string;
  url: string;
  date: string;
}

interface Submission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    region?: string;
    country?: string;
    ip?: string;
  };
  document?: string;
}

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    region?: string;
    country?: string;
    ip?: string;
  };
  paymentId?: string;
  amountPaid?: number;
  status: string;
  createdAt: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  filename: string;
  url: string;
  date: string;
  type: string;
}

interface Notice {
  id: number;
  content: string;
  priority: "normal" | "high";
  date: string;
}

interface User {
  id: number;
  username: string;
}

const AdminDashboard = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]); // New State

  // User Management State
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordId, setChangePasswordId] = useState<number | null>(null);
  const [newPasswordForUpdate, setNewPasswordForUpdate] = useState("");

  // Billing Modal State
  const [selectedConsultationForBill, setSelectedConsultationForBill] =
    useState<Consultation | null>(null);
  const [showBillModal, setShowBillModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "submissions" | "consultations" | "files" | "news" | "notices" | "admins"
  >("submissions");

  // News Form State
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Notice Form State
  const [noticeContent, setNoticeContent] = useState("");
  const [noticePriority, setNoticePriority] = useState<"normal" | "high">(
    "normal",
  );
  const [isPostingNotice, setIsPostingNotice] = useState(false);
  const navigate = useNavigate();

  const getApiUrl = () => {
    const hostname = window.location.hostname;
    return import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const apiUrl = getApiUrl();
      // Fetch Files
      const filesRes = await fetch(`${apiUrl}/api/uploads`);
      if (!filesRes.ok) throw new Error(`Files error (${filesRes.status})`);
      const filesData = await filesRes.json();
      setFiles(filesData);

      // Fetch Submissions
      const subRes = await fetch(`${apiUrl}/api/submissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!subRes.ok) throw new Error(`Submissions error (${subRes.status})`);
      const subData = await subRes.json();
      setSubmissions(subData);

      // Fetch Consultations
      const consRes = await fetch(`${apiUrl}/api/consultations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!consRes.ok)
        throw new Error(`Consultations error (${consRes.status})`);
      const consData = await consRes.json();
      setConsultations(consData);

      // Fetch News
      const newsRes = await fetch(`${apiUrl}/api/news`);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
      }

      // Fetch Notices
      const noticesRes = await fetch(`${apiUrl}/api/notices`);
      if (noticesRes.ok) {
        const noticesData = await noticesRes.json();
        setNotices(noticesData);
      }

      // Fetch Users
      const usersRes = await fetch(`${apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (err: any) {
      if (err.message.includes("401") || err.message.includes("403")) {
        // Clear invalid token and redirect to login
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError(`Connection Error: ${err.message}. Ensure backend is running.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!newsTitle) {
      alert("Please enter a title first so I know what to write about!");
      return;
    }

    setIsGenerating(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/generate-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newsTitle }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewsDesc(data.content);
      } else {
        alert("Failed to generate content. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error generating content: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle) {
      alert("Please provide at least a title.");
      return;
    }

    setIsPublishing(true);
    try {
      const apiUrl = getApiUrl();
      const formData = new FormData();
      formData.append("title", newsTitle);
      formData.append("description", newsDesc);
      if (newsFile) {
        formData.append("document", newsFile);
      }

      const res = await fetch(`${apiUrl}/api/news`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // access token automatically handled? No, FormData doesn't set Content-Type automatically IF we set it manually, but here we don't set Content-Type, so browser sets multipart/form-data.
          // But we need to add Authorization.
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setNews([...news, data.newsItem]);
        setNewsTitle("");
        setNewsDesc("");
        setNewsFile(null);
        alert("News published successfully!");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(
          `Failed to publish news: ${errorData.error || res.statusText || "Unknown Error"}`,
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error publishing news: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteNews = async (id: number, filename: string) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/news/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, filename }),
      });

      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
      } else {
        alert("Failed to delete news item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting news item.");
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeContent) {
      alert("Please provide notice content.");
      return;
    }

    setIsPostingNotice(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: noticeContent,
          priority: noticePriority,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotices([data.notice, ...notices]);
        setNoticeContent("");
        setNoticePriority("normal");
        alert("Notice posted successfully!");
      } else {
        const errorText = await res.text();
        console.error("Post Notice Failed:", res.status, errorText);
        alert(
          `Failed to post notice (Status ${res.status}). Check console for details.`,
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error posting notice: ${err.message}`);
    } finally {
      setIsPostingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/notices/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setNotices(notices.filter((n) => n.id !== id));
      } else {
        alert("Failed to delete notice.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting notice.");
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/submissions/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        alert(`Failed to delete submission: ${data.error || res.statusText}`);
      }
    } catch (err: any) {
      console.error("Submission Deletion Error:", err);
      alert(`Network failure: ${err.message}.`);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!window.confirm("Permanently delete this file?")) return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/files/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        setFiles(files.filter((f) => f.name !== filename));
      } else {
        const data = await res.json();
        alert(`Failed to delete file: ${data.error || res.statusText}`);
      }
    } catch (err: any) {
      console.error("File Deletion Error:", err);
      alert(`Network failure: ${err.message}.`);
    }
  };

  const handleDeleteConsultation = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this consultation?"))
      return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/consultations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setConsultations(consultations.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(`Failed to delete consultation: ${data.error || res.statusText}`);
      }
    } catch (err: any) {
      console.error("Consultation Deletion Error:", err);
      alert(`Network failure: ${err.message}.`);
    }
  };

  const handleProcessConsultation = async (id: number) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/consultations/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "Processed" } : c)),
        );
        // Open the meeting room in a new tab with service type as query param
        const consultation = consultations.find((c) => c.id === id);
        const serviceParam = consultation
          ? `?service=${encodeURIComponent(consultation.service)}`
          : "";
        window.open(`/meeting/${id}${serviceParam}`, "_blank");
      }
    } catch (err) {
      console.error("Process Consultation Error:", err);
    }
  };

  const handleCompleteConsultation = async (id: number) => {
    if (!window.confirm("Mark this session as successfully completed?")) return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/consultations/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "Completed" } : c)),
        );
        alert("Session marked as completed!");
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Complete Consultation Error:", err);
      alert("Network error.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      alert("Username and password required");
      return;
    }
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers([...users, data.user]);
        setNewUsername("");
        setNewPassword("");
        alert("Admin added successfully!");
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePasswordId || !newPasswordForUpdate) return;

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: changePasswordId,
          newPassword: newPasswordForUpdate,
        }),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        setChangePasswordId(null);
        setNewPasswordForUpdate("");
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 text-slate-900 font-sans">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight">
                Admin Control Panel
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold hidden md:block uppercase tracking-wider">
                Global US HR Consultant • Management Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <FaHome className="text-indigo-600" />
              Return to Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all flex items-center gap-2 shadow-sm"
            >
              <FaSignOutAlt />
              Logout
            </button>
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#001f3f] bg-white border border-[#001f3f] hover:bg-[#001f3f] hover:text-white rounded-lg transition-all active:scale-95 shadow-sm no-print"
            >
              <FaPrint />
              Print Report
            </button>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#001f3f] hover:bg-[#003366] rounded-lg transition-all active:scale-95 shadow-md shadow-[#001f3f]/20 no-print"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Sync Data
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto py-10 px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Info */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <FaGlobeAmericas className="text-[#001f3f] opacity-60" />{" "}
              Analytics Summary
            </h3>
            <div className="space-y-8">
              <div
                className="group cursor-pointer"
                onClick={() => setActiveTab("submissions")}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-slate-500 group-hover:text-[#001f3f] transition-colors">
                    Total Submissions
                  </p>
                  <FaEnvelope className="text-slate-300 group-hover:text-[#001f3f] transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 leading-none group-hover:text-[#001f3f] transition-colors">
                    {submissions.length}
                  </span>
                  <span className="text-[10px] font-black text-[#001f3f] bg-blue-50 px-2 py-1 rounded uppercase tracking-wider mb-1">
                    Live
                  </span>
                </div>
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div
                className="group cursor-pointer"
                onClick={() => setActiveTab("consultations")}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
                    Pending Consultations
                  </p>
                  <FaBriefcase className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 leading-none group-hover:text-emerald-600 transition-colors">
                    {
                      consultations.filter((c) => c.status !== "Completed")
                        .length
                    }
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider mb-1">
                    Scheduled
                  </span>
                </div>
              </div>
              <div className="h-px bg-gray-100 w-full"></div>
              <div
                className="group cursor-pointer"
                onClick={() => setActiveTab("files")}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-slate-500 group-hover:text-amber-600 transition-colors">
                    Stored Document Vault
                  </p>
                  <FaFileAlt className="text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 leading-none group-hover:text-amber-600 transition-colors">
                    {files.length}
                  </span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase tracking-wider mb-1">
                    Encrypted
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div
                className="group cursor-pointer"
                onClick={() => setActiveTab("admins")}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-slate-500 group-hover:text-purple-600 transition-colors">
                    Security Access
                  </p>
                  <FaKey className="text-slate-300 group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 leading-none group-hover:text-purple-600 transition-colors">
                    {users.length}
                  </span>
                  <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded uppercase tracking-wider mb-1">
                    Admins
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              <div
                className="group cursor-pointer"
                onClick={() => setActiveTab("notices")}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold text-slate-500 group-hover:text-red-600 transition-colors">
                    Active Board Notices
                  </p>
                  <FaBell className="text-slate-300 group-hover:text-red-600 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black text-slate-900 leading-none group-hover:text-red-600 transition-colors">
                    {notices.length}
                  </span>
                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded uppercase tracking-wider mb-1">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">
                Service Health
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">
                    Core Database
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-400 uppercase tracking-widest text-[10px]">
                      Active
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">
                    Port Integrity
                  </span>
                  <span className="font-black text-blue-400 uppercase tracking-widest text-[10px]">
                    5001 • SECURE
                  </span>
                </div>
              </div>
            </div>
            <FaDatabase className="absolute bottom-[-30px] right-[-30px] text-white/5 text-9xl transform rotate-12 transition-transform group-hover:scale-110 duration-500" />
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden min-h-[700px] flex flex-col">
            {/* Nav Tabs */}
            <div className="bg-gray-50/50 border-b border-gray-100 px-10 flex justify-between items-center h-20 overflow-x-auto">
              <div className="flex h-full gap-8">
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`relative flex items-center gap-3 px-2 text-sm font-black transition-all h-full ${
                    activeTab === "submissions"
                      ? "text-[#001f3f]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FaEnvelope size={16} />
                  <span className="uppercase tracking-widest">Inquiries</span>
                  {submissions.length > 0 && (
                    <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {submissions.length}
                    </span>
                  )}
                  {activeTab === "submissions" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#001f3f] rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("consultations")}
                  className={`relative flex items-center gap-3 px-2 text-sm font-black transition-all h-full ${
                    activeTab === "consultations"
                      ? "text-[#001f3f]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FaBriefcase size={16} />
                  <span className="uppercase tracking-widest">
                    Consultations
                  </span>
                  {consultations.length > 0 && (
                    <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {consultations.length}
                    </span>
                  )}
                  {activeTab === "consultations" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("news")}
                  className={`relative flex items-center gap-3 px-2 text-sm font-black transition-all h-full ${activeTab === "news" ? "text-[#001f3f]" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <FaNewspaper size={16} />
                  <span className="uppercase tracking-widest">Updates</span>
                  {activeTab === "news" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notices")}
                  className={`relative flex items-center gap-3 px-2 text-sm font-black transition-all h-full ${
                    activeTab === "notices"
                      ? "text-red-600"
                      : "text-slate-400 hover:text-red-500"
                  }`}
                >
                  <FaBell size={16} />
                  <span className="uppercase tracking-widest">Notices</span>
                  {notices.length > 0 && (
                    <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {notices.length}
                    </span>
                  )}
                  {activeTab === "notices" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("files")}
                  className={`relative flex items-center gap-3 px-2 text-sm font-black transition-all h-full ${
                    activeTab === "files"
                      ? "text-[#001f3f]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FaFileAlt size={16} />
                  <span className="uppercase tracking-widest">Storage</span>
                  {files.length > 0 && (
                    <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {files.length}
                    </span>
                  )}
                  {activeTab === "files" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#001f3f] rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`relative flex items-center gap-3 px-2 text-sm font-black transition-all h-full ${
                    activeTab === "admins"
                      ? "text-purple-600"
                      : "text-slate-400 hover:text-purple-600"
                  }`}
                >
                  <FaUsers size={16} />
                  <span className="uppercase tracking-widest">Admins</span>
                  {activeTab === "admins" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>
                  )}
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                  <FaRegCalendarAlt className="text-[#001f3f]" size={12} />
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="h-full py-40 flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-50 border-t-[#001f3f] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-4 border-[#001f3f]/10 rounded-full"></div>
                  </div>
                  <p className="mt-6 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                    Retrieving System Logic...
                  </p>
                </div>
              ) : error ? (
                <div className="py-32 text-center px-12 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 border-2 border-rose-100 transform rotate-12">
                    <FaDatabase />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                    Sync Protocol Error
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-10">
                    {error}
                  </p>
                  <button
                    onClick={fetchData}
                    className="w-full px-8 py-4 bg-[#001f3f] text-white font-black rounded-2xl hover:bg-[#003366] transition-all shadow-xl shadow-[#001f3f]/30 active:scale-[0.98]"
                  >
                    Retry Synchronization
                  </button>
                </div>
              ) : activeTab === "submissions" ? (
                /* Submissions Table */
                <div className="overflow-x-auto">
                  {submissions.length === 0 ? (
                    <div className="py-40 text-center group">
                      <div className="relative w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                        <FaEnvelope className="text-gray-200 text-6xl" />
                        <div className="absolute -top-2 -right-2 bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                          <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-2">
                        Workspace Empty
                      </h4>
                      <p className="text-slate-400 text-sm font-medium">
                        Any new contact inquiries will appear here
                        automatically.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                          <th className="px-10 py-6 border-b border-gray-100">
                            Contact Interface
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100">
                            Inquiry Data
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100">
                            Date & Location
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100">
                            Attachments
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100 text-right">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {submissions.map((sub) => (
                          <tr
                            key={sub.id}
                            className="hover:bg-slate-50/30 transition-all group"
                          >
                            <td className="px-10 py-8">
                              <div className="font-extrabold text-slate-900 group-hover:text-[#001f3f] transition-colors uppercase tracking-tight mb-1">
                                {sub.name}
                              </div>
                              <div className="text-xs text-slate-400 font-bold tracking-wide">
                                {sub.email}
                              </div>
                              {sub.phone && (
                                <div
                                  className="text-xs font-bold tracking-wide mt-1 flex items-center gap-1"
                                  style={{ color: "#080ba5" }}
                                >
                                  <span className="text-emerald-500">📱</span>
                                  {sub.phone}
                                </div>
                              )}
                            </td>
                            <td className="px-10 py-8">
                              <div className="inline-block px-2 py-0.5 bg-blue-50 text-[#001f3f] text-[9px] font-black uppercase tracking-widest rounded mb-2 border border-blue-100">
                                {sub.subject}
                              </div>
                              <p className="text-slate-500 text-xs line-clamp-2 max-w-xs leading-relaxed font-medium">
                                {sub.message}
                              </p>
                            </td>
                            <td className="px-10 py-8">
                              <div className="text-xs font-bold text-slate-700 mb-1">
                                📅{" "}
                                {new Date(sub.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mb-2">
                                🕐{" "}
                                {new Date(sub.date).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  },
                                )}
                              </div>
                              {sub.location && (
                                <div className="space-y-1">
                                  <div className="text-xs text-slate-600 font-semibold">
                                    📍 {sub.location.city},{" "}
                                    {sub.location.country}
                                  </div>
                                  <a
                                    href={`https://www.google.com/maps?q=${sub.location.latitude},${sub.location.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold"
                                  >
                                    View on Map
                                  </a>
                                </div>
                              )}
                            </td>
                            <td className="px-10 py-8">
                              {sub.document ? (
                                <a
                                  href={`http://${window.location.hostname}:5001/uploads/${sub.document}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-3 text-[#001f3f] hover:text-white font-black bg-blue-100/50 hover:bg-[#001f3f] p-3 rounded-xl transition-all border border-blue-100 group/btn shadow-sm"
                                >
                                  <FaDownload
                                    size={14}
                                    className="group-hover/btn:scale-110 transition-transform"
                                  />
                                  <span className="text-[10px] uppercase tracking-widest">
                                    View file
                                  </span>
                                </a>
                              ) : (
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                  None
                                </span>
                              )}
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-rose-100"
                              >
                                <FaTrash size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : activeTab === "files" ? (
                /* Files Table */
                <div className="overflow-x-auto h-full">
                  {files.length === 0 ? (
                    <div className="py-40 text-center group">
                      <div className="relative w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                        <FaFileAlt className="text-gray-200 text-6xl" />
                      </div>
                      <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-2">
                        Storage Vault Cleared
                      </h4>
                      <p className="text-slate-400 text-sm font-medium">
                        All uploaded document assets have been processed.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                          <th className="px-10 py-6 border-b border-gray-100">
                            Asset Record
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100">
                            Creation Date
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100 text-right">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {files.map((file, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50/30 transition-all group"
                          >
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#001f3f] group-hover:text-white transition-all shadow-inner">
                                  <FaFileAlt size={20} />
                                </div>
                                <div>
                                  <span
                                    className="font-extrabold text-slate-900 block group-hover:text-[#001f3f] transition-colors tracking-tight truncate max-w-[300px]"
                                    title={file.name}
                                  >
                                    {file.name.split("-").slice(1).join("-") ||
                                      file.name}
                                  </span>
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    className="text-[10px] font-black text-[#001f3f] uppercase tracking-widest hover:underline mt-1"
                                  >
                                    Direct Egress Link
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="text-slate-800 text-xs font-black uppercase tracking-tight">
                                {new Date(file.date).toLocaleDateString()}
                              </div>
                              <div className="text-[11px] text-[#001f3f]/60 font-black uppercase tracking-widest mt-0.5">
                                {new Date(file.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button
                                onClick={() => handleDeleteFile(file.name)}
                                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-rose-100"
                              >
                                <FaTrash size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : activeTab === "consultations" ? (
                /* Consultations Table */
                <div className="overflow-x-auto">
                  {consultations.length === 0 ? (
                    <div className="py-40 text-center group">
                      <div className="relative w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
                        <FaBriefcase className="text-gray-200 text-6xl" />
                        <div className="absolute -top-2 -right-2 bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-2">
                        No Consultations
                      </h4>
                      <p className="text-slate-400 text-sm font-medium">
                        Scheduled appointments will appear here.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                          <th className="px-10 py-6 border-b border-gray-100">
                            Client Details
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100">
                            Service & Payment
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100">
                            Appointment Time
                          </th>
                          <th className="px-10 py-6 border-b border-gray-100 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {consultations.map((cons) => (
                          <tr
                            key={cons.id}
                            className="hover:bg-slate-50/30 transition-all group"
                          >
                            <td className="px-10 py-8">
                              <div className="font-extrabold text-slate-900 group-hover:text-[#001f3f] transition-colors uppercase tracking-tight mb-1">
                                {cons.name}
                              </div>
                              <div className="text-xs text-slate-400 font-bold tracking-wide">
                                {cons.email}
                              </div>
                              <div
                                className="text-xs font-bold tracking-wide mt-1 flex items-center gap-1"
                                style={{ color: "#080ba5" }}
                              >
                                <span className="text-emerald-500">📱</span>
                                {cons.phone}
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase tracking-widest rounded mb-2 border border-emerald-100">
                                {cons.service}
                              </div>
                              {cons.paymentId ? (
                                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                  <div className="text-[10px] font-bold text-blue-900 mb-1">
                                    💳 ${cons.amountPaid?.toFixed(2) || "0.00"}{" "}
                                    Paid
                                  </div>
                                  <div className="text-[9px] text-blue-600 font-mono">
                                    {cons.paymentId.substring(0, 20)}...
                                  </div>
                                </div>
                              ) : cons.status === "Pending Payment" ? (
                                <div className="mt-2 px-2 py-1 bg-rose-50 text-rose-700 text-[9px] font-black uppercase tracking-widest rounded border border-rose-100 inline-block">
                                  Pending Payment ($50.00)
                                </div>
                              ) : (
                                <div className="mt-2 px-2 py-1 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded border border-amber-100 inline-block">
                                  Free Consultation
                                </div>
                              )}
                              {cons.message && (
                                <p className="text-slate-500 text-xs line-clamp-2 max-w-xs leading-relaxed font-medium mt-2">
                                  {cons.message}
                                </p>
                              )}
                            </td>
                            <td className="px-10 py-8">
                              <div className="text-xs font-bold text-slate-700 mb-1">
                                📅{" "}
                                {new Date(
                                  cons.preferredDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="text-xs text-slate-500 mb-2">
                                🕐 {cons.preferredTime}
                              </div>
                              {cons.location && (
                                <div className="space-y-1 mt-2 border-t border-gray-100 pt-2">
                                  <div className="text-xs text-slate-600 font-semibold">
                                    📍 {cons.location.city},{" "}
                                    {cons.location.country}
                                  </div>
                                  <a
                                    href={`https://www.google.com/maps?q=${cons.location.latitude},${cons.location.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold block"
                                  >
                                    View on Map
                                  </a>
                                </div>
                              )}
                            </td>
                            <td className="px-10 py-8 text-right flex items-center justify-end gap-2">
                              {cons.status !== "Processed" &&
                                (cons.paymentId ||
                                  cons.status === "Pending" ||
                                  cons.status === "Pending Payment" ||
                                  cons.status === "Paid") && (
                                  <button
                                    onClick={() =>
                                      handleProcessConsultation(cons.id)
                                    }
                                    className="px-4 py-2 bg-[#001f3f] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                                    title="Mark Processed & Begin Video Call"
                                  >
                                    <FaVideo size={12} /> Process
                                  </button>
                                )}

                              {cons.status === "Processed" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const serviceParam = cons.service
                                        ? `?service=${encodeURIComponent(
                                            cons.service,
                                          )}`
                                        : "";
                                      window.open(
                                        `/meeting/${cons.id}${serviceParam}`,
                                        "_blank",
                                      );
                                    }}
                                    className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                                    title="Re-enter Meeting Room"
                                  >
                                    <FaCheckCircle size={12} /> Active Room
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCompleteConsultation(cons.id)
                                    }
                                    className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    title="Mark as Completed"
                                  >
                                    <FaCheckCircle size={14} />
                                  </button>
                                </div>
                              )}
                              {cons.status === "Completed" && (
                                <div className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                  Completed
                                </div>
                              )}
                              {cons.paymentId && (
                                <button
                                  onClick={() => {
                                    setSelectedConsultationForBill(cons);
                                    setShowBillModal(true);
                                  }}
                                  className="w-10 h-10 flex items-center justify-center text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-blue-100"
                                  title="Generate Payment Bill"
                                >
                                  <FaFileAlt size={14} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleDeleteConsultation(cons.id)
                                }
                                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-rose-100"
                                title="Delete Record"
                              >
                                <FaTrash size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : activeTab === "news" ? (
                <div className="flex-1 overflow-auto">
                  {/* Publish Form */}
                  <div className="bg-slate-50 p-8 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-[#001f3f] mb-4">
                      Publish Latest News
                    </h3>
                    <form onSubmit={handlePublishNews} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Document Title
                          </label>
                          <input
                            type="text"
                            value={newsTitle}
                            onChange={(e) => setNewsTitle(e.target.value)}
                            placeholder="e.g., Weekly Scan Update"
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-700"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Attachment (Optional)
                          </label>
                          <input
                            type="file"
                            onChange={(e) =>
                              setNewsFile(
                                e.target.files ? e.target.files[0] : null,
                              )
                            }
                            className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*,application/pdf"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Rich Content
                          </label>
                          <button
                            type="button"
                            onClick={handleGenerateContent}
                            disabled={isGenerating}
                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-2 border border-indigo-100 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGenerating
                              ? "✨ Writing..."
                              : "✨ Magic Auto-Write"}
                          </button>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
                          <EditorProvider>
                            <Editor
                              value={newsDesc}
                              onChange={(e) => setNewsDesc(e.target.value)}
                              containerProps={{
                                style: { height: "300px", minHeight: "300px" },
                              }}
                            />
                          </EditorProvider>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isPublishing}
                        className="h-12 w-full bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                      >
                        {isPublishing ? (
                          "Publishing..."
                        ) : (
                          <>
                            <FaNewspaper /> Publish Update
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* News List */}
                  {news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                      <FaNewspaper className="text-6xl mb-4 opacity-20" />
                      <p className="font-bold">No updates published yet.</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50/50 border-b border-gray-100 text-left sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                            Date
                          </th>
                          <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                            Update Details
                          </th>
                          <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                            Document
                          </th>
                          <th className="px-10 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {news.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/30 transition-all group"
                          >
                            <td className="px-10 py-8 text-sm font-bold text-slate-500">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-10 py-8">
                              <div className="font-extrabold text-slate-900 text-lg mb-1">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-500 max-w-md">
                                {item.description}
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <a
                                href={`${getApiUrl()}${item.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                              >
                                <FaDownload /> Download Scan
                              </a>
                              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                                {item.filename}
                              </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button
                                onClick={() =>
                                  handleDeleteNews(item.id, item.filename)
                                }
                                className="w-10 h-10 inline-flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : activeTab === "notices" ? (
                <div className="flex-1 overflow-auto">
                  {/* Notice Form */}
                  <div className="bg-slate-50 p-8 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-[#001f3f] mb-4">
                      Post New Board Notice
                    </h3>
                    <form onSubmit={handlePostNotice} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Notice Content
                        </label>
                        <textarea
                          value={noticeContent}
                          onChange={(e) => setNoticeContent(e.target.value)}
                          placeholder="What would you like to announce?"
                          className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-700"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="normal"
                            name="priority"
                            value="normal"
                            checked={noticePriority === "normal"}
                            onChange={() => setNoticePriority("normal")}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label
                            htmlFor="normal"
                            className="text-sm font-bold text-slate-600"
                          >
                            Normal Priority
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="high"
                            name="priority"
                            value="high"
                            checked={noticePriority === "high"}
                            onChange={() => setNoticePriority("high")}
                            className="w-4 h-4 text-red-600"
                          />
                          <label
                            htmlFor="high"
                            className="text-sm font-bold text-red-600"
                          >
                            High Priority (Red Highlight)
                          </label>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isPostingNotice}
                        className="h-12 w-full bg-[#001f3f] text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        {isPostingNotice ? (
                          "Posting..."
                        ) : (
                          <>
                            <FaBell /> Post Notice
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Notices List */}
                  {notices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                      <FaBell className="text-6xl mb-4 opacity-20" />
                      <p className="font-bold">No active notices.</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50/50 border-b border-gray-100 text-left sticky top-0 backdrop-blur-md">
                        <tr>
                          <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                            Date
                          </th>
                          <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                            Priority
                          </th>
                          <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                            Content
                          </th>
                          <th className="px-10 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {notices.map((notice) => (
                          <tr
                            key={notice.id}
                            className="hover:bg-slate-50/30 transition-all group"
                          >
                            <td className="px-10 py-8 text-sm font-bold text-slate-500">
                              {new Date(notice.date).toLocaleDateString()}
                            </td>
                            <td className="px-10 py-8 text-sm font-bold">
                              <span
                                className={`px-2 py-1 rounded-lg text-[10px] uppercase tracking-widest ${
                                  notice.priority === "high"
                                    ? "bg-red-50 text-red-600 border border-red-100"
                                    : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}
                              >
                                {notice.priority}
                              </span>
                            </td>
                            <td className="px-10 py-8 text-sm font-bold text-slate-800 max-w-md break-words">
                              {notice.content}
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button
                                onClick={() => handleDeleteNotice(notice.id)}
                                className="w-10 h-10 inline-flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : activeTab === "admins" ? (
                /* Admins Management */
                <div className="flex-1 overflow-auto bg-slate-50 relative">
                  <div className="p-8 pb-32">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                          Security Access
                        </h2>
                        <p className="text-slate-400 font-medium">
                          Manage administrators and access credentials
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="New Username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-bold focus:outline-none focus:border-purple-400"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-bold focus:outline-none focus:border-purple-400"
                        />
                        <button
                          onClick={handleAddUser}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                          <FaUserPlus /> Add Admin
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex justify-between items-center group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black text-xl">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-black text-slate-800 text-lg">
                                {u.username}
                              </h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Admin ID: {u.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {changePasswordId === u.id ? (
                              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <input
                                  type="password"
                                  placeholder="New Password"
                                  value={newPasswordForUpdate}
                                  onChange={(e) =>
                                    setNewPasswordForUpdate(e.target.value)
                                  }
                                  className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-bold focus:outline-none focus:border-purple-400 w-32"
                                />
                                <button
                                  onClick={handleChangePassword}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
                                  title="Save Password"
                                >
                                  <FaKey size={12} />
                                </button>
                                <button
                                  onClick={() => setChangePasswordId(null)}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-2 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <span className="font-bold text-xs">X</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setChangePasswordId(u.id);
                                  setNewPasswordForUpdate("");
                                }}
                                className="text-slate-300 hover:text-purple-600 transition-colors p-2"
                                title="Change Password"
                              >
                                <FaKey size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-2"
                              title="Delete Admin"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="bg-slate-50 px-10 py-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
              <div className="flex items-center gap-4">
                <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                  Terminal v2.1.0
                </span>
                <span>Security Protocol Active</span>
              </div>
              <span className="opacity-60">
                Last Sync: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Payment Confirmation Bill Modal */}
      {showBillModal && selectedConsultationForBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Payment Confirmation Bill
              </h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <FaSignOutAlt size={20} className="rotate-180" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8" id="bill-content">
              {/* Receipt Visual */}
              <div className="border-2 border-slate-100 rounded-3xl p-8 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                {/* Brand Header */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">
                        GLOBAL US
                      </h4>
                      <h4 className="font-black text-blue-600 leading-tight">
                        HR CONSULTANT
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                        International Recruitment
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                      Official Receipt
                    </div>
                    <p className="text-xs text-slate-500 font-bold">
                      Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">
                      Client Profile
                    </h5>
                    <p className="font-extrabold text-slate-900">
                      {selectedConsultationForBill.name}
                    </p>
                    <p className="text-xs text-slate-500 font-bold">
                      {selectedConsultationForBill.email}
                    </p>
                    <p className="text-xs text-slate-500 font-bold">
                      {selectedConsultationForBill.phone}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">
                      Transaction Ref
                    </h5>
                    <p
                      className="text-xs font-mono text-blue-600 font-bold truncate"
                      title={selectedConsultationForBill.paymentId}
                    >
                      ID: {selectedConsultationForBill.paymentId}
                    </p>
                    <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tighter">
                      Amount: USD{" "}
                      {selectedConsultationForBill.amountPaid?.toFixed(2) ||
                        "50.00"}
                    </p>
                  </div>
                </div>

                {/* Service Box */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100 flex justify-between items-center">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Service & Appointment
                    </h5>
                    <p className="font-extrabold text-slate-900">
                      {selectedConsultationForBill.service}
                    </p>
                    <p className="text-xs text-blue-600 font-bold mt-0.5">
                      {new Date(
                        selectedConsultationForBill.preferredDate,
                      ).toLocaleDateString()}{" "}
                      at {selectedConsultationForBill.preferredTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      $50.00
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      Paid in Full
                    </div>
                  </div>
                </div>

                {/* Footer Message */}
                <div className="text-center pt-8 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-bold mb-1 italic">
                    "Connecting talent with global opportunities."
                  </p>
                  <p className="text-[10px] text-slate-300 font-medium">
                    Thank you for choosing Global US HRC.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-gray-100 flex justify-between gap-4">
              <button
                onClick={() => setShowBillModal(false)}
                className="flex-1 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
              >
                Close View
              </button>
              <button
                onClick={() => window.print()}
                className="flex-[2] py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3"
              >
                <FaPrint size={14} /> Print Confirmation Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Bill Version */}
      <div className="hidden print:block fixed inset-0 z-[999] bg-white p-0 m-0 w-full h-full">
        {selectedConsultationForBill && (
          <div className="p-[15mm] text-slate-900 flex flex-col h-full bg-white">
            {/* Professional Receipt for Print */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
              <div className="flex items-center gap-6">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-24 h-24 object-contain"
                />
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                    GLOBAL US
                  </h1>
                  <h1 className="text-3xl font-black text-blue-600 tracking-tighter">
                    HR CONSULTANT
                  </h1>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">
                    Professional Recruitment Solutions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tighter mb-2">
                  RECEIPT
                </h2>
                <p className="text-sm font-bold text-slate-600">
                  Date: {new Date().toLocaleDateString()}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase">
                  Confidential Document
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-16 mb-16">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                  Issued To
                </h3>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-900">
                    {selectedConsultationForBill.name}
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {selectedConsultationForBill.email}
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {selectedConsultationForBill.phone}
                  </p>
                </div>
              </section>
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                  Payment Record
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Reference ID:{" "}
                    <span className="font-mono text-blue-600">
                      {selectedConsultationForBill.paymentId}
                    </span>
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    Total Amount:{" "}
                    <span className="text-blue-600">
                      USD{" "}
                      {selectedConsultationForBill.amountPaid?.toFixed(2) ||
                        "50.00"}
                    </span>
                  </p>
                  <p className="text-xs font-black text-emerald-600 uppercase mt-2">
                    Status: Electronic Payment Confirmed
                  </p>
                </div>
              </section>
            </div>

            <table className="w-full border-collapse mb-16">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 text-left font-black uppercase text-xs">
                    Service Description
                  </th>
                  <th className="p-4 text-center font-black uppercase text-xs">
                    Scheduled Time
                  </th>
                  <th className="p-4 text-right font-black uppercase text-xs">
                    Charge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4">
                    <p className="font-black text-slate-800">
                      {selectedConsultationForBill.service}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      Professional HR & Recruiting Consultation
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <p className="font-black text-slate-800">
                      {new Date(
                        selectedConsultationForBill.preferredDate,
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedConsultationForBill.preferredTime}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-black text-slate-800">$50.00</p>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="p-4 text-right font-black text-lg">
                    TOTAL PAID:
                  </td>
                  <td className="p-4 text-right font-black text-2xl text-blue-600">
                    $50.00
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="mt-auto py-10 border-t-2 border-slate-900 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 italic">
                  "Empowering careers globally."
                </p>
                <div className="mt-4 text-[8pt] text-slate-300 font-medium">
                  This is an electronically generated document. No signature is
                  required.
                </div>
              </div>
              <div className="text-right">
                <img
                  src="/logo.png"
                  alt="Company Seal"
                  className="w-20 h-20 opacity-20 grayscale mb-2 ml-auto"
                />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Global US HRC Admin Terminal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print\\:block, .print\\:block * {
            visibility: visible !important;
          }
          
          .print\\:block {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }

          /* Force high quality print colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
