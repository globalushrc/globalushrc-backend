import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface PaymentSectionProps {
  onPaymentSuccess: (paymentId: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  onPaymentSuccess,
  isProcessing,
  setIsProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/book-consultation",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent.id);
      } else {
        setErrorMessage("Payment failed or was cancelled.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4">Secure Payment</h3>
      <div className="mb-6">
        <PaymentElement />
      </div>
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
          {errorMessage}
        </div>
      )}
      <button
        disabled={!stripe || isProcessing}
        type="submit"
        className="w-full bg-[#001f3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Processing...
          </>
        ) : (
          "Pay $50.00 & Confirm Booking"
        )}
      </button>
      <div className="text-center text-xs text-slate-400 mt-6 flex flex-col items-center justify-center gap-2">
        <p className="flex items-center gap-1">
          <span className="bg-slate-200 w-3 h-3 rounded-full flex items-center justify-center text-[8px] text-slate-600 font-bold">
            🔒
          </span>
          Secure 256-bit SSL Encrypted Payment
        </p>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
          alt="Powered by Stripe"
          className="h-7 opacity-60 hover:opacity-100 transition-opacity"
        />
      </div>
    </form>
  );
};

export default PaymentSection;
