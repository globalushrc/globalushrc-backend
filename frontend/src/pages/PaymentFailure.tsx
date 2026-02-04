import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="text-4xl text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-slate-600 mb-8">
          The payment process was cancelled or failed. Your booking has not been
          confirmed yet.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/book-consultation"
            className="w-full bg-[#001f3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Retry Booking
          </Link>
          <Link to="/" className="text-slate-500 font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
