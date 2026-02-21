import { useState } from "react";


export default function RadiusModal({ onClose, onSubmit }) {
  const [radius, setRadius] = useState("");

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl w-80 border border-zinc-700">
        <h2 className="text-lg font-semibold text-green-400 mb-4">
          Enter Radius (km)
        </h2>

        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          placeholder="e.g. 10"
          className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(Number(radius))}
            className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
