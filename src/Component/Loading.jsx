import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      {/* Glow background circle */}
      <div className="absolute w-72 h-72 bg-blue-500/10 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        ></motion.div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-xl mt-6 tracking-wide font-semibold"
        >
          Loading, please wait...
        </motion.h1>

        {/* Dots animation */}
        <div className="flex gap-2 mt-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
