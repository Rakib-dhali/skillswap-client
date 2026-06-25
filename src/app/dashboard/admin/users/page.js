"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await authClient.admin.listUsers({
          query: {
            limit: 200,
            offset: 0,
            sortBy: "name",
            sortDirection: "asc",
          },
        });

        if (error) {
          throw new Error(error.message || "Unable to load users.");
        }

        if (active) {
          setUsers(data?.users?.map((user) => ({
            ...user,
            id: user.id || user._id || "",
          })) || []);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load user list.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      active = false;
    };
  }, []);

  const toggleBan = async (userId, currentlyBanned) => {
    setUpdatingId(userId);
    try {
      const action = currentlyBanned ? "unbanUser" : "banUser";
      const params = currentlyBanned ? { userId } : { userId, banReason: "Admin action" };
      const { data, error } = await authClient.admin[action](params);

      if (error) {
        throw new Error(error.message || "Unable to update user status.");
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, banned: !currentlyBanned } : user,
        ),
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-10 select-none">
      <div className="border-b border-black/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Manage Users
          </h1>
          <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
            Ban or restore access for platform accounts
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 text-red-700 p-6 rounded-none">
          <p className="font-bold uppercase text-sm">Unable to load users</p>
          <p className="mt-2 text-xs text-red-600">{error}</p>
        </div>
      ) : null}

      <div className="bg-white border border-black/10 p-6 shadow-sm rounded-none overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-black/5 text-[9px] font-bold uppercase tracking-widest text-black/50">
            <tr>
              <th className="py-4 px-3">Name</th>
              <th className="py-4 px-3">Email</th>
              <th className="py-4 px-3">Role</th>
              <th className="py-4 px-3">Status</th>
              <th className="py-4 px-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-sm">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                  <td className="py-4 px-3 h-8 bg-black/5"></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-sm text-black/50">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-black/2 transition-colors">
                  <td className="py-4 px-3 font-bold text-black uppercase tracking-tight text-xs">
                    {user.name || "Unnamed"}
                  </td>
                  <td className="py-4 px-3 text-black/70 text-xs">{user.email}</td>
                  <td className="py-4 px-3 text-black/70 text-xs uppercase">{(user.role || "client").toString()}</td>
                  <td className="py-4 px-3 text-xs font-bold uppercase tracking-wider">
                    <span className={`inline-flex px-2.5 py-1 rounded-full ${user.banned ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {user.banned ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <button
                      type="button"
                      onClick={() => toggleBan(user.id, !!user.banned)}
                      disabled={updatingId === user.id}
                      className="bg-black text-white uppercase tracking-widest text-[10px] px-3 py-2 disabled:opacity-40"
                    >
                      {user.banned ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
