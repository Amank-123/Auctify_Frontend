import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  // Auto redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FF] px-6">

      <motion.div
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

        {/* 404 */}
        <h1 className="text-[80px] font-bold text-[#1F2937]">
          404
        </h1>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1F2937] mt-3">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-[15px] text-[#6B7280] mt-3 leading-7">
          The page you are looking for doesn’t exist or may have been moved.
          You will be redirected to the homepage in{" "}
          <span className="text-[#2563EB] font-medium">{count}s</span>.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">

          <Link
            to="/"
            className="px-6 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1D4ED8] transition"
          >
            Go Home
          </Link>

          <Link
            to="/auctions"
            className="px-6 py-2.5 border border-[#E5E7EB] text-[#1F2937] text-sm font-medium rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition"
          >
            Browse Auctions
          </Link>

        </div>

      </motion.div>
    </div>
  );
};

export default NotFound;