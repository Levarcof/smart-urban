"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { User, Settings, Trash2, MapPin, FileText, X } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useUser();

  const [reports, setReports] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // File selected
  const [uploading, setUploading] = useState(false);

  const [activeTab, setActiveTab] = useState("routes");

  // ✅ IMAGE PREVIEW STATE
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ DELETE CONFIRM MODAL STATE
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
      setEmail(user.email || "");

    }
  }, [user]);

  const getReportApi = () => {
    if (activeTab === "routes") return "/api/myReport/road";
    if (activeTab === "garbage") return "/api/myReport/garbage";
    // if (activeTab === "medical") return "/api/myReport/medical";
  };

  const getDeleteApi = () => {
    if (activeTab === "routes") return "/api/report/solve";
    if (activeTab === "garbage") return "/api/garbage/solve";
    // if (activeTab === "medical") return "/api/medical/solve";
  };

  useEffect(() => {
    if (!user?.email) return;

    async function fetchReports() {
      try {
        const res = await fetch(getReportApi(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchReports();
  }, [user, activeTab]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!file) return image; // If no file, return previous URL
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET); // Cloudinary preset
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_NAME);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      setUploading(false);
      return json.secure_url; // Cloudinary URL
    } catch (error) {
      setUploading(false);
      console.error("Cloudinary Upload Error:", error);
      alert("❌ Image upload failed");
      return "";
    }
  };


  const updateProfile = async () => {
    setLoading(true);
    const imageUrl = await uploadToCloudinary();
    try {
      const res = await fetch("/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl, email }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        alert("Profile updated ✅");
      } else {
        alert("Update failed ❌");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // ✅ OPEN DELETE CONFIRM MODAL
  const openDeleteModal = (rep) => {
    setSelectedReport(rep);
    setDeleteModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    if (!selectedReport) return;

    try {
      const res = await fetch(getDeleteApi(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedReport._id, email: user.email }),
      });

      const data = await res.json();
      if (data.success) {
        setReports(data.allReports || []);
      } else {
        alert("Failed ❌");
      }
    } catch (error) {
      console.log(error);
    }

    setDeleteModal(false);
    setSelectedReport(null);
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen pt-22 bg-[#020617] text-white">

        {/* HEADER */}
        <div className="max-w-7xl text-center mx-auto px-2 sm:px-4 pt-10 pb-6">
          <h1 className="text-3xl text-green-400 md:text-4xl font-bold">Profile Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your profile and reports in one place
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={image || "/default-avatar.png"}
                  alt="profile"
                  className="w-28 h-28 rounded-full border-4 border-green-400 object-cover"
                />
                <button
                  onClick={() => setEditMode(true)}
                  className="absolute bottom-0 right-0 bg-green-500 text-black text-xs px-3 py-1 rounded-full"
                >
                  Edit
                </button>
              </div>

              <h2 className="mt-4 text-xl font-semibold flex items-center gap-2">
                <User size={18} /> {user?.name || "Guest User"}
              </h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>

              <div className="mt-6 w-full grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400">Total Reports</p>
                  <h3 className="text-2xl font-bold text-green-400">
                    {reports.length}
                  </h3>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400">Account Status</p>
                  <h3 className="text-sm font-semibold text-emerald-400">
                    Active
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">

            {/* ✅ RESPONSIVE TABS */}
            <div className="flex gap-4 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {[
                { key: "routes", label: "Routes" },
                { key: "garbage", label: "Garbage" },
                // { key: "medical", label: "Medical" },
                { key: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1 px-1 sm:px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-medium border whitespace-nowrap flex-shrink-0 transition ${activeTab === tab.key
                    ? "bg-green-500 text-black border-green-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                >
                  <span className="px-1 sm:px-2">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* REPORTS */}
            {activeTab !== "settings" && (
              <div>
                {reports.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <FileText size={40} className="mx-auto mb-3 opacity-50" />
                    No reports found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {reports.map((rep, i) => (
                      <div
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                      >
                        {activeTab === "garbage" && rep.images?.[0] && (
                          <img
                            src={rep.images[0]}
                            alt="garbage"
                            className="w-full h-44 sm:h-36 md:h-36 object-cover rounded-lg mb-3 cursor-pointer"
                            onClick={() => setPreviewImage(rep.images[0])}
                          />
                        )}

                        <h3 className="font-semibold text-green-300">
                          {rep.message}
                        </h3>

                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <MapPin size={12} /> {rep.address}
                        </p>
                        {rep.departments && 
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <MapPin size={12} />Send to :- {rep.departments?.[0]?.departmentName || "Not Assigned"}
                        </p>
                        }
                        

                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(rep.createdAt).toLocaleString()}
                        </p>

                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400">
                            Submitted
                          </span>

                          <button
                            onClick={() => openDeleteModal(rep)}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-4 text-sm text-gray-300">
                <p>Email: {user?.email}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-green-500 text-black rounded-lg flex items-center gap-2"
                >
                  <Settings size={16} /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ✅ DELETE CONFIRM MODAL */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0b1220] border border-white/10 rounded-xl p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-semibold text-green-400">
                Problem resolved?
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Are you sure you want to delete this report?
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-green-500 text-black py-2 rounded-lg font-semibold"
                >
                  Resolve
                </button>
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 bg-gray-600 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ IMAGE PREVIEW MODAL */}
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-red-500 z-50"
              >
                <X size={24} />
              </button>

              <img
                src={previewImage}
                className="max-w-full max-h-full rounded-xl border border-white/20 object-contain"
              />
            </div>
          </div>
        )}

        {editMode && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[#0b1220] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">

              <h2 className="text-xl font-semibold text-green-400 mb-4">
                Edit Profile
              </h2>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full mb-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="spotify-input bg-white/10 text-white"
              />
              <input
                value={email}
                disabled
                className="w-full mb-3 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-gray-400"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-black py-2 rounded-lg font-semibold"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
