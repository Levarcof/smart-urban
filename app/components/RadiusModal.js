import { useState } from "react";
import { X, Navigation } from "lucide-react";

export default function RadiusModal({ onClose, onSubmit }) {
  const [radius, setRadius] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-sm p-8 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Navigation size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">
            Set Exploration Radius
          </h2>
        </div>

        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          Specify the distance in kilometers to find hospitals and services near your location.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="e.g. 10"
              className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all text-lg font-medium"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm tracking-widest">KM</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl glass border-white/5 text-zinc-400 font-semibold hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(Number(radius))}
              className="flex-[2] premium-button"
            >
              Search Area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
