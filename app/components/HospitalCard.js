import { MapPin, Phone, Navigation } from "lucide-react";

export default function HospitalCard({ hospital }) {
  return (
    <div className="glass-card p-5 group hover-glow transition-all duration-500 hover:-translate-y-1">
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5">
        <img
          src={hospital.image || "/hospital-default.png"}
          alt={hospital.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent " />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass text-xs font-semibold text-accent shadow-lg">
          <Navigation size={12} className="fill-accent" />
          {hospital.distance} km away
        </div>
      </div>

      <h3 className="text-white font-bold text-xl mb-3 group-hover:text-accent transition-colors">
        {hospital.name}
      </h3>

      <div className="space-y-2.5">
        <div className="flex items-start gap-3 text-zinc-400">
          <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed line-clamp-2">
            {hospital.address}
          </p>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <Phone size={18} className="text-accent shrink-0" />
          <p className="text-sm font-medium">
            {hospital.phone}
          </p>
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-xl glass border-accent/20 text-white font-semibold text-sm hover:bg-accent hover:text-white transition-all duration-300 active:scale-95">
        View Details
      </button>
    </div>
  );
}
