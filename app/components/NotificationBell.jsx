"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchNotifications,
  fetchUnreadNotifications,
  markAllNotificationsRead,
} from "../../services/notificationService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef   = useRef(null);
  const router      = useRouter();

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [unreadRes, allRes] = await Promise.all([
        fetchUnreadNotifications(),
        fetchNotifications(),
      ]);
      setUnreadCount(unreadRes.unread_notifications?.length || 0);
      setNotifications(allRes.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    loadNotifications();
  };

  const handleBellClick = () => {
    if (window.innerWidth < 768) {
      router.push("/notifications");
    } else {
      setOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current  && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // isolation:isolate creates a new stacking context so z-index works correctly
    <div className="relative" style={{ isolation: "isolate" }}>

      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={handleBellClick}
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-[#0D1F1A]"
            style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop — sits behind dropdown but above everything else */}
          <div
            className="hidden md:block fixed inset-0"
            style={{ zIndex: 9100 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={dropdownRef}
            className="hidden md:block absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              zIndex: 9200,
              background: "#0f2820",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-amber-500" />
                <span className="font-bold text-white text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-[#0D1F1A]"
                    style={{ background: "linear-gradient(135deg, #C8873A, #E8A850)" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-white/30 hover:text-emerald-400 transition-colors"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="py-10 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                  <p className="text-white/30 text-xs">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 flex flex-col items-center gap-2">
                  <Bell size={28} className="text-white/10" />
                  <p className="text-white/30 text-xs">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                      !n.read_at ? "border-l-2 border-l-amber-500/60" : ""
                    }`}
                  >
                    <p className={`text-sm leading-snug ${!n.read_at ? "font-semibold text-white" : "text-white/50"}`}>
                      {n.data?.message || "New activity"}
                    </p>
                    <p className="text-[11px] text-white/25 mt-1">
                      {new Date(n.created_at).toLocaleString("en-NG", {
                        dateStyle: "medium", timeStyle: "short",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 10 && (
              <div className="px-4 py-3 border-t border-white/10 text-center">
                <button
                  onClick={() => { router.push("/notifications"); setOpen(false); }}
                  className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                >
                  View all notifications →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}