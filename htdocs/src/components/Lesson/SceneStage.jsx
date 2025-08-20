import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  FiChevronRight,
  FiArrowRight,
  FiHelpCircle,
} from "react-icons/fi";

export default function SceneStage({ scene, reveal, selectedIndex, onPick, onNext, bestPointInScene, fadeIn }) {
  const bgStyle = useMemo(() => {
    const img = scene?.background ? `/images/${scene.background}.jpg` : "";
    if (img) {
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.12)), url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(59,130,246,0.15))" };
  }, [scene]);

  const anyPointsDefined = useMemo(() => {
    return (scene.options || []).some((o) => Number(o.points ?? o.puntos ?? 0) !== 0);
  }, [scene]);

  const maxPoints = bestPointInScene?.max ?? 0;

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" exit="exit" className="min-h-0 overflow-hidden">
      {/* Contenedor de escena (alto fijo en desktop, scroll interno si hace falta) */}
      <div className="grid h-full grid-rows-[auto,auto,1fr,auto] gap-3 overflow-hidden">
        {/* Cabecera con fondo */}
        <div className="relative h-36 w-full rounded-xl border border-gray-200" style={bgStyle}>
          <div className="absolute inset-0 rounded-xl ring-1 ring-black/5" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-base sm:text-lg font-medium text-white drop-shadow">{scene.text}</p>
          </div>
        </div>

        {/* Personajes + Pista */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(scene.characters || []).map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-white px-3 py-1 text-xs sm:text-sm text-gray-700 shadow-sm ring-1 ring-gray-200"
                title={c.description}
              >
                {c.id}
              </span>
            ))}
          </div>
          {scene.hint && <Hint text={scene.hint} />}
        </div>

        {/* Opciones (scroll interno si hay muchas) */}
        <div className="min-h-0 overflow-auto pr-1">
          <div className="space-y-3">
            {(scene.options || []).map((opt, idx) => {
              const optPoints = Number(opt.points ?? opt.puntos ?? 0);
              const isChosen = selectedIndex === idx;
              const isBest = reveal && anyPointsDefined && optPoints === maxPoints;
              const skill = opt.skill || opt.skill_check;
              return (
                <motion.button
                  key={idx}
                  whileHover={!reveal ? { x: 4 } : undefined}
                  whileTap={!reveal ? { scale: 0.98 } : undefined}
                  onClick={() => !reveal && onPick(opt, idx)}
                  className={`w-full text-left rounded-xl border px-4 py-3 shadow-sm transition ${
                    reveal
                      ? isChosen
                        ? isBest
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-amber-300 bg-amber-50"
                        : isBest
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-gray-200 bg-white"
                      : "border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full ${
                        isChosen ? "bg-amber-200 text-amber-900" : "bg-amber-100 text-amber-700"
                      } font-bold`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900">{opt.text}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {opt.tone && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5">🎭 Tono: {opt.tone}</span>
                        )}
                        {skill && (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 ring-1 ring-indigo-200">🧠 Skill: {skill}</span>
                        )}
                        {/* XP oculto hasta reveal */}
                        <span
                          className={`rounded-full px-2 py-0.5 ring-1 ${
                            reveal
                              ? optPoints >= 0
                                ? "bg-amber-50 text-amber-700 ring-amber-200"
                                : "bg-rose-50 text-rose-700 ring-rose-200"
                              : "invisible"
                          }`}
                        >
                          ⭐ {optPoints} XP
                        </span>
                        {/* Marca mejor opción */}
                        {reveal && anyPointsDefined && isBest && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 ring-1 ring-emerald-200">
                            Coronita Recomendado
                          </span>
                        )}
                      </div>
                    </div>
                    {!reveal && <FiChevronRight className="mt-1 flex-none text-gray-400" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Área de acciones */}
        <div className="flex items-center justify-end gap-3">
          {reveal && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-md"
            >
              Siguiente <FiArrowRight />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


function Hint({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline select-text"
      >
        <FiHelpCircle /> {open ? "Ocultar pista" : "Mostrar pista"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 shadow-lg"
          >
            💡 {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
