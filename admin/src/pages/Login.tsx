import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { getBaseUrl } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userData = localStorage.getItem("admin_user");
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === "SUPER_ADMIN" || user.role === "SELLER") {
          navigate("/", { replace: true });
        }
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.role !== "SUPER_ADMIN" && data.role !== "SELLER") {
        throw new Error(
          "Access denied. Only Admins and Sellers can access this portal.",
        );
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data));
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
        background: "#FFFFFF",
      }}
    >
      {/* ─── LEFT: IMAGE, LOGO, NAME & SMALL TEXT ONLY ─── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          position: "relative",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "64px 56px",
          overflow: "hidden",
          backgroundColor: "#0F172A",
        }}
      >
        {/* Background Shop Image with Increased Opacity */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('/image/art.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.85,
            transform: "scale(1.02)",
          }}
        />

        {/* Soft Contrast Overlay for Clear Text Readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.85) 100%)",
          }}
        />

        {/* Left Content: Logo + Brand Name + Small Text */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 420 }}>
          <div
            style={{
              width: 72,
              height: 72,
              marginBottom: 20,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
            }}
          >
            <img
              src="/logo_mark.png"
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "invert(1) brightness(2)",
              }}
            />
          </div>

          <h1
            style={{
              color: "#FFFFFF",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              fontFamily: '"Edu VIC WA NT Hand", cursive',
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            All African Handcraft
          </h1>

          <p
            style={{
              color: "#F8FAFC",
              fontSize: 15,
              marginTop: 12,
              lineHeight: 1.6,
              fontWeight: 500,
              opacity: 0.92,
              textShadow: "0 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            Made in Rwanda fashion and authentic cultural handicrafts.
          </p>
        </div>
      </div>

      {/* ─── RIGHT: CLEAN LOGIN FORM ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 24px",
          background: "#F8FAFC",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 24,
            padding: "44px 36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          {/* Form Header without AI badge */}
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: "#0F172A",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              Sign In
            </h2>
            <p style={{ color: "#64748B", fontSize: 14 }}>
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FEE2E2",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 20,
                color: "#DC2626",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Email Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: "#94A3B8",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="admin-input"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: "#94A3B8",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="admin-input"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94A3B8",
                    padding: 0,
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: 16, height: 16 }} />
                  ) : (
                    <Eye style={{ width: 16, height: 16 }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: loading ? "#94A3B8" : "#0F172A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 12,
                padding: "14px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.18s ease",
              }}
            >
              {loading ? (
                "Signing In…"
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          {/* Clean Footer note */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <p style={{ color: "#94A3B8", fontSize: 12 }}>
              © 2026 All African Handcraft Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
