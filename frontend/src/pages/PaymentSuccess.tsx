import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaSpinner,
  FaCalendarCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("Verifying your payment...");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const navigate = useNavigate();
  const verificationDone = useRef(false);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      setStatus("error");
      setMessage("No payment data found.");
      return;
    }

    const verifyPayment = async () => {
      if (verificationDone.current) return;
      verificationDone.current = true;

      try {
        const hostname = window.location.hostname;
        const apiUrl =
          import.meta.env.VITE_API_URL || `http://${hostname}:5001`;

        // Step 1: Verify with backend
        const verifyRes = await fetch(
          `${apiUrl}/api/esewa/verify?data=${data}`,
        );
        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          // Step 2: Extract consultation ID from transaction UUID (format: TXN-ID-TIMESTAMP)
          const txnParts = verifyData.transaction_uuid.split("-");
          const consultationId = txnParts[1];

          // Step 3: Confirm payment in database
          const confirmRes = await fetch(
            `${apiUrl}/api/esewa/confirm-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                consultationId,
                transactionCode: verifyData.transaction_code,
                transactionUuid: verifyData.transaction_uuid,
                amount: verifyData.amount,
              }),
            },
          );

          const confirmData = await confirmRes.json();
          if (confirmRes.ok) {
            setStatus("success");
            setMessage("Payment successful! Your booking is confirmed.");
            setBookingDetails(confirmData.consultation);
          } else {
            setStatus("error");
            setMessage(confirmData.error || "Failed to confirm booking.");
          }
        } else {
          setStatus("error");
          setMessage(verifyData.error || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatus("error");
        setMessage("A connection error occurred during verification.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="text-4xl text-blue-600 animate-spin" />
            <h1 className="text-2xl font-bold text-slate-900">
              Verifying Payment
            </h1>
            <p className="text-slate-600 italic">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Payment Confirmed!
            </h1>
            <p className="text-slate-600 mb-8">{message}</p>

            {bookingDetails && (
              <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                  <FaCalendarCheck className="text-blue-600" />
                  <span className="font-bold text-slate-800">
                    Booking Summary
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-semibold text-slate-900">
                      {bookingDetails.service}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-semibold text-slate-900">
                      {bookingDetails.preferredDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-semibold text-slate-900">
                      {bookingDetails.preferredTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-semibold text-emerald-600">
                      NPR {bookingDetails.amountPaid}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 mr-2">Ref ID:</span>
                    <span className="bg-slate-100 px-4 py-1.5 rounded-lg font-mono font-black text-slate-800 text-lg shadow-inner">
                      {bookingDetails.referenceId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#001f3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Back to Home
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-4xl text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-slate-600 mb-8">{message}</p>
            <div className="flex flex-col gap-3">
              <Link
                to="/book-consultation"
                className="w-full bg-[#001f3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Try Again
              </Link>
              <Link
                to="/contact"
                className="text-blue-600 font-semibold hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
