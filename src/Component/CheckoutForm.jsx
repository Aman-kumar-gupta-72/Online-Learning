import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

const CheckoutForm = ({ courseId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || paymentProcessed) {
      console.log("⚠️ Payment already processing or Stripe not ready");
      return;
    }

    setProcessing(true);
    setPaymentProcessed(true);

    try {
      console.log("💳 INITIATING PAYMENT FOR COURSE:", courseId);
      console.log("🔐 CLIENT SECRET:", clientSecret?.substring(0, 20) + "...");

      // Confirm payment with Stripe
      // This will process the payment and return the result
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?courseId=${courseId}`,
        },
        redirect: "if_required", // Only redirect if 3D Secure or other action needed
      });

      if (error) {
        console.error("❌ STRIPE ERROR DETAILS:", {
          message: error.message,
          code: error.code,
          type: error.type,
          paymentIntentId: error.payment_intent?.id,
        });
        
        setPaymentProcessed(false); // Allow retry
        const errorMsg = error.message || error.code || "Payment failed";
        toast.error(errorMsg);
        setProcessing(false);
        return;
      }

      console.log("✅ STRIPE PAYMENT CONFIRMED:", {
        id: paymentIntent?.id,
        status: paymentIntent?.status,
        amount: paymentIntent?.amount,
      });

      // Payment succeeded or is processing
      if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
        console.log("✅ PAYMENT SUCCESSFUL - CONFIRMING WITH BACKEND");
        
        // Store in sessionStorage for PaymentSuccess page
        sessionStorage.setItem("courseId", courseId);
        sessionStorage.setItem("paymentIntentId", paymentIntent.id);

        try {
          console.log("📤 CONFIRMING WITH BACKEND");

          const { data } = await axios.post(
            "http://localhost:2000/api/payment/confirm",
            {
              paymentIntentId: paymentIntent.id,
              courseId,
            },
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );

          console.log("✅ BACKEND CONFIRMED:", data);
          toast.success("Payment successful! Redirecting...");
          
          setTimeout(() => {
            navigate(`/payment-success?payment_intent=${paymentIntent.id}`);
          }, 1000);

        } catch (backendErr) {
          console.error("❌ BACKEND ERROR:", backendErr?.response?.data);
          toast.error(
            backendErr.response?.data?.message || "Backend confirmation failed"
          );
          // Still redirect to success page since payment was processed by Stripe
          setTimeout(() => {
            navigate(`/payment-success?payment_intent=${paymentIntent.id}`);
          }, 1500);
        }
      } else {
        console.error("❌ UNEXPECTED PAYMENT STATUS:", paymentIntent?.status);
        toast.error("Payment status: " + paymentIntent?.status);
        setPaymentProcessed(false);
        setProcessing(false);
      }

    } catch (err) {
      console.error("❌ UNEXPECTED ERROR:", err);
      toast.error(err.message || "Payment processing failed");
      setPaymentProcessed(false);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-10 transition-all">
        <label className="block text-sm font-semibold text-gray-900 mb-4">Card Details</label>
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: "",
                email: "",
              },
            },
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-200 flex items-center justify-center gap-2 ${
          processing || !stripe
            ? "bg-gray-400 cursor-not-allowed opacity-75"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl"
        }`}
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Complete Payment</span>
          </>
        )}
      </button>

      {/* Security Info */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414L10 3.586l4.707 4.707a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>Your payment information is encrypted and secure</span>
      </div>
    </form>
  );
};

export default CheckoutForm;
