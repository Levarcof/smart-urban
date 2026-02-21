"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Bell, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function NotificationPage() {
  const { user } = useUser(); // get current logged-in user
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientReady, setClientReady] = useState(false); // For safe date rendering

  // Client-side only flag
  useEffect(() => {
    setClientReady(true);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/userNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        setError(data.message || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/userNotification/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert(data.message || "Failed to delete notification");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen  bg-[#050505] text-white p-6 md:p-12 ">
        <h1 className="text-3xl pt-15 md:text-4xl font-bold mb-8 text-center flex items-center gap-3 text-emerald-400">
          <Bell size={28} /> Notifications
        </h1>

        {loading && <p className="text-gray-400">Loading notifications...</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!loading && notifications.length === 0 && !error && (
          <div className="text-center text-gray-500 py-20">
            <XCircle size={50} className="mx-auto mb-4" />
            <p className="text-lg">No notifications available.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex-1">
                <p className="text-sm md:text-base font-semibold text-emerald-400">{n.departmentName}</p>
                <p className="text-xs md:text-sm text-gray-300 mt-1">{n.message || "You have a new notification"}</p>
              </div>

              {n.image && (
                <img
                  src={n.image}
                  alt="Notification"
                  className="h-24 w-full object-cover rounded-xl border border-zinc-700 mt-2"
                />
              )}

              <div className="flex justify-between items-center mt-4">
                {clientReady ? (
                  <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                ) : (
                  <p className="text-xs text-gray-500">Loading...</p>
                )}

                <button
                  onClick={() => handleDelete(n._id)}
                  className="px-4 py-1 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}