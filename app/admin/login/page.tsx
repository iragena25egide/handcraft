"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setSession } from "@/lib/store/slices/userSlice";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await api.post("/users/login", { 
        email: formData.email, 
        password: formData.password 
      });
      const { token, ...user } = response.data;

      if (user.role !== "SUPER_ADMIN") {
        toast.error("Access Denied: You do not have Super Admin privileges.");
        return;
      }

      dispatch(setSession({ user, token }));
      toast.success(`Welcome to the command center, ${user.name}!`);
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white">
          Admin Portal
        </h2>
        <p className="text-center text-gray-400 text-sm font-medium mt-2">Restricted Access</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-gray-800 py-8 px-4 shadow-2xl rounded-[32px] sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="admin@handcraft.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 hover:from-red-400 hover:to-red-500 transition-all"
            >
              Authenticate
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
 