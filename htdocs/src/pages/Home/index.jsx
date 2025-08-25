import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LevelButton from "./LevelButton";

import misionLlevarMesa from "../../assets/missions/bring-table.json";
import nobringtable from "../../assets/missions/notablebring.json";
import mission2 from "../../assets/missions/mission2.json";

export default function Home() {
  // Lista de misiones (orden).
  const missions = [misionLlevarMesa, mission2, nobringtable];

  // Estados por misión: "locked" | "unlocked" | "completed"
  const [missionStates, setMissionStates] = useState(() => {
    // La primera misión empieza desbloqueada
    return missions.map((_, i) => (i === 0 ? "unlocked" : "locked"));
  });

  // Centros (x,y) de cada botón respecto al contenedor medido
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Para animar SOLO el segmento recién desbloqueado
  const [lastAnimatedSeg, setLastAnimatedSeg] = useState(null);

  // Longitud de cada segmento (para animación de trazo)
  const [segLengths, setSegLengths] = useState([]);

  // Refs
  const wrapRef = useRef(null);
  const segRefs = useRef([]); // refs de <path> coloreados (uno por segmento)

  // ============================
  // MEDICIÓN ROBUSTA DE POSICIONES
  // ============================
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const containerRect = wrap.getBoundingClientRect();
      const btns = wrap.querySelectorAll(".mission-btn");
      const pts = Array.from(btns).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: (r.left - containerRect.left) + r.width / 2 + wrap.scrollLeft,
          y: (r.top - containerRect.top) + r.height / 2 + wrap.scrollTop,
        };
      });
      setPoints(pts);
      // Alto del grid (contenido real)
      setSize({ w: wrap.clientWidth, h: wrap.clientHeight });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    wrap.querySelectorAll(".mission-btn").forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure, { passive: true });

    // asegurar medición tras primer layout
    requestAnimationFrame(measure);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [missions.length]);

  // ============================
  // PATH CON VARIACIÓN ORGÁNICA (por segmento)
  // ============================
  const seededRand = (seed) => {
    // ruido determinista en [0,1)
    const x = Math.sin(seed * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const getSegmentPath = (p1, p2, i) => {
    if (!p1 || !p2) return "";
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;

    // normal unitario
    const nx = -dy / len;
    const ny = dx / len;

    // puntos a 1/3 y 2/3 del segmento
    const t1 = 1 / 3;
    const t2 = 2 / 3;

    const r1 = seededRand(i + 0.123) * 2 - 1; // [-1,1]
    const r2 = seededRand(i + 0.789) * 2 - 1;

    // amplitud de curvatura (limitada)
    const amp = Math.min(40, len / 3) * 0.45;

    // control points (cúbica)
    const c1 = {
      x: p1.x + dx * t1 + nx * amp * r1,
      y: p1.y + dy * t1 + ny * amp * r1,
    };
    const c2 = {
      x: p1.x + dx * t2 - nx * amp * r2 * 0.8,
      y: p1.y + dy * t2 - ny * amp * r2 * 0.8,
    };

    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  };

  // ============================
  // MANEJO DE COMPLETAR MISIÓN (cadena de animaciones)
  // ============================
  const handleMissionComplete = (index) => {
    // 1) Marcar completada la actual
    // 2) Desbloquear la siguiente (si existe)
    // 3) Marcar el segmento i para animar el "pintado"
    setMissionStates((prev) => {
      const next = [...prev];
      next[index] = "completed";
      if (index + 1 < next.length) {
        // sólo cambiar a "unlocked" si estaba locked
        if (next[index + 1] === "locked") next[index + 1] = "unlocked";
        // Dispara animación de segmento i -> i+1
        setLastAnimatedSeg(index);
      }
      return next;
    });
  };

  // Limpiar la marca del último segmento animado tras ~1s
  useEffect(() => {
    if (lastAnimatedSeg === null) return;
    const t = setTimeout(() => setLastAnimatedSeg(null), 1100);
    return () => clearTimeout(t);
  }, [lastAnimatedSeg]);

  // Medir longitudes de segmentos (para animación con stroke-dasharray)
  useLayoutEffect(() => {
    // Esperar a que estén en el DOM
    requestAnimationFrame(() => {
      const lens = segRefs.current.map((el) => {
        if (el && typeof el.getTotalLength === "function") {
          try {
            return Math.max(1, el.getTotalLength());
          } catch {
            return 1;
          }
        }
        return 1;
      });
      setSegLengths(lens);
    });
  }, [points, missionStates]);

  // Posicionamiento de botones (alternando columnas)
  const alignClass = (i) => {
    const map = [
      "justify-self-start",
      "justify-self-center",
      "justify-self-end",
      "justify-self-center",
    ];
    return map[i % map.length];
  };

  return (
    <div className="theme-bg min-h-screen flex">
      <div className="relative flex-1 max-w-[900px] p-8">
        {/* SVG del path bajo los botones */}
        <svg
          className="absolute inset-0 pointer-events-none z-0"
          width={size.w}
          height={size.h}
        >
          {/* Render de todos los segmentos */}
          {points.map((_, i) => {
            if (i >= points.length - 1) return null;

            const d = getSegmentPath(points[i], points[i + 1], i);

            // Segmento en color si:
            // - la misión i está "completed"
            // - y la i+1 está al menos "unlocked"
            const colored =
              missionStates[i] === "completed" &&
              missionStates[i + 1] !== "locked";

            const animateThis = lastAnimatedSeg === i && colored;

            // Base gris (siempre dibujada para continuidad visual)
            return (
              <g key={`seg-${i}`}>
                <path
                  d={d}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-slate-400/60"
                />
                {colored && (
                  <path
                    ref={(el) => (segRefs.current[i] = el)}
                    d={d}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    className={
                      "text-amber-500 " + (animateThis ? "seg-draw" : "")
                    }
                    style={
                      animateThis
                        ? { "--seg-len": segLengths[i] || 1 }
                        : undefined
                    }
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* GRID de botones */}
        <div
          ref={wrapRef}
          className="relative grid grid-cols-3 gap-y-16 z-10"
        >
          {missions.map((mission, index) => (
            <div
              key={index}
              className={`mission-btn col-span-3 ${alignClass(index)}`}
            >
              <LevelButton
                index={index}
                missionJSON={mission}
                state={missionStates[index]}
                onComplete={() => handleMissionComplete(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar de ejemplo */}
      <div className="flex flex-col gap-4 min-h-full w-[340px] p-4 **:theme-box-bg">
        <div className="border theme-border theme-text rounded-lg p-4">
          Progreso:{" "}
          <b>
            {
              missionStates.filter((s) => s === "completed").length
            }{" "}
            / {missions.length}
          </b>
        </div>
        <div className="border theme-border theme-text rounded-lg p-4">
          Estado: {missionStates.join(" → ")}
        </div>
      </div>

      {/* Estilos auxiliares específicos (globales) */}
      <style>{`
        /* Dibujo del segmento recién activado */
        .seg-draw {
          stroke-dasharray: var(--seg-len, 1);
          stroke-dashoffset: var(--seg-len, 1);
          animation: draw-line 0.95s cubic-bezier(.2,.7,.2,1) forwards;
          filter: drop-shadow(0 0 6px rgba(245, 158, 11, .35));
        }
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
