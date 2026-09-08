import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#15192E] text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <p className="text-7xl font-black bg-gradient-to-r from-[#464EFE] to-[#CE60F0] bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-2xl font-bold mt-4">Page not found</h1>
        <p className="text-white/60 mt-3">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#464EFE] to-[#CE60F0] font-semibold hover:scale-105 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
