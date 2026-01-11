import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, AlertCircle } from "lucide-react";
import { CourseData } from "../Context/CourseContext";
import API from "../Config/Api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [message, setMessage] = useState("");
  const { fetchMyCourse } = CourseData();

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntent = searchParams.get("payment_intent");

      console.log("🔍 PAYMENT SUCCESS PAGE:", {
        paymentIntent,
        courseId: sessionStorage.getItem("courseId"),
      });

      if (!paymentIntent) {
        setStatus("failed");
        setMessage("Invalid payment session");
        return;
      }

      try {
        // Verify with backend - use the payment intent ID to confirm 
        const courseId = sessionStorage.getItem("courseId");
        
        console.log("📤 SENDING TO BACKEND:", {
          paymentIntentId: paymentIntent,
          courseId: courseId,
        });

        const { data } = await axios.post(
          `${API}/api/payment/confirm`,
          {
            paymentIntentId: paymentIntent,
            courseId: courseId || ""
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        console.log("✅ BACKEND RESPONSE:", data);

        if (data.enrolled) {
          setStatus("success");
          setMessage("Payment successful! You now have access to the course.");
          toast.success("Payment verified!");

          // Refresh the user's enrolled courses
          if (fetchMyCourse) {
            console.log("🔄 FETCHING MY COURSES...");
            await fetchMyCourse();
          }

          // Redirect to mycourse after 3 seconds
          setTimeout(() => {
            navigate("/mycourse");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support.");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("❌ PAYMENT VERIFICATION ERROR:", error);
        setStatus("failed");
        setMessage(
          error.response?.data?.message || "An error occurred while verifying payment"
        );
        toast.error("Verification failed");
      }
    };

    verifyPayment();
  }, [searchParams, navigate, fetchMyCourse]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === "success" ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to your courses in 3 seconds...
            </p>
            <button
              onClick={() => navigate("/mycourse")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Go to My Courses
            </button>
          </>
        ) : (
          <>
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
