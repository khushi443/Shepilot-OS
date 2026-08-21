import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Matches the light .shepilot-app shell every protected page uses, so
// resolving auth doesn't flash a mismatched theme before redirect/render.
function AuthCheckFallback() {
  return (
    <div className="shepilot-app flex min-h-screen items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: "var(--sp-border-strong)", borderTopColor: "var(--sp-primary)" }}
      />
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Firebase hasn't resolved the session yet — don't redirect prematurely,
  // or a signed-in user gets bounced to /login on every hard refresh.
  if (loading) {
    return <AuthCheckFallback />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}