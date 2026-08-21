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
const Help = lazy(() => import("./pages/Help.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Fallback for the dark, "tesla-inspired" public marketing pages (Login/Signup).
function PublicRouteFallback() {
  return (
    <div className="min-h-screen bg-[#15192E] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#CE60F0] animate-spin" />
    </div>
  );
}

// Fallback for the light .shepilot-app dashboard shell (all protected pages).
// Using the dark PublicRouteFallback here caused a jarring dark-to-light
// flash every time a protected page lazy-loaded.
function AppRouteFallback() {
  return (
    <div className="shepilot-app min-h-screen flex items-center justify-center">
      <div
        className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: "var(--sp-border-strong)", borderTopColor: "var(--sp-primary)" }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <Suspense fallback={<PublicRouteFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<PublicRouteFallback />}>
            <Signup />
          </Suspense>
        }
      />

      {/* Protected Routes — all AI tools require auth since they read/write per-user Firestore data */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <ActivityHistory />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/business-idea"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <BusinessIdea />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <Roadmap />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketing"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <MarketingPlanner />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <FinancePlanner />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <AIMentor />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pitch"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <PitchDeck />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/startup-canvas"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <StartupCanvas />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/startup-validator"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <StartupValidator />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <Help />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AppRouteFallback />}>
              <Settings />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Catch-all — NotFound keeps the dark public identity, not the light dashboard shell */}
      <Route
        path="*"
        element={
          <Suspense fallback={<PublicRouteFallback />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
