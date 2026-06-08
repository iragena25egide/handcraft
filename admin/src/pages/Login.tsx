import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Store token
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data));
      
      // Navigate to dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-[#0A0F1C] text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded text-sm font-bold tracking-wider">RC</div>
          <span className="font-bold text-lg tracking-tight">All African Handcraft</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-16 px-4">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>

          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#0A0F1C] text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">
              RC
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h1>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-xl py-3 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
                    placeholder="iragenaegide205@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#0A0F1C] hover:bg-slate-800 text-white py-6 rounded-xl text-[13px] font-bold uppercase tracking-wider shadow-lg shadow-slate-900/20 transition-all"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-500 font-medium">Default Admin Login</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p>Email: <span className="font-bold text-slate-900">admin@handicraft.co.rw</span></p>
              <p>Password: <span className="font-bold text-slate-900">Admin@h2026</span></p>
              <p className="mt-2 text-xs italic">No need to create an account, just sign in directly.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
