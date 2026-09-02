import { useState } from "react";
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  showToast: (type: "success" | "error" | "info", message: string) => void;
}

export function AuthModal({ showToast }: AuthModalProps) {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (authModalMode === "login") {
        await login({ email, password });
        showToast("success", "Welcome back! Logged in successfully.");
      } else {
        if (!name.trim()) {
          setErrorMsg("Please enter your name");
          setLoading(false);
          return;
        }
        await register({ name, email, password });
        showToast("success", "Account created successfully! Welcome to BookMyShow.");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              (err as { response?: { data?: { message?: string } } })
                .response?.data?.message ?? "Authentication failed"
            )
          : "Invalid email or password. Please try again.";
      setErrorMsg(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setName("Alex Rivera");
    setEmail("alex.rivera@example.com");
    setPassword("password123");
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={closeAuthModal}>
      <div
        className="auth-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeAuthModal}>
          <X size={20} />
        </button>

        {/* Brand Banner */}
        <div className="auth-header-card">
          <div className="auth-shield-icon">
            <ShieldCheck size={28} color="#f84464" />
          </div>
          <h3 className="auth-header-title">
            {authModalMode === "login"
              ? "Welcome Back to BookMyShow"
              : "Create Your Account"}
          </h3>
          <p className="auth-header-sub">
            Powered by Passport.js & MongoDB Atlas Authentication
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${
              authModalMode === "login" ? "active" : ""
            }`}
            onClick={() => {
              setErrorMsg("");
              openAuthModal("login");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${
              authModalMode === "register" ? "active" : ""
            }`}
            onClick={() => {
              setErrorMsg("");
              openAuthModal("register");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {errorMsg && <div className="auth-error-badge">{errorMsg}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {authModalMode === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <UserIcon size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Button */}
          <button
            type="button"
            className="quick-demo-btn"
            onClick={handleQuickDemoFill}
          >
            <Sparkles size={14} color="#fbbf24" />
            <span>Fill Demo Credentials</span>
          </button>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" size={18} />
                <span>Processing...</span>
              </>
            ) : (
              <span>
                {authModalMode === "login" ? "Sign In" : "Create Account"}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
