import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";

// Route-level code splitting: only the landing page + its components ship in
// the initial bundle. Auth pages and every AI tool page are fetched on demand,
// which matters here since there are 8 near-identical, fairly heavy tool pages.
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const ActivityHistory = lazy(() => import("./pages/ActivityHistory.jsx"));
const BusinessIdea = lazy(() => import("./pages/BusinessIdea.jsx"));
const Roadmap = lazy(() => import("./pages/Roadmap.jsx"));
const MarketingPlanner = lazy(() => import("./pages/MarketingPlanner.jsx"));
const FinancePlanner = lazy(() => import("./pages/FinancePlanner.jsx"));
const AIMentor = lazy(() => import("./pages/AIMentor.jsx"));
const PitchDeck = lazy(() => import("./pages/PitchDeck.jsx"));
const StartupCanvas = lazy(() => import("./pages/StartupCanvas.jsx"));
const StartupValidator = lazy(() => import("./pages/StartupValidator.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#15192E] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#CE60F0] animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes — all AI tools require auth since they read/write per-user Firestore data */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ActivityHistory /></ProtectedRoute>} />
        <Route path="/business-idea" element={<ProtectedRoute><BusinessIdea /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/marketing" element={<ProtectedRoute><MarketingPlanner /></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute><FinancePlanner /></ProtectedRoute>} />
        <Route path="/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
        <Route path="/pitch" element={<ProtectedRoute><PitchDeck /></ProtectedRoute>} />
        <Route path="/startup-canvas" element={<ProtectedRoute><StartupCanvas /></ProtectedRoute>} />
        <Route path="/startup-validator" element={<ProtectedRoute><StartupValidator /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
