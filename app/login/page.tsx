"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setSession } from "@/lib/store/slices/userSlice";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, UserCircle2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (isLogin) {
        const response = await api.post("/users/login", { 
          email: formData.email, 
          password: formData.password 
        });
        const { token, ...user } = response.data;
        dispatch(setSession({ user, token }));
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        const response = await api.post("/users/register", formData);
        const { token, ...user } = response.data;
        dispatch(setSession({ user, token }));
        toast.success("Account created successfully!");
      }
      router.push("/profile");
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        toast.error(data.errors[0]);
      } else {
        toast.error(data?.message || "Authentication failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#fbbf24] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f172a] opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0f172a] transition-colors font-bold text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">RC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-[#0f172a]">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 rounded-[32px] sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="block w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172a]/20 focus:border-[#0f172a] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#0f172a] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? "New to All African Handcraft?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-[#0f172a] hover:text-black transition-colors"
              >
                {isLogin ? "Create an account" : "Sign in instead"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
