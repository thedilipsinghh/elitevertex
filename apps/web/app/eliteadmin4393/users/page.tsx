"use client";

import { useState } from "react";
import {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} from "@/lib/features/api/apiSlice";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: response, isLoading } = useGetAdminUsersQuery(undefined);
  const users: AdminUser[] = response?.data || [];
  const [createUser] = useCreateAdminUserMutation();
  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteAdminUserMutation();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      await createUser(form).unwrap();
      setMessage("✓ User created successfully.");
      setForm({ name: "", email: "", password: "", role: "editor" });
    } catch (err: any) {
      setMessage(err?.data?.message || "Failed to create user.");
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    await updateUser({ id, role });
  };

  const handleDelete = async (user: AdminUser) => {
    if (confirm(`Delete user "${user.email}"?`)) {
      try {
        await deleteUser(user.id).unwrap();
      } catch (err: any) {
        setMessage(err?.data?.message || "Failed to delete user.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Users & Roles</h1>
        <p className="text-body-md text-on-surface-variant">
          Manage admin accounts. Editors can manage content drafts; only admins can publish and manage users.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-space-sm rounded-lg text-body-sm font-semibold">
          {message}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant grid grid-cols-1 md:grid-cols-5 gap-space-sm items-end"
      >
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-on-surface">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-on-surface">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-on-surface">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-on-surface">Role</span>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit" className="bg-primary text-on-primary px-space-lg py-3 rounded-lg font-label-md">
          + Add User
        </button>
      </form>

      <div className="bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant overflow-x-auto">
        {isLoading ? (
          <p className="text-on-surface-variant">Loading users...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-outline-variant/60 hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-headline-sm text-primary">{user.name}</td>
                  <td className="p-3 text-body-sm text-on-surface-variant">{user.email}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`text-label-sm font-label-sm uppercase px-2 py-1 rounded font-semibold outline-none ${
                        user.role === "admin"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-body-sm text-on-surface-variant whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(user)} className="text-error font-label-sm hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
