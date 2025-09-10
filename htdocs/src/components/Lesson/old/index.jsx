import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiClock,
  FiUsers,
  FiHelpCircle,
} from "react-icons/fi";
import ResultScreen from "./ResultScreen";
import SceneStage from "./SceneStage";
import StartScreen from "./StartScreen";

/**
 * MissionEnhanced (ES)
 *
 * ✔ Acepta JSON con raíz directa o envuelta en { mission }
 * ✔ La XP de las opciones se revela SOLO después del click
 *   - Se muestran las XP de TODAS las opciones
 *   - Se destaca la mejor (👑 Recomendado)
 *   - Botón "Siguiente" para avanzar (no auto-avanza)
 * ✔ Siempre visibles: "tone" y "skill"
 * ✔ Sin "procesando..." ni cargas ficticias
 * ✔ Layout a pantalla completa: evita scroll vertical en desktop; si no cabe, hace scroll el área central
 * ✔ UI en español
 */
export default function MissionEnhanced({ leccionJSON }) {
  // Normalización del JSON (acepta { mission } o raíz directa)
  const mission = useMemo(() => leccionJSON?.mission ?? leccionJSON ?? {}, [leccionJSON]);

  // Soporte claves ES/EN
  const scenes = mission.scenes ?? mission.escenas ?? [];
  const results = mission.results ?? mission.resultados ?? [];
  const achievementsCfg = mission.achievements ?? mission.logros ?? [];

  // Mapas de acceso rápido
  const scenesById = useMemo(() => {
    const m = new Map();
    scenes.forEach((s) => m.set(s.id, s));
    return m;
  }, [scenes]);
  const resultsById = useMemo(() => {
    const m = new Map();
    results.forEach((r) => m.set(r.id, r));
    return m;
  }, [results]);

  // ====== Estado ======
  const [started, setStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState(scenes[0] || null);
  const [history, setHistory] = useState([]); // {sceneId, optionIndex, optionPoints}
  const [points, setPoints] = useState(0);
  const [result, setResult] = useState(null);

  // Selección y revelado de XP
  const [selectedIndex, setSelectedIndex] = useState(null); // índice de opción seleccionada
  const [reveal, setReveal] = useState(false); // cuando true, muestra XP de todas las opciones y ranking
  const [pendingNextId, setPendingNextId] = useState(null); // próximo id a visitar al pulsar "Siguiente"
  const [pendingAward, setPendingAward] = useState(0); // XP a sumar al pulsar "Siguiente"

  // Logros desbloqueados al finalizar
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Animaciones reusables
  const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  };

  // Reset
  const reset = useCallback(() => {
    setStarted(false);
    setCurrentScene(scenes[0] || null);
    setHistory([]);
    setPoints(0);
    setResult(null);
    setSelectedIndex(null);
    setReveal(false);
    setPendingNextId(null);
    setPendingAward(0);
    setUnlockedAchievements([]);
  }, [scenes]);

  // Progreso aproximado
  const progressPct = useMemo(() => {
    const total = (scenes.length || 1) + 1; // +1 por resultado
    const done = history.length + (result ? 1 : 0);
    return Math.min(100, Math.round((done / total) * 100));
  }, [scenes.length, history.length, result]);

  // Color de dificultad
  const difficultyPill = useMemo(() => {
    const d = (mission.difficulty || mission.dificultad || "").toLowerCase();
    if (d.includes("beginner") || d.includes("fácil") || d.includes("facil")) return "bg-emerald-100 text-emerald-700";
    if (d.includes("inter") || d.includes("medio")) return "bg-amber-100 text-amber-700";
    if (d.includes("advanced") || d.includes("avanz")) return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-700";
  }, [mission.difficulty, mission.dificultad]);

  // Parseo de rating_scale → rangos por estrellas
  const ratingRanges = useMemo(() => {
    const scale = mission.scoring?.rating_scale || {};
    const toRange = (str) => {
      if (!str) return [0, Infinity];
      const s = (str + "").toLowerCase().replace(/\s/g, "");
      if (s.includes("+")) {
        const min = parseInt(s, 10);
        return [isNaN(min) ? 0 : min, Infinity];
      }
      const m = s.match(/(\d+)-(\d+)/);
      if (m) return [parseInt(m[1], 10), parseInt(m[2], 10)];
      return [0, Infinity];
    };
    return {
      1: toRange(scale["1_star"] || scale["1_stars"]),
      2: toRange(scale["2_stars"]),
      3: toRange(scale["3_stars"]),
      4: toRange(scale["4_stars"]),
      5: toRange(scale["5_stars"]),
    };
  }, [mission.scoring]);

  const getStarsFromPoints = (total) => {
    for (let s = 5; s >= 1; s--) {
      const [min, max] = ratingRanges[s] || [0, Infinity];
      if (total >= min && (total <= max || max === Infinity)) return s;
    }
    return 1;
  };

  // Evaluación de logros por condición
  const evaluateAchievements = useCallback((totalPoints, pathHistory) => {
    const unlocked = [];
    (achievementsCfg || []).forEach((a) => {
      const cond = (a.condition || "").trim();
      if (!cond) return;

      const mTotal = cond.match(/^total_points\s*>=\s*(\d+)$/i);
      if (mTotal) {
        const target = parseInt(mTotal[1], 10) || 0;
        if (totalPoints >= target) unlocked.push(a);
        return;
      }
      const mPick = cond.match(/^([\w\-]+)\.options\[(\d+)\]\.selected$/);
      if (mPick) {
        const sceneId = mPick[1];
        const idx = parseInt(mPick[2], 10) || 0;
        const hit = pathHistory.some((h) => h.sceneId === sceneId && h.optionIndex === idx);
        if (hit) unlocked.push(a);
      }
    });
    // Únicos por título
    const seen = new Set();
    return unlocked.filter((a) => (a?.title && !seen.has(a.title) && seen.add(a.title)) || (!a?.title));
  }, [achievementsCfg]);

  // ====== Interacción ======
  const handlePick = (opt, index) => {
    if (!currentScene || reveal) return; // solo una selección por escena
    setSelectedIndex(index);
    setReveal(true);
    const optPoints = Number(opt.points ?? opt.puntos ?? 0);
    setPendingAward(optPoints);
    const nextId = opt.next_scene ?? opt.proximaEscena ?? null;
    setPendingNextId(nextId);
  };

  const handleNext = () => {
    if (selectedIndex == null || !currentScene) return;

    // Aplicar premio pendiente por la opción elegida
    let newTotal = points + (pendingAward || 0);

    const chosen = (currentScene.options || [])[selectedIndex] || {};
    const nextId = pendingNextId;

    const newHist = [
      ...history,
      {
        sceneId: currentScene.id,
        optionIndex: selectedIndex,
        optionPoints: Number(chosen.points ?? chosen.puntos ?? 0),
      },
    ];

    // Reset de selección/reveal
    setHistory(newHist);
    setPoints(newTotal);
    setSelectedIndex(null);
    setReveal(false);
    setPendingAward(0);
    setPendingNextId(null);

    if (!nextId) return; // sin siguiente → se queda en escena (raro)

    if (scenesById.has(nextId)) {
      setCurrentScene(scenesById.get(nextId));
      return;
    }

    if (resultsById.has(nextId)) {
      const res = { ...resultsById.get(nextId) };
      const resPts = Number(res.points ?? 0);
      newTotal += resPts; // sumar puntos del resultado

      // Evaluar logros y finalizar
      const unlocked = evaluateAchievements(newTotal, newHist);

      setPoints(newTotal);
      setResult({ ...res, _awarded: resPts });
      setUnlockedAchievements(unlocked);
      return;
    }
  };

  // Soporte tecla Enter → Siguiente (cuando está revelado)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" && reveal) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reveal]);

  // ====== UI helpers ======
  const bestPointInScene = useMemo(() => {
    if (!currentScene?.options?.length) return null;
    const pts = currentScene.options.map((o) => Number(o.points ?? o.puntos ?? 0));
    const max = Math.max(...pts);
    if (!isFinite(max)) return null;
    return { max, hasNonZero: pts.some((p) => p !== 0) };
  }, [currentScene]);

  if (!scenes.length) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center text-gray-700">
        <p>No hay escenas en esta misión. Revisa el JSON.</p>
      </div>
    );
  }

  // ====== Layout principal ======
  return (
    <div className="select-none h-full bg-gradient-to-br from-gray-50 to-white text-gray-900 rounded-2xl ring-1 lg:ring-gray-200 overflow-hidden">
      {/* Barra de progreso */}
      <div className="h-2 w-full bg-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6 }}
          className="h-full bg-amber-500"
        />
      </div>

      {/* Contenedor principal (sin scroll vertical en desktop si cabe) */}
      <div className="grid px-4 pt-3 sm:px-6 lg:pb-6">
        {/* HUD superior */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 text-sm rounded-full ${difficultyPill}`}>
              {mission.difficulty || mission.dificultad || "Dificultad"}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
              <FiClock /> {mission.duration_minutes || mission.duracion || 5} min
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
              <FiUsers /> {(mission.required_skills ?? mission.habilidades_requeridas ?? []).join(", ")}
            </span>
          </div>
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800"
            title="Puntos acumulados"
          >
            <FiStar className="text-amber-500" /> {points} pts
          </motion.span>
        </div>

        <AnimatePresence mode="wait">
          {!started ? (
            <StartScreen
              key="start"
              mission={mission}
              onStart={() => setStarted(true)}
              fadeIn={fadeIn}
            />
          ) : result ? (
            <ResultScreen
              key="result"
              result={result}
              totalPoints={points}
              stars={getStarsFromPoints(points)}
              achievements={unlockedAchievements}
              mission={mission}
              onRestart={reset}
              fadeIn={fadeIn}
            />
          ) : currentScene ? (
            <SceneStage
              key={currentScene.id}
              scene={currentScene}
              reveal={reveal}
              selectedIndex={selectedIndex}
              onPick={handlePick}
              onNext={handleNext}
              bestPointInScene={bestPointInScene}
              fadeIn={fadeIn}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}