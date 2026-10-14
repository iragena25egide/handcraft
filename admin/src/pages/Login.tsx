import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
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
        throw new Error("Access denied. Only Admins and Sellers can access this portal.");
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

  const handleFillDemo = () => {
    setEmail("admin@handicraft.co.rw");
    setPassword("Admin@h2026");
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
      {/* ─── LEFT: SHOP SHOWCASE IMAGE & BRANDING (DESKTOP) ─── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 48px",
          overflow: "hidden",
          backgroundColor: "#0F172A",
        }}
      >
        {/* Background Shop Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('/image/art.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.38,
            transform: "scale(1.04)",
            transition: "transform 10s ease",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,0.95) 100%)",
          }}
        />

        {/* Top Header */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              marginBottom: 20,
            }}
          >
            <span>🇷🇼</span>
            <span>Made in Rwanda Artisanal Crafts</span>
          </div>

          <h2
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: "-0.6px",
              lineHeight: 1.2,
            }}
          >
            All African Handcraft
          </h2>
          <p
            style={{
              color: "#94A3B8",
              fontSize: 15,
              marginTop: 8,
              lineHeight: 1.5,
              maxWidth: 440,
            }}
          >
            Artisan & Executive Commerce Management Portal. Connecting authentic Rwandan cultural heritage with global collectors.
          </p>
        </div>

        {/* Middle Feature Highlights */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 20px",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(56, 189, 248, 0.2)",
                color: "#38BDF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>Curated Artisan Inventory</p>
              <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 2 }}>
                Real-time tracking of Agaseke, Imigongo art, Kitenge fashion, and traditional crafts.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 20px",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.2)",
                color: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>Executive Order Fulfillment</p>
              <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 2 }}>
                Secure order management, customer inquiries, and multi-channel fulfillment workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 24,
            }}
          >
            <p style={{ color: "#64748B", fontSize: 13 }}>
              Kigali, Rwanda • Worldwide Logistics
            </p>
            <span style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>v2.4 Enterprise</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: LOGIN FORM ─── */}
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
            maxWidth: 440,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 24,
            padding: "44px 36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "#F1F5F9",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 14,
              }}
            >
              <Sparkles style={{ width: 13, height: 13, color: "#0F172A" }} />
              <span>Admin & Seller Portal</span>
            </div>
            <h1
              style={{
                color: "#0F172A",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              Sign In
            </h1>
            <p style={{ color: "#64748B", fontSize: 14 }}>
              Enter your credentials to access the shop dashboard.
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
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                  placeholder="admin@handicraft.co.rw"
                  className="admin-input"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
              </div>
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
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Quick autofill helper */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "#F8FAFC",
                borderRadius: 10,
                border: "1px dashed #CBD5E1",
              }}
            >
              <span style={{ fontSize: 12, color: "#64748B" }}>Default Admin: <strong>admin@handicraft.co.rw</strong></span>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#0F172A",
                  background: "#E2E8F0",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Autofill
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
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
                  <span>Sign In to Portal</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
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
