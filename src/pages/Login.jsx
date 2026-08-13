import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { login, loginWithGoogle, getAuthErrorMessage } from "../firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password);

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await loginWithGoogle();

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#15192E] flex items-center justify-center px-6 relative overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-[#464efe]/20 blur-[150px] rounded-full -top-20 -right-20"></div>
      <div className="absolute w-[500px] h-[500px] bg-[#ce60f0]/20 blur-[150px] rounded-full -bottom-20 -left-20"></div>

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >

        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#464efe] to-[#ce60f0] flex items-center justify-center">
            <Sparkles className="text-white" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white">Welcome Back</h1>

        <p className="text-center text-white/60 mt-2 mb-8">
          Login to continue building your startup.
        </p>

        <label htmlFor="login-email" className="sr-only">Email Address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/30 transition"
        />

        <label htmlFor="login-password" className="sr-only">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/30 transition"
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#464efe] to-[#ce60f0] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-white/60 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[#ce60f0] font-semibold">
            Sign Up
          </Link>
        </p>

      </motion.form>

    </div>
  );
}
