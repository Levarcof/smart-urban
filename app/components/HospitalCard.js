export default function HospitalCard({ hospital }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg hover:border-green-400 transition">
      <img
        src={hospital.image || "/hospital-default.png"}
        alt="hospital"
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <h3 className="text-green-400 font-semibold text-lg">
        {hospital.name}
      </h3>

      <p className="text-gray-400 text-sm mt-1">
        📍 {hospital.address}
      </p>

      <p className="text-gray-300 text-sm mt-1">
        📞 {hospital.phone}
      </p>

      <p className="text-cyan-400 text-sm mt-2 font-semibold">
        🚗 {hospital.distance} km away
      </p>
    </div>
  );
}
