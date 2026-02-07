import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaCheckCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaFileDownload,
} from "react-icons/fa";
import Calendar from "../components/Calendar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSection from "../components/PaymentSection";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import AppointmentConfirmation from "../components/AppointmentConfirmation";

// Initialize Stripe (Replace with your actual public key)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx",
);

const BookConsultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
    paymentMethod: "stripe",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [consultationId, setConsultationId] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(133); // Fallback to 133
  const [nprAmount, setNprAmount] = useState<number>(6650);
  const [isPremium, setIsPremium] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);
  const [userCountry, setUserCountry] = useState("np"); // Default to Nepal

  // Fetch Live Rates
  useEffect(() => {
    const fetchNprRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (res.ok) {
          const data = await res.json();
          const rate = data.rates.NPR;
          if (rate) {
            setExchangeRate(rate);
            const basePrice = isPremium ? 100 : 50;
            setNprAmount(Math.ceil(basePrice * rate)); // Round up for cleaner transaction
          }
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };
    fetchNprRate();
  }, [isPremium]); // Re-run when isPremium changes

  useEffect(() => {
    if (showSuccess && lastBooking) {
      const triggerDownload = async () => {
        // Short delay to ensure DOM is ready for capture
        await new Promise((resolve) => setTimeout(resolve, 500));
        downloadLetter();
      };
      triggerDownload();
    }
  }, [showSuccess, lastBooking]);

  // Auto-detect User Country for Phone Input
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          if (data.country_code) {
            setUserCountry(data.country_code.toLowerCase());
          }
        }
      } catch (error) {
        console.error("Country Detection Error:", error);
        // Fallback is already 'np'
      }
    };
    detectCountry();
  }, []);

  const services = [
    "Visa Consultation",
    "Work Permit Assistance",
    "Global Recruitment",
    "HR Compliance",
    "General Inquiry",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFormData({ ...formData, date: newDate, time: "" }); // Reset time when date changes
    setAvailability(null);

    if (!newDate) return;

    setLoadingAvailability(true);
    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;
      const response = await fetch(
        `${apiUrl}/api/consultations/availability?date=${newDate}`,
      );
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
        if (!data.available) {
          // Date is unavailable, but we don't show an error state now
        }
      } else {
        console.error("Failed to check availability");
      }
    } catch (error) {
      console.error("Availability Check Error:", error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const initiateEsewaPayment = async (cid: number) => {
    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

      const res = await fetch(`${apiUrl}/api/esewa/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: cid,
          amount: nprAmount,
        }),
      });

      if (!res.ok) throw new Error("Failed to initiate eSewa payment");

      const { paymentUrl, paymentData } = await res.json();

      // Create a hidden form and submit it to redirect to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      setRedirecting(true);
      setCountdown(5);

      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        form.submit();
      }, 5000);
    } catch (err) {
      console.error("eSewa Initiation Error:", err);
      alert("Could not initiate eSewa payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectTime = (time: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    setFormData({ ...formData, time });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Please select a time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

      // IP Location block (simplified for speed)
      let location = null;
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          location = {
            city: ipData.city,
            country: ipData.country_name,
            ip: ipData.ip,
          };
        }
      } catch (e) {}

      const res = await fetch(`${apiUrl}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
          isPremium, // Send isPremium status to backend
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const data = await res.json();
      setConsultationId(data.consultationId);

      if (
        data.clientSecret &&
        ["stripe", "visa", "mastercard"].includes(formData.paymentMethod)
      ) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      } else if (formData.paymentMethod === "esewa") {
        await initiateEsewaPayment(data.consultationId);
      } else {
        setLastBooking({
          ...formData,
          referenceId: `REF-${data.consultationId}`,
          isPremium,
        });
        setShowSuccess(true);
        resetForm();
      }
    } catch (err: any) {
      console.error("Booking Error", err);
      alert(err.message || "Could not complete booking process.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      time: "",
      message: "",
      paymentMethod: "stripe",
    });
    setAvailability(null);
    setClientSecret("");
    setShowPayment(false);
    setRedirecting(false);
    setConsultationId(null);
    setIsPremium(false); // Reset premium status
  };

  const handlePaymentSuccess = async (pid: string) => {
    setIsSubmitting(true);
    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

      const response = await fetch(
        `${apiUrl}/api/consultations/confirm-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: consultationId,
            paymentId: pid,
          }),
        },
      );

      if (response.ok) {
        setLastBooking({
          ...formData,
          referenceId: `REF-${consultationId}`,
          isPremium,
        });
        setShowSuccess(true);
        resetForm();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to confirm payment"}`);
      }
    } catch (error: any) {
      console.error("Confirmation Error:", error);
      alert("Connection error. Please ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadLetter = async () => {
    const input = document.getElementById("appointment-letter");
    if (!input) return;

    try {
      // Small delay to ensure everything is rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Forcefully remove all stylesheets in the clone to stop html2canvas from parsing oklch
          const styles = clonedDoc.getElementsByTagName("style");
          for (let i = styles.length - 1; i >= 0; i--) {
            styles[i].parentNode?.removeChild(styles[i]);
          }
          const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
          links.forEach((l) => l.parentNode?.removeChild(l));

          // Ensure the letter is clean and visible in the cloned DOM
          const el = clonedDoc.getElementById("appointment-letter");
          if (el) {
            el.style.display = "block";
            el.style.visibility = "visible";
            el.style.position = "relative";
            el.style.top = "0";
            el.style.left = "0";
          }
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Appointment_Confirmation_${lastBooking?.referenceId || "Letter"}.pdf`,
      );

      // Close the success section after a small delay to let the user see the "Downloaded" state
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("PDF Generation Error:", error);
      alert(
        `Failed to generate PDF: ${error.message || "Unknown error"}. Please ensure the browser allows canvas capture.`,
      );
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <div
        className="relative py-16 md:py-24 bg-cover bg-center bg-no-repeat text-white overflow-hidden"
        style={{ backgroundImage: "url('/assets/consultation_hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            Schedule Your <span className="text-blue-500">Consultation</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed font-light">
            Book a personalized session with our industry-leading HR experts.
            We're here to help you navigate your global workforce needs with
            precision and care.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div
          className="fixed top-8 right-8 z-[100] animate-in fade-in slide-in-from-top-4 duration-500"
          style={{ width: "380px" }}
        >
          <div
            style={{
              backgroundColor: "#10b981",
              color: "#ffffff",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <FaCheckCircle
                style={{ fontSize: "24px" }}
                className="animate-bounce"
              />
            </div>
            <div>
              <p
                style={{
                  fontWeight: "800",
                  fontSize: "19px",
                  margin: "0",
                  letterSpacing: "-0.02em",
                }}
              >
                Booking Confirmed!
              </p>
              <div
                style={{
                  fontSize: "13px",
                  margin: "6px 0 0 0",
                  opacity: "0.95",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  display: "inline-block",
                  fontFamily: "monospace",
                  fontWeight: "900",
                }}
              >
                Ref: {lastBooking?.referenceId}
              </div>
              <p
                style={{
                  fontSize: "11px",
                  margin: "10px 0 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: "0.8",
                  fontWeight: "600",
                }}
              >
                <FaFileDownload className="animate-pulse" /> Generating your
                confirmation...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Letter for PDF Generation (Clean isolation) */}
      <div
        style={{
          position: "fixed",
          top: "-10000px",
          left: "-10000px",
          pointerEvents: "none",
          backgroundColor: "#ffffff",
        }}
      >
        {lastBooking && (
          <div id="appointment-letter" style={{ backgroundColor: "#ffffff" }}>
            <AppointmentConfirmation applicantDetails={lastBooking} />
          </div>
        )}
      </div>

      {/* Booking Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
            {[
              {
                icon: FaCalendarAlt,
                title: "Flexible Scheduling",
                text: "Pick a date and time that fits.",
                color: "blue",
              },
              {
                icon: FaBriefcase,
                title: "Expert Advisors",
                text: "Experienced global HR pros.",
                color: "emerald",
              },
              {
                icon: FaClock,
                title: "Quick Response",
                text: "Confirmation within 24 hours.",
                color: "purple",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div
                  className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <item.icon className={`text-2xl text-${item.color}-600`} />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-slate-900 mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 text-center tracking-tight">
              Book Your Session
            </h2>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-blue-600" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all bg-slate-50/30 focus:bg-white"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-blue-600" /> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all bg-slate-50/30 focus:bg-white"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-blue-600" /> Phone *
                  </label>
                  <PhoneInput
                    country={userCountry}
                    value={formData.phone}
                    onChange={(phone) =>
                      setFormData({ ...formData, phone: "+" + phone })
                    }
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    containerClass="!w-full !font-sans"
                    inputClass="!w-full !px-5 !py-3.5 !pl-14 !h-[54px] !rounded-xl !border !border-slate-200 !focus:border-blue-500 !focus:ring-4 !focus:ring-blue-500/5 !outline-none !transition-all !bg-slate-50/30 !focus:bg-white !text-base"
                    buttonClass="!border !border-slate-200 !border-r-0 !bg-slate-50/50 !rounded-l-xl !px-3"
                    dropdownClass="!rounded-xl !shadow-2xl !border-slate-100 !mt-2"
                    placeholder={`+... 0000000000`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-blue-600" /> Service *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all bg-slate-50/30 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" /> Preferred Date *
                </label>
                <div className="grid md:grid-cols-[1fr_200px] gap-6 items-start">
                  {/* Left Side: Calendar */}
                  <div className="bg-white">
                    <Calendar
                      selectedDate={formData.date}
                      onDateSelect={(date) =>
                        handleDateChange({
                          target: { value: date, name: "date" },
                        } as any)
                      }
                    />
                  </div>

                  {/* Right Side: Stats (Matches Photoshop Exact) */}
                  {/* Right Side: Premium Data Dashboard */}
                  <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 h-full flex flex-col shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Date Analytics
                      </h3>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                        <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                      </div>
                    </div>

                    {availability?.available ? (
                      <div className="flex-grow flex flex-col justify-center space-y-6">
                        {/* Progressive Stat: Available */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                              Available Slots
                            </span>
                            <span className="text-lg font-black text-emerald-600">
                              {
                                availability.slots.filter(
                                  (s: any) => s.available,
                                ).length
                              }
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                              style={{
                                width: `${(availability.slots.filter((s: any) => s.available).length / 28) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Progressive Stat: Booked */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                              Confirmed Bookings
                            </span>
                            <span className="text-lg font-black text-rose-500">
                              {availability.slots.reduce(
                                (acc: number, s: any) =>
                                  acc + (s.bookedCount || 0),
                                0,
                              )}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                              style={{
                                width: `${(availability.slots.reduce((acc: number, s: any) => acc + (s.bookedCount || 0), 0) / 28) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Capacity Info */}
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              Total Capacity
                            </span>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">
                              28 Slots
                            </span>
                          </div>
                          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Live
                          </div>
                        </div>
                      </div>
                    ) : loadingAvailability ? (
                      <div className="flex-grow flex flex-col items-center justify-center space-y-3">
                        <div className="w-8 h-8 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Analyzing...
                        </span>
                      </div>
                    ) : (
                      <div className="flex-grow flex items-center justify-center">
                        <div className="text-center p-4 border border-dashed border-slate-200 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Pick a date to <br /> see real-time data
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <p className="text-[8px] text-slate-300 font-medium tracking-tight">
                        * AG-SYNC PROTOCOL v2.4 •{" "}
                        {formData.date || "NO_DATE_REF"}
                      </p>
                    </div>
                  </div>
                </div>
                {availability?.available && (
                  <div className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <h4 className="text-sm font-black text-[#001f3f] uppercase tracking-[0.2em] flex items-center gap-2">
                          <FaClock className="text-blue-600" /> Appointment
                          Schedule
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          Select your preferred window for consultation
                        </p>
                      </div>
                      <div className="flex gap-6 items-center bg-slate-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#9cf39c] shadow-sm"></span>
                          <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">
                            Available
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#001f3f] shadow-[0_0_8px_rgba(0,31,63,0.3)]"></span>
                          <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider">
                            Selected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Type Toggle (Premium Design) */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button
                        type="button"
                        onClick={() => setIsPremium(false)}
                        className={`group relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                          !isPremium
                            ? "bg-[#001f3f] border-[#001f3f] text-white shadow-xl shadow-blue-900/10"
                            : "bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50/30"
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-widest mb-1">
                          Standard
                        </span>
                        <span
                          className={`text-[10px] font-medium transition-colors ${!isPremium ? "text-blue-100" : "text-slate-400"}`}
                        >
                          $50 - Regular Access
                        </span>
                        {!isPremium && (
                          <div className="absolute top-0 right-0 p-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPremium(true)}
                        className={`group relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                          isPremium
                            ? "bg-[#001f3f] border-[#001f3f] text-white shadow-xl shadow-blue-900/10"
                            : "bg-white border-slate-200 text-slate-500 hover:border-amber-200 hover:bg-amber-50/30"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <FaShieldAlt
                            className={
                              isPremium
                                ? "text-amber-400"
                                : "group-hover:text-amber-500"
                            }
                          />
                          <span className="text-xs font-black uppercase tracking-widest">
                            Prime
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-medium transition-colors ${isPremium ? "text-amber-400" : "text-slate-400"}`}
                        >
                          $100 - Priority Access
                        </span>
                        {isPremium && (
                          <div className="absolute top-0 right-0 p-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Solid Green Box Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                      {availability.slots.map((slot: any) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => selectTime(slot.time, slot.available)}
                          className={`
                            relative py-2 px-1 rounded-sm border font-bold text-[11px] transition-all duration-200
                            ${
                              !slot.available
                                ? "bg-red-500 border-red-500 text-white cursor-not-allowed opacity-50"
                                : formData.time === slot.time
                                  ? "bg-[#001f3f] border-[#001f3f] text-white shadow-md scale-105 z-10"
                                  : "bg-[#9cf39c] border-[#9cf39c] text-slate-800 hover:brightness-95"
                            }
                          `}
                        >
                          {(() => {
                            const [time, modifier] = slot.time.split(" ");
                            let [hours, minutes] = time.split(":");
                            if (modifier === "PM" && hours !== "12")
                              hours = (parseInt(hours, 10) + 12).toString();
                            if (modifier === "AM" && hours === "12")
                              hours = "00";
                            return (
                              <span>{`${hours.padStart(2, "0")}:${minutes}`}</span>
                            );
                          })()}
                        </button>
                      ))}
                    </div>

                    {/* Refined Footer Context */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                          <FaShieldAlt className="text-blue-600 text-[12px]" />
                        </div>
                        <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                          Secure Booking Infrastructure
                        </p>
                      </div>
                      <div className="flex flex-col items-center sm:items-end gap-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          Authenticated Session
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">
                          Local Time UTC+5:45
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all bg-slate-50/30 focus:bg-white resize-none"
                  placeholder="Tell us more about your needs..."
                ></textarea>
              </div>

              {!showPayment && (
                <div className="flex flex-col items-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl mx-auto py-4 px-4">
                    {[
                      {
                        id: "stripe",
                        img: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
                        borderColor: "border-[#635bff]",
                      },
                      {
                        id: "esewa",
                        img: "/assets/images/esewa_logo_official.png",
                        borderColor: "border-[#41a124]",
                      },
                      {
                        id: "visa",
                        img: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg",
                        borderColor: "border-[#1a1f71]",
                      },
                      {
                        id: "mastercard",
                        img: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                        borderColor: "border-[#eb001b]",
                      },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: pm.id })
                        }
                        className={`w-full h-14 sm:h-16 rounded-xl border transition-all duration-300 flex items-center justify-center bg-white ${
                          formData.paymentMethod === pm.id
                            ? `${pm.borderColor} shadow-md scale-[1.02]`
                            : "border-slate-100 opacity-40 hover:opacity-100 hover:border-slate-200 hover:shadow-sm hover:scale-[1.01]"
                        }`}
                      >
                        <img
                          src={pm.img}
                          alt={pm.id}
                          className="w-[75%] h-[75%] object-contain"
                        />
                      </button>
                    ))}
                  </div>
                  {formData.paymentMethod === "esewa" && (
                    <div className="text-center mt-2 px-4">
                      <p className="text-[10px] text-slate-400 font-bold italic flex justify-center items-center gap-2">
                        <FaInfoCircle className="text-blue-400/60" />1 USD ={" "}
                        {exchangeRate.toFixed(2)} NPR • Total: NPR{" "}
                        {nprAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {showPayment && clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentSection
                    onPaymentSuccess={handlePaymentSuccess}
                    isProcessing={isSubmitting}
                    setIsProcessing={setIsSubmitting}
                  />
                </Elements>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.time}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FaCalendarAlt />{" "}
                      {formData.paymentMethod === "esewa"
                        ? `Secure Booking • NPR ${nprAmount.toLocaleString()}`
                        : `Secure Booking • USD ${isPremium ? "100.00" : "50.00"}`}
                    </>
                  )}
                </button>
              )}

              {redirecting && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center animate-pulse">
                  <p className="text-blue-700 font-bold flex items-center justify-center gap-2">
                    <FaInfoCircle /> Redirecting to eSewa in {countdown}{" "}
                    seconds...
                  </p>
                  <p className="text-[10px] text-blue-500 mt-1">
                    Please do not refresh the page or go back.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
