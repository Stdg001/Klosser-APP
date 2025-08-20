import { motion } from "framer-motion";
import {
  FiAward,
  FiRotateCw,
  FiStar,
} from "react-icons/fi";

export default function ResultScreen({ result, totalPoints, stars, achievements, mission, onRestart, fadeIn }) {
  const isGreat = Number(result.points ?? 0) >= 200;

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="min-h-0 overflow-auto">
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          isGreat
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100"
            : "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{isGreat ? "🎉 ¡Excelente resultado!" : "💡 Oportunidad de mejora"}</h2>
            <p className="text-gray-800">{result.text}</p>
          </div>
          <Stars count={stars} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <InfoTile label="Puntos del resultado" value={`+${Number(result.points ?? 0)}`} />
          <InfoTile label="Total de puntos" value={totalPoints} />
          {"guest_satisfaction" in result && <SatisfactionGauge value={result.guest_satisfaction} />}
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-2 font-semibold text-gray-900">Feedback</h3>
          <p className="text-gray-700">{result.feedback}</p>
          {result.professional_impact && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Impacto profesional:</span> {result.professional_impact}
            </p>
          )}
        </div>

        {/* Logros desbloqueados */}
        {achievements?.length > 0 && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
              <FiAward /> Logros desbloqueados
            </h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {achievements.map((a, i) => (
                <li key={i} className="rounded-lg bg-white/80 px-3 py-2 text-sm text-blue-900 ring-1 ring-blue-200">
                  <span className="font-medium">{a.title}</span> — {a.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Debriefing */}
      {(mission.debriefing?.key_learnings?.length || mission.debriefing?.reflection_questions?.length) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {mission.debriefing?.key_learnings?.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="mb-2 font-semibold text-emerald-900">Aprendizajes clave</h4>
              <ul className="list-inside list-disc text-emerald-900/90">
                {mission.debriefing.key_learnings.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          )}
          {mission.debriefing?.reflection_questions?.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h4 className="mb-2 font-semibold text-amber-900">Preguntas de reflexión</h4>
              <ul className="list-inside list-disc text-amber-900/90">
                {mission.debriefing.reflection_questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRestart}
        className="mt-6 w-full rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-md"
      >
        <div className="flex items-center justify-center gap-2">
          <FiRotateCw /> Jugar de nuevo
        </div>
      </motion.button>
    </motion.div>
  );
}


function Stars({ count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: i < count ? 1 : 0.95, opacity: i < count ? 1 : 0.4 }}
          transition={{ delay: i * 0.05 }}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
            i < count ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
          title={`${count} / 5`}
        >
          <FiStar />
        </motion.span>
      ))}
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function SatisfactionGauge({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-4">
      <div className="mb-1 text-sm text-emerald-700">Satisfacción del cliente</div>
      <div className="h-2 w-full rounded-full bg-emerald-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className="h-full rounded-full bg-emerald-500"
        />
      </div>
      <div className="mt-1 text-right text-sm font-semibold text-emerald-700">{pct}%</div>
    </div>
  );
}
