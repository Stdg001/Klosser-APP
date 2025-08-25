import { useEffect, useRef, useState } from "react";
import Lesson from "../../components/Lesson";
import { FaLock, FaTimes } from "react-icons/fa";

export default function LevelButton({ missionJSON, index, state, onComplete }) {
  const [open, setOpen] = useState(false);

  // Animaciones locales:
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const prevState = useRef(state);

  // Detectar transición "locked" -> "unlocked" para animar desbloqueo
  useEffect(() => {
    if (prevState.current === "locked" && state === "unlocked") {
      setJustUnlocked(true);
      const t = setTimeout(() => setJustUnlocked(false), 900);
      return () => clearTimeout(t);
    }
    prevState.current = state;
  }, [state]);

  // Ejecuta animación de completar y luego notifica al padre
  const playCompleteChain = () => {
    // 1) Brillo y "bump" en el botón
    setJustCompleted(true);
    // 2) Tras ~800ms notificamos al padre para desbloquear la siguiente
    setTimeout(() => {
      onComplete?.(index);
      // el estado global pasará a "completed"
      // Mantenemos la aureola un poco más y la quitamos luego
      setTimeout(() => setJustCompleted(false), 600);
    }, 800);
  };

  const isLocked = state === "locked";
  const isUnlocked = state === "unlocked";
  const isCompleted = state === "completed";

  // Paletas por estado
  const faceClass =
    isLocked
      ? "bg-gray-400 text-gray-800"
      : isCompleted
      ? "bg-green-500 text-green-950"
      : "bg-amber-500 text-amber-950";

  const sideClass =
    isLocked
      ? "bg-gray-500"
      : isCompleted
      ? "bg-green-700"
      : "bg-amber-700";

  return (
    <div className="relative inline-block">
      {/* Envolvente para efectos */}
      <div
        id={`mission-${missionJSON?.id ?? index}`}
        className={`relative inline-block w-20 h-20 select-none ${
          justCompleted ? "btn-bump" : ""
        }`}
      >
        {/* Borde lateral (óvalo inferior) */}
        <div
          className={`
            absolute inset-0
            rounded-full scale-x-110
            ${sideClass}
            transition-transform duration-150
          `}
        />

        {/* Cara del botón (óvalo superior) */}
        <button
          disabled={isLocked}
          onClick={() => setOpen(true)}
          className={`
            absolute inset-x-0 top-0 mx-auto w-full h-full
            rounded-full scale-x-110 font-bold text-3xl
            transition-all duration-150
            translate-y-[-0.5rem]
            ${faceClass}
            ${isLocked ? "cursor-not-allowed" : ""}
            ${!isLocked ? " hover:translate-y-[-0.3rem] active:translate-y-0" : ""}
            flex items-center justify-center
          `}
        >
          {isLocked ? <FaLock/> : index + 1}
        </button>

        {/* Efecto de desbloqueo (pulse anillo) */}
        {justUnlocked && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full unlock-pulse"
            aria-hidden
          />
        )}

        {/* Efecto de brillo al completar */}
        {justCompleted && (
          <span
            className="pointer-events-none absolute -inset-3 rounded-full complete-shine"
            aria-hidden
          >
            {/* algunas chispas */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full opacity-70"
            >
              <g className="sparkles">
                <path d="M50 15 L54 34 L73 37 L54 40 L50 59 L46 40 L27 37 L46 34 Z" />
                <circle cx="20" cy="60" r="2" />
                <circle cx="80" cy="42" r="2.5" />
                <circle cx="60" cy="80" r="1.8" />
              </g>
            </svg>
          </span>
        )}
      </div>

      {/* Modal con la lección */}
      {open && (
        <div className="fixed inset-0 min-w-screen min-h-screen theme-bg z-50">
            <Lesson leccionJSON={missionJSON} />
        </div>
        )
      }

      {/* //       <div className="pt-6 flex gap-3">
      //         {!isCompleted && (
      //           <button
      //             className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold shadow hover:shadow-md active:scale-[.99] transition"
      //             onClick={() => {
      //               setOpen(false);
      //               playCompleteChain();
      //             }}
      //           >
      //             Completar misión
      //           </button>
      //         )}
      //         <button
      //           className="px-4 py-2 rounded-xl border theme-border theme-text hover:bg-white/5 transition"
      //           onClick={() => setOpen(false)}
      //         >
      //           Cerrar
      //         </button>
      //       </div>
      //     </div>
      // )} */}

      {/* Estilos auxiliares del botón */}
      <style>{`
        /* Pequeño "bump" al completar */
        .btn-bump {
          animation: btn-bump-key 0.35s ease;
        }
        @keyframes btn-bump-key {
          0% { transform: translateY(-2px) scale(1); }
          40% { transform: translateY(-4px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Pulso de desbloqueo */
        .unlock-pulse {
          box-shadow: 0 0 0 0 rgba(245, 158, 11, .45);
          animation: unlock-pulse-key .9s ease-out forwards;
          border: 2px solid rgba(245, 158, 11, .55);
        }
        @keyframes unlock-pulse-key {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.25); opacity: .45; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        /* Destello de completado */
        .complete-shine {
          background: radial-gradient(ellipse at center, rgba(255,255,200,.55), rgba(255,255,200,0) 60%);
          animation: shine-fade 1.1s ease forwards;
          mix-blend-mode: screen;
        }
        @keyframes shine-fade {
          0% { opacity: .95; transform: scale(.8) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.4) rotate(15deg); }
        }
        .sparkles path, .sparkles circle {
          fill: rgba(255, 255, 120, .9);
          animation: spark-rotate 1.1s ease forwards;
          transform-origin: 50% 50%;
        }
        @keyframes spark-rotate {
          0% { transform: rotate(0deg) scale(0.8); opacity: .9; }
          100% { transform: rotate(25deg) scale(1.05); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
