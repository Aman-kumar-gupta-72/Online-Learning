import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Aman Kumar",
      role: "Full-Stack Developer",
      msg: "This platform completely changed the way I learn. Smooth UI, fast performance, and super helpful!",
      img: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Riya Sharma",
      role: "Student",
      msg: "I love the clean design and animations. Everything feels modern and professional!",
      img: "https://i.pravatar.cc/150?img=32",
    },
    {
      name: "Vikas Patel",
      role: "Entrepreneur",
      msg: "Best experience ever! Highly recommend it for anyone learning online.",
      img: "https://i.pravatar.cc/150?img=22",
    },
  ];

  return (
    <div className="w-full bg-gray-50 py-16 px-6 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-10 text-gray-800"
      >
        What Our Users Say
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <Quote className="w-10 h-10 text-yellow-500 mb-4" />

            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {t.msg}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <img
                src={t.img}
                alt="avatar"
                className="w-14 h-14 rounded-full shadow-md"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {t.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}