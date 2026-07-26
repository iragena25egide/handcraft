"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Trash2, Search, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
}

export default function AdminStaffPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    const toastId = toast.loading("Updating role...");
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      toast.success("Role updated successfully", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update role", { id: toastId });
    }
  };

  const handleDeleteUser = async (id: number, role: string) => {
    if (role === "SUPER_ADMIN") {
      toast.error("Cannot delete a Super Admin");
      return;
    }
    
    if (!window.confirm("Are you sure you want to completely remove this user? This action cannot be undone.")) return;
    
    const toastId = toast.loading("Deleting user...");
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user", { id: toastId });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Staff & Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage roles and platform access</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredUsers.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                <th className="p-4">User</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Role Access</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                        ${user.role === 'SUPER_ADMIN' ? 'bg-red-600' : 
                          user.role === 'ADMIN' ? 'bg-orange-500' : 
                          user.role === 'SELLER' ? 'bg-blue-500' : 'bg-gray-400'}
                      `}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          {user.role === "SUPER_ADMIN" ? <ShieldAlert className="w-3 h-3 text-red-500" /> : <UserIcon className="w-3 h-3" />}
                          ID: {user.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.role === "SUPER_ADMIN"}
                        className={`text-xs font-bold px-3 py-1 rounded-full border outline-none appearance-none cursor-pointer
                          ${user.role === "SUPER_ADMIN" ? "bg-red-100 text-red-700 border-red-200 cursor-not-allowed" : 
                            user.role === "ADMIN" ? "bg-orange-100 text-orange-700 border-orange-200" :
                            user.role === "SELLER" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-gray-100 text-gray-700 border-gray-200"
                          }
                        `}
                      >
                        <option value="USER">Customer (USER)</option>
                        <option value="SELLER">Seller (SELLER)</option>
                        <option value="ADMIN">Admin (ADMIN)</option>
                        {user.role === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Admin</option>}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.role)}
                        disabled={user.role === "SUPER_ADMIN"}
                        className={`p-2 transition ${user.role === 'SUPER_ADMIN' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
                        title="Revoke Access (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
