import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { signup, loginWithGoogle, getAuthErrorMessage } from "../firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await signup(email, password);

      toast.success("Account created successfully");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);

      await loginWithGoogle();

      toast.success("Signed up with Google");

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
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >

        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#464efe] to-[#ce60f0] flex items-center justify-center">
            <Sparkles className="text-white" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white">Create Account</h1>

        <p className="text-center text-white/60 mt-2 mb-8">
          Start your startup journey today.
        </p>

        <label htmlFor="signup-email" className="sr-only">Email Address</label>
        <input
          id="signup-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/30 transition"
        />

        <label htmlFor="signup-password" className="sr-only">Password</label>
        <input
          id="signup-password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-white/30 transition"
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#464efe] to-[#ce60f0] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-white/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ce60f0] font-semibold">
            Login
          </Link>
        </p>

      </motion.form>

    </div>
  );
}
