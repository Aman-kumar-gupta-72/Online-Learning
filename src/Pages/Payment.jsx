import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutFrom from "../Component/CheckoutForm"
import { CourseData } from "../Context/CourseContext";
import { UserData } from "../Context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Lock, 
  CheckCircle, 
  Star, 
  Clock, 
  BookOpen, 
  Award, 
  Download,
  ArrowLeft,
  Zap
} from "lucide-react";
import API from "../Config/Api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SnCfZ6OkEHX6uzKW1zxPnbYz5vVctWUTyoQpGl1y1SHbJzX5knCMnFIX8Bxai5N8l11vOEYyNwJ5IqeYFmK0TE700JZ3lyyX8" 
);

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = CourseData();
  const { isAuth, loading: authLoading } = UserData();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [intentError, setIntentError] = useState(null);
  const timeoutRef = useRef(null);
  const requestStartedRef = useRef(null);

  const course = courses?.find((c) => c._id === courseId);

  console.log("🔍 PAYMENT PAGE DEBUG:", {
    courseId,
    courseIdType: typeof courseId,
    courseIdExists: !!courseId,
    courseFound: !!course,
    coursesLoaded: !!courses,
    coursesLength: courses?.length,
  });

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token || !isAuth) {
      navigate("/login");
      return;
    }

    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setIntentError(null);
        requestStartedRef.current = Date.now();
        
        // Get price from course if available, otherwise use 0 and let server validate
        let priceAmount = course?.price ? parseFloat(course.price) : 0;
        
        console.log("📤 Creating payment intent with:", {
          amount: priceAmount,
          courseId: String(courseId),
          courseIdType: typeof courseId,
          course: course?.title || "NOT_FOUND",
          token: token ? "EXISTS" : "MISSING"
        });
        
        // Only call if courseId is truly defined
        if (!courseId) {
          console.error("❌ NO COURSE ID FOUND IN URL PARAMS");
          setIntentError("Course ID is missing from URL");
          setLoading(false);
          return;
        }
        
        const { data } = await axios.post(
          `${API}/api/payment/create-intent`,
          {
            amount: priceAmount,
            currency: "usd",
            courseId: String(courseId),
          },
          {
            headers: {
              token: token,
            },
            timeout: 30000, // 30 second timeout
          }
        );

        console.log("✅ Payment intent created:", data);
        setClientSecret(data.clientSecret);
        setIntentError(null);
      } catch (error) {
        console.error("❌ Payment intent error:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error message:", error.message);
        setIntentError(error.response?.data?.message || "Failed to create payment");
        toast.error(error.response?.data?.message || "Failed to create payment");
        navigate("/course");
      } finally {
        setLoading(false);
      }
    };

    // Only call if we have a courseId
    if (courseId) {
      console.log("✅ Course ID found, creating payment intent:", courseId);
      createPaymentIntent();
    } else {
      console.error("❌ NO COURSE ID IN URL - Cannot proceed");
      setIntentError("Course ID not found in URL");
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [courseId, isAuth, navigate, course]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg mb-6 animate-pulse">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Preparing Payment</h2>
          <p className="text-white/80 text-lg">Securing your transaction...</p>
          
          {/* Debug info */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white/60 text-sm max-w-md mx-auto">
            <p>📚 Course: {course?.title}</p>
            <p>💰 Amount: ${course?.price}</p>
            <p>🔑 Token: {localStorage.getItem("token") ? "✅ Present" : "❌ Missing"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (intentError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment Error</h2>
          <p className="text-gray-600 mb-6">{intentError}</p>
          <button
            onClick={() => navigate("/course")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white bg-red-500/20 p-8 rounded-lg backdrop-blur">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <p className="mb-4">Course ID: {courseId}</p>
          <p className="mb-4">Available courses: {courses?.length}</p>
          <button 
            onClick={() => navigate("/course")}
            className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-gray-100"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <button
          onClick={() => navigate("/course")}
          className="mb-8 inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all shadow-2xl group">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600">
                {course.image && (
                  <img
                    src={course.image.startsWith("http") ? course.image : `http://localhost:2000/uploads/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Zap size={14} />
                  Premium
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-white/60 text-sm mb-6 line-clamp-2">{course.description}</p>

                {/* Instructor Info */}
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  <div>
                    <p className="text-white font-semibold text-sm">By {course.createdBy}</p>
                    <p className="text-white/50 text-xs">Expert Instructor</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <BookOpen size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/80 text-sm">
                        {course.lectures?.length || 12} Video Lectures
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/80 text-sm">Lifetime Access</p>
                      <p className="text-white/50 text-xs">Learn at your own pace</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/80 text-sm">Certificate Included</p>
                      <p className="text-white/50 text-xs">Upon completion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Download size={18} className="text-pink-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white/80 text-sm">Download Materials</p>
                      <p className="text-white/50 text-xs">Study offline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Lock size={20} className="text-green-400" />
                Order Summary
              </h4>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-white/60">Subtotal</p>
                  <p className="text-white font-semibold">${parseFloat(course.price).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white/60">Tax</p>
                  <p className="text-white font-semibold">${(parseFloat(course.price) * 0.1).toFixed(2)}</p>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex justify-between items-center">
                  <p className="text-white font-bold">Total</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    ${(parseFloat(course.price) + parseFloat(course.price) * 0.1).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-100 text-sm">30-day money-back guarantee</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <span className="text-white font-semibold">Cart Review</span>
                    </div>
                  </div>
                  <div className="flex-1 h-1 mx-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 justify-end">
                      <span className="text-white font-semibold">Payment</span>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-white text-2xl font-bold mb-2">Secure Payment</h2>
              <p className="text-white/60 mb-8">Complete your enrollment by entering your payment details below</p>

              {/* Payment Form Container */}
              {clientSecret && (
                <div className="mb-8">
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret: clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "#8b5cf6",
                          colorBackground: "rgba(255, 255, 255, 0.05)",
                          colorText: "#ffffff",
                          colorTextSecondary: "rgba(255, 255, 255, 0.7)",
                          borderRadius: "12px",
                        },
                      },
                    }}
                  >
                    <CheckoutFrom courseId={courseId} clientSecret={clientSecret} />
                  </Elements>
                </div>
              )}

              {/* Security Features */}
              <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Lock size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">256-bit SSL</p>
                    <p className="text-white/50 text-xs">Encrypted & Secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <CheckCircle size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">PCI Compliant</p>
                    <p className="text-white/50 text-xs">Industry Standard</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Star size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Stripe Powered</p>
                    <p className="text-white/50 text-xs">Trusted Worldwide</p>
                  </div>
                </div>
              </div>

              {/* Test Card Info */}
              <div className="mt-8 pt-8 border-t border-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                <p className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Test Mode - Use Demo Card
                </p>
                <p className="text-white/70 text-xs mb-2">Card: <span className="font-mono font-semibold text-blue-300">4242 4242 4242 4242</span></p>
                <p className="text-white/70 text-xs">Any future date & any CVC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
