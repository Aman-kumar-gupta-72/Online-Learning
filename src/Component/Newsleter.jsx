import React from "react";

const Newsletter = () => {
  return (
    <div className="w-full flex justify-center items-center py-20">
      <div className="bg-yellow-600/80 rounded-3xl p-15 w-full max-w-6xl text-center">

        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Subscribe to our newsletter
        </h2>
        <p className="text-xl md:text-3xl font-semibold text-white mt-2">
          Get the latest updates
        </p>

        {/* Input + Button */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-amber-400 md:w-2/3 px-6 py-3 rounded-xl text-black 
                       outline-none focus:ring-2 focus:ring-white text-lg"
          />

          <button
            className="px-8 py-3 bg-white text-yellow-700 font-semibold 
                       rounded-xl text-lg hover:bg-yellow-100 transition-all"
          >
            Subscribe
          </button>
        </div>

      </div>
    </div>
  );
};

export default Newsletter;
