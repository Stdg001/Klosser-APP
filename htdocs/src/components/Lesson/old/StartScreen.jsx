import { motion } from "framer-motion";
import {
  FiAward,
  FiPlay,
  FiZap,
  FiInfo,
} from "react-icons/fi";

export default function StartScreen({ mission, onStart, fadeIn }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
        {/* Portada */}
        <div
          className="sm:col-span-2 sm:h-auto rounded-xl border border-gray-200"
          style={{
            background:
              "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(59,130,246,0.25))",
          }}
        />

        {/* Info */}
        <div className="sm:col-span-3 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{mission.title}</h1>
          <p className="text-gray-700">{mission.objective || mission.objectivo || mission.descripcion}</p>

          <div className="flex flex-wrap gap-2">
            {(mission.required_skills || mission.habilidades_requeridas || []).map((s, i) => (
              <span key={i} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700">
                {s}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <InfoBadge icon={<FiZap />} label="Rejugabilidad" value={`${mission.replayability?.alternative_paths || mission.rejugabilidad?.caminos_alternativos || 0} rutas`} />
            <InfoBadge icon={<FiInfo />} label="Escenas ocultas" value={mission.replayability?.hidden_scenes || mission.rejugabilidad?.escenas_ocultas || 0} />
            <InfoBadge icon={<FiAward />} label="Logros" value={(mission.achievements || mission.logros || []).length} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 font-semibold text-white shadow-md"
          >
            <FiPlay /> Iniciar misión
          </motion.button>
        </div>
      </div>

      {/* Eventos aleatorios */}
      {mission.replayability?.random_events?.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
            <FiZap /> Posibles eventos aleatorios
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {mission.replayability.random_events.map((e, i) => (
              <li key={i} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">• {e}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

function InfoBadge({ icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
      <span className="text-gray-500">{icon}</span>
      <span className="font-medium text-gray-900">{label}:</span>
      <span>{value}</span>
    </span>
  );
}
