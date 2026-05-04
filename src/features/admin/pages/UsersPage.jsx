import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, ShieldOff, ShieldCheck,
  UserX, UserCheck, Loader2, RefreshCw, X,
} from "lucide-react";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

/* ── Variants ─────────────────────────────────────────────────── */
const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const rowV = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

/* ── Avatar fallback ──────────────────────────────────────────── */
function Avatar({ src, name }) {
  const [err, setErr] = useState(false);
  const initials = name?.slice(0, 2).toUpperCase() || "??";
  const colors = [
    "from-violet-400 to-indigo-500",
    "from-sky-400 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
      />
    );
  }
  return (
    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ── Role badge ───────────────────────────────────────────────── */
function RoleBadge({ role }) {
  const map = {
    admin: "bg-violet-50 text-violet-700 ring-violet-200",
    moderator: "bg-sky-50 text-sky-700 ring-sky-200",
    user: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold ring-1 capitalize ${map[role] || map.user}`}>
      {role}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.USERS);
      setUsers(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const v = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.username?.toLowerCase().includes(v) ||
          u.email?.toLowerCase().includes(v)
      )
    );
  }, [search, users]);

  const toggleBan = async (userId, isBanned) => {
    try {
      setTogglingId(userId);
      await api.patch(`${API_ENDPOINTS.USERS}/${userId}/ban`, { isBanned: !isBanned });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: !isBanned } : u))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const totalActive = users.filter((u) => !u.isBanned).length;
  const totalBanned = users.filter((u) => u.isBanned).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[400px] rounded-full bg-violet-200/25 blur-[110px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[350px] rounded-full bg-sky-100/30 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200 flex-shrink-0">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Users Management
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                View and control all platform users
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <motion.button
              whileHover={{ rotate: 90, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={fetchUsers}
              disabled={loading}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </motion.button>

            {/* Search */}
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-sm transition-all duration-200 ${
              searchFocused
                ? "bg-white border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.1)] w-64"
                : "bg-white border-slate-200 shadow-sm w-48 hover:border-slate-300"
            }`}>
              <Search size={14} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent outline-none text-slate-700 placeholder:text-slate-300 text-sm w-full"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
                  >
                    <X size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Stat pills ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="mono text-sm font-bold text-slate-800">{users.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600">Active</span>
            <span className="mono text-sm font-bold text-emerald-700">{totalActive}</span>
          </div>
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="text-xs font-semibold text-rose-500">Banned</span>
            <span className="mono text-sm font-bold text-rose-600">{totalBanned}</span>
          </div>
          {search && (
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3.5 py-2">
              <span className="text-xs font-semibold text-violet-600">Results</span>
              <span className="mono text-sm font-bold text-violet-700">{filtered.length}</span>
            </div>
          )}
        </motion.div>

        {/* ── Table card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Table head */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-5 py-3 border-b border-slate-100 bg-slate-50">
            {["User", "Email", "Role", "Status", "Action"].map((h, i) => (
              <p key={h} className={`text-[10px] font-bold uppercase tracking-widest text-slate-400 ${i === 4 ? "text-right" : ""}`}>
                {h}
              </p>
            ))}
          </div>

          {/* States */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Loader2 size={18} className="text-violet-500 animate-spin" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Loading users…</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Users size={18} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">No users found</p>
                  {search && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try a different search term
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="rows"
                variants={containerV}
                initial="hidden"
                animate="show"
              >
                {filtered.map((user, idx) => {
                  const isToggling = togglingId === user._id;
                  return (
                    <motion.div
                      key={user._id}
                      variants={rowV}
                      layout
                      className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center px-5 py-3.5 transition-colors duration-150 hover:bg-slate-50/80 ${
                        idx !== filtered.length - 1 ? "border-b border-slate-100" : ""
                      } ${user.isBanned ? "opacity-70" : ""}`}
                    >
                      {/* User */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar src={user.profile} name={user.username} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {user.username}
                          </p>
                          <p className="text-[11px] text-slate-400 mono truncate">
                            #{user._id?.slice(-6)}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <p className="text-sm text-slate-500 truncate pr-4">{user.email}</p>

                     

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold ring-1 ${
                          user.isBanned
                            ? "bg-rose-50 text-rose-600 ring-rose-200"
                            : "bg-emerald-50 text-emerald-600 ring-emerald-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-rose-400" : "bg-emerald-400"}`} />
                          {user.isBanned ? "Banned" : "Active"}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 320, damping: 20 }}
                          disabled={isToggling}
                          onClick={() => toggleBan(user._id, user.isBanned)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                            user.isBanned
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                          }`}
                        >
                          {isToggling ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : user.isBanned ? (
                            <UserCheck size={12} />
                          ) : (
                            <UserX size={12} />
                          )}
                          {isToggling ? "…" : user.isBanned ? "Unban" : "Ban"}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer row */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-600">{users.length}</span> users
              </p>
              <p className="text-xs text-slate-400">
                Last refreshed <span className="font-semibold text-slate-600">just now</span>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UsersPage;