import React, { useState } from "react";
import {
  FaTimes,
  FaUpload,
  FaPaperPlane,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("subject", `Job Application: ${jobTitle}`);
      data.append(
        "message",
        `Applying for ${jobTitle}\n\nCandidate Message:\n${formData.message}`,
      );
      if (file) {
        data.append("document", file);
      }

      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert(
          `Success! Your application for "${jobTitle}" has been submitted.`,
        );
        onClose();
      } else {
        const result = await response.json();
        alert(`Error: ${result.error || "Failed to submit application"}`);
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert("Connection Issue! Please ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg uppercase tracking-wider">
            Application
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
              Applying for
            </p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              {jobTitle}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Phone Number
              </label>
              <div className="relative">
                <PhoneInput
                  country={"np"}
                  value={formData.phone}
                  onChange={(phone) =>
                    setFormData({ ...formData, phone: "+" + phone })
                  }
                  inputClass="!w-full !bg-slate-50 !border-slate-200 !rounded-xl !py-6 !text-sm !pl-12"
                  buttonClass="!bg-transparent !border-0 !pl-2"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Upload CV (Optional)
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-6 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
                <FaUpload className="text-slate-300 text-xl group-hover:text-blue-500 transition-colors mb-2" />
                <span className="text-xs font-bold text-slate-400 tracking-tight group-hover:text-slate-600">
                  {file ? file.name : "Choose PDF or DOCX"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                />
              </label>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Message to Consultant
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="Briefly introduce yourself..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-[#001f3f] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-[#003366] transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane />
              )}
              {isSubmitting ? "Processing..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
