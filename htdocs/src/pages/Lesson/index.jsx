import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiStar,
  FiClock,
  FiUsers,
  FiHelpCircle,
} from "react-icons/fi";

// Examples
const MissionsPromts = [
  'Vienen 2 clientes para pedir una mesa en una noche cerca de la hora de cierre',
  {id: 1}
];

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
export default function Lesson() {

  const [missionPromt, setMissionPromt] = useState('');
  const [storyData, setStoryData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentScene, setCurrentScene] = useState('scene_0');
  const [selectedPath, setSelectedPath] = useState([]);

  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [allScenes, setAllScenes] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('missionID');
  
    setMissionPromt( MissionsPromts[ parseInt(pageParam || null) ] );
  }, []);

  const generateCompleteStory = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const completePrompt = `Eres un experto en crear historias interactivas de entrenamiento para restaurantes. 
      Crea un árbol completo de decisiones con todas las posibles ramas para la siguiente situación inicial:
      ${missionPromt}

      REQUISITOS:
      1. Crea un árbol con 4-5 niveles de profundidad (hasta escenas como scene_1ABCA)
      2. Incluye al menos 20-25 escenas diferentes con sus respectivos finales
      3. Algunas decisiones deben llevar a finales tempranos (malas decisiones)
      4. Cada escena debe tener: situation, options (A, B, C), correctOption, y isEnding si es un final
      5. Las situaciones deben ser realistas y relevantes para el contexto de restaurantes
      6. Las opciones deben representar buenas, regulares y malas prácticas de servicio al cliente
      
      Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura:
      {
        "scene_0": {
          "situation": "Descripción detallada de la situación inicial...",
          "options": {
            "A": "Texto de la opción A",
            "B": "Texto de la opción B", 
            "C": "Texto de la opción C"
          },
          "correctOption": "B"
        },
        "scene_A": {
          "situation": "Descripción de lo que sucede al elegir A...",
          "options": {
            "A": "Texto opción A",
            "B": "Texto opción B", 
            "C": "Texto opción C"
          },
          "correctOption": "A"
        },
        "scene_B": {
          "situation": "Descripción de lo que sucede al elegir B...",
          "options": {
            "A": "Texto opción A",
            "B": "Texto opción B", 
            "C": "Texto opción C"
          },
          "correctOption": "C"
        },
        "scene_C": {
          "situation": "Descripción de lo que sucede al elegir C...",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_AA": {
          "situation": "Descripción...",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "good"
        }
        // ... continúa con todas las escenas necesarias
      }`

      // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": "Bearer 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",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     "model": "deepseek/deepseek-chat-v3.1:free", // o "deepseek/deepseek-chat-v3" si la otra no funciona
      //     "messages": [{ "role": "user", "content": completePrompt }],
      //     "temperature": 0.8,
      //     "max_tokens": 4000
      //   })
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Error en la petición: ${response.status}`);
      // }
      
      // const data = await response.json()
      
      // // Verificamos que tengamos una respuesta válida
      // if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      //   throw new Error("Formato de respuesta inesperado de la API");
      // }
      
      // // Extraemos el JSON de la respuesta
      // let jsonString = data.choices[0].message.content;
      
      // // Limpiamos la respuesta para obtener solo el JSON
      // const jsonMatch = jsonString.match(/(\{[\s\S]*\})/);
      // if (jsonMatch) {
      //   jsonString = jsonMatch[1];
      // }
      
      // // Parseamos el JSON
      // const content = JSON.parse(jsonString);
      
      const content = {
        "scene_0": {
          "situation": "Son las 10:45 PM y el restaurante cierra a las 11:00 PM. Llegan dos clientes buscando una mesa. El restaurante está casi vacío pero la cocina está comenzando a cerrar. Eres el host/recepcionista y debes decidir cómo manejar la situación.",
          "options": {
            "A": "Decirles que el restaurante está cerrado y negarles la entrada",
            "B": "Aceptar sentarlos pero advertirles que la cocina cierra en 15 minutos",
            "C": "Sentarlos sin mencionar el horario de cierre para no desanimarlos"
          },
          "correctOption": "B"
        },
        "scene_0A": {
          "situation": "Les dices amablemente que lamentablemente ya han cerrado. Los clientes se ven decepcionados y argumentan que solo querían algo rápido. Uno de ellos mira su reloj y menciona que técnicamente aún no son las 11:00 PM.",
          "options": {
            "A": "Mantenerse firme en la negativa aunque se quejen",
            "B": "Ofrecerles algo para llevar en lugar de mesa",
            "C": "Ceder y permitirles entrar con resignación"
          },
          "correctOption": "B"
        },
        "scene_0B": {
          "situation": "Aceptas sentarlos con la advertencia sobre el cierre de cocina. Los clientes lo agradecen y se sientan rápidamente. El mesero asignado viene a tu puesto con una mirada preocupada porque ya había comenzado a limpiar su estación.",
          "options": {
            "A": "Decirle al mesero que es su responsabilidad atenderlos sin quejas",
            "B": "Ofrecer ayuda al mesero para agilizar el servicio",
            "C": "Ofrecer a los clientes un menú limitado de platillos rápidos"
          },
          "correctOption": "C"
        },
        "scene_0C": {
          "situation": "Decides no mencionar el horario y sentarlos normalmente. Los clientes se toman su tiempo para revisar el menú detenidamente. A las 10:55 PM todavía no han decidido y el chef está visiblemente molesto en la cocina.",
          "options": {
            "A": "Acercarse a presionarlos amablemente para que decidan",
            "B": "Dejar que tomen su tiempo aunque signifique retrasar el cierre",
            "C": "Enviar al mesero con especiales del día para acelerar la decisión"
          },
          "correctOption": "A"
        },
        "scene_0AA": {
          "situation": "Te mantienes firme y niegas el servicio. Los clientes se van enojados, dejando una mala reseña en línea sobre la mala actitud del restaurante. El gerente se entera al día siguiente.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_0AB": {
          "situation": "Les ofreces opciones para llevar. Los clientes aceptan de mala gana y piden dos platillos. La cocina los prepara rápidamente pero los clientes se van comentando que hubieran preferido la experiencia completa.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_0AC": {
          "situation": "Cedes y los sientas. El personal te mira con resentimiento por haber cedido después de haber dicho que no. Los clientes notan la mala actitud del staff y su experiencia se ve afectada.",
          "options": {
            "A": "Hablar con el equipo para explicar la situación y mejorar el ambiente",
            "B": "Ignorar la tensión y esperar que todo mejore",
            "C": "Ofrecer algo de cortesía para compensar el mal ambiente"
          },
          "correctOption": "A"
        },
        "scene_0BA": {
          "situation": "Regañas al mesero frente a los clientes. El mesero atiende a regañadientes, con mala actitud. Los clientes reciben un servicio deficiente y deciden no volver.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_0BB": {
          "situation": "Ayudas al mesero llevando bebidas y pan mientras toma la orden. Los clientes notan el esfuerzo team y se sienten atendidos. Piden rápidamente dos platos principales.",
          "options": {
            "A": "Sugerir postres y café para aumentar la venta",
            "B": "Agradecer su rapidez y procesar el pago tan pronto terminen",
            "C": "Preguntar si prefieren la cuenta junto con el plato principal"
          },
          "correctOption": "C"
        },
        "scene_0BC": {
          "situation": "Ofreces un menú limitado con platillos de preparación rápida. Los clientes aceptan amablemente y eligen dos pasta. La cocina puede prepararlo rápidamente sin afectar mucho el proceso de cierre.",
          "options": {
            "A": "Ofrecer una copa de vino cortesía de la casa",
            "B": "Asegurarse que su servicio sea impecable pero sin extenderse",
            "C": "Apresurarlos visiblemente para que terminen rápido"
          },
          "correctOption": "B"
        },
        "scene_0CA": {
          "situation": "Te acercas amablemente y les explicas que la cocina está por cerrar. Ellos se disculpan y piden dos platos del menú rápidamente. El chef acepta prepararlos aunque no está contento.",
          "options": {
            "A": "Cobrarles todo inmediatamente para evitar demoras en el cierre",
            "B": "Ofrecer un descuento por la inconveniencia",
            "C": "Agradecer su comprensión y asegurar una buena experiencia"
          },
          "correctOption": "C"
        },
        "scene_0CB": {
          "situation": "Decides no presionarlos y dejas que tomen su tiempo. A las 11:20 PM finalmente piden. El chef se niega a cocinar y el personal está visiblemente molesto. Los clientes se sienten incómodos.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_0CC": {
          "situation": "El mesero les sugiere los especiales que son más rápidos de preparar. Los clientes aceptan encantados y piden inmediatamente. La cocina puede preparar los platillos sin retrasar demasiado el cierre.",
          "options": {
            "A": "Preguntar si quieren postre junto con la comida",
            "B": "Preparar la cuenta anticipadamente para una salida rápida",
            "C": "Ofrecer un after dinner cortesía por la espera"
          },
          "correctOption": "B"
        },
        "scene_0ACA": {
          "situation": "Reúnes al equipo brevemente y explicas que estos clientes pueden generar negocio futuro si los atendemos bien. El equipo entiende y mejora su actitud. Los clientes reciben buen servicio.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_0ACB": {
          "situation": "Ignoras la tensión esperando que mejore, pero el mesero sirve con visible mal humor. Los clientes comen incómodos y se van sin dejar propina.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_0ACC": {
          "situation": "Ofreces una botella de vino cortesía. Los clientes se animan y el personal al ver el gesto mejora su actitud. La experiencia se recupera notablemente.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_0BBA": {
          "situation": "Sugieres postres y café. Los clientes aceptan encantados pero esto extiende su estadía 25 minutos más. El personal debe esperar para cerrar.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_0BBB": {
          "situation": "Les traes la cuenta rápidamente y procesas el pago eficientemente. Los clientes agradecen no sentirse apresurados pero notan que quieren que se vayan. Se van satisfechos pero no encantados.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_0BBC": {
          "situation": "Preguntas si desean la cuenta con la comida. Ellos aceptan y pagan inmediatamente al terminar. Salen a tiempo y el personal puede cerrar puntualmente. Todos contentos.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_0BCC": {
          "situation": "Los apresuras visiblemente. Los clientes se sienten incómodos y comen rápidamente. Pagan y se van sin despedirse, dejando una propina mínima.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_0BCB": {
          "situation": "Les brindas un servicio eficiente y amable sin excederte. Terminan su comida a tiempo, pagan contentos y agradecen el trato. El personal cierra a tiempo.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_0CCA": {
          "situation": "Ofreces postre junto con la comida pero los clientes se sienten apresurados en su decisión. Piden postre de todos modos pero la experiencia no es óptima.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_0CCB": {
          "situation": "Preparas la cuenta anticipadamente. Cuando terminan, procesas el pago inmediatamente. Salen puntualmente y agradecen la eficiencia. El equipo cierra a tiempo.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_0CCC": {
          "situation": "Ofreces un after dinner cortesía. Los clientes encantados se quedan 15 minutos extra disfrutándolo pero el personal debe esperar para completar el cierre.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_0CAA": {
          "situation": "Cobras todo inmediatamente. Los clientes se sienten apresurados y tratados como una inconveniencia. Comen rápido y se van decepcionados.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_0CAB": {
          "situation": "Ofreces 15% de descuento. Los clientes se sienten compensados y comprenden la situación. Disfrutan su comida y prometen volver en horario normal.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_0CAC": {
          "situation": "Les brindas un servicio excepcional a pesar de la hora. Los clientes quedan encantados con la atención, dejan una generosa propina y se convierten en clientes frecuentes.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "good"
        }
      }

      setAllScenes(content);
      setStoryData(content["scene_0"]);
      
    } catch (err) {
      setError('Error al generar la historia. Intenta nuevamente.')
      console.error('Error details:', err)

    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionSelect = (option) => {
    const nextSceneId = `${currentScene}${option}`;
    
    // Verificar si existe la siguiente escena
    if (allScenes[nextSceneId]) {
      // Actualizar puntaje si la opción es correcta
      if (allScenes[currentScene].correctOption === option) {
        setScore(prev => prev + 1);
      }
      
      setStoryData(allScenes[nextSceneId]);
      setCurrentScene(nextSceneId);
      setSelectedPath(prev => [...prev, { 
        scene: currentScene, 
        option,
        correct: allScenes[currentScene].correctOption === option
      }]);
      
      // Si es un final, mostrar resumen
      if (allScenes[nextSceneId].isEnding) {
        setShowSummary(true);
      }

    } else {
      // Si no hay más escenas, mostrar resumen
      setShowSummary(true);
    }
  }

  const generateSummary = () => {
    // Calcular puntuación basada en decisiones correctas
    const totalDecisions = selectedPath.length;
    const correctDecisions = selectedPath.filter(step => step.correct).length;
    const finalScore = totalDecisions > 0 
      ? Math.round((correctDecisions / totalDecisions) * 5) 
      : 0;
    
    setScore(finalScore);
    
    // Determinar el tipo de final
    let endingType = "neutral";
    if (storyData.endingType) {
      endingType = storyData.endingType;
    } else if (finalScore >= 4) {
      endingType = "good";
    } else if (finalScore <= 2) {
      endingType = "bad";
    }
    
    // Generar resumen basado en el camino seleccionado
    const summary = {
      summary: "",
      correctActions: "",
      incorrectActions: "",
      feedback: ""
    };
    
    // Personalizar resumen según el tipo de final
    if (endingType === "good") {
      summary.summary = "¡Excelente trabajo! Has manejado la situación de manera excepcional. ";
      summary.feedback = "Demostraste habilidades sobresalientes de servicio al cliente y resolución de problemas. ";
    } else if (endingType === "bad") {
      summary.summary = "La experiencia terminó de manera no ideal. ";
      summary.feedback = "Hay varias áreas de oportunidad para mejorar tu servicio al cliente. ";
    } else {
      summary.summary = "Has completado la experiencia con un desempeño aceptable. ";
      summary.feedback = "Con un poco más de práctica podrías mejorar significativamente. ";
    }
    
    // Analizar el camino tomado
    selectedPath.forEach((step, index) => {
      const scene = allScenes[step.scene];
      
      summary.summary += `En la situación ${index + 1}, ${scene.situation.split('.')[0]}. `;
      
      if (step.correct) {
        summary.correctActions += `Opción ${step.option}: ${scene.options[step.option]}. `;
      } else {
        summary.incorrectActions += `En lugar de "${step.option}: ${scene.options[step.option]}", la mejor opción era ${scene.correctOption}: ${scene.options[scene.correctOption]}. `;
      }
    });
    
    // Añadir consejos finales según el puntaje
    if (finalScore >= 4) {
      summary.feedback += "Sigue practicando para mantener este alto nivel de servicio.";
    } else if (finalScore >= 3) {
      summary.feedback += "Revisa las decisiones incorrectas para identificar áreas de mejora.";
    } else {
      summary.feedback += "Te recomendamos repasar los fundamentos de servicio al cliente.";
    }
    
    // Añadir el resumen al storyData
    setStoryData(prev => ({ ...prev, summary }));
  }

  const restartStory = () => {
    setStoryData(allScenes["scene_0"]);
    setCurrentScene("scene_0");
    setSelectedPath([]);
    setShowSummary(false);
    setScore(0);
  }

  // Efecto para generar todas las escenas al cargar el componente
  useEffect(() => {
    generateCompleteStory();
  }, []);

  // Efecto para generar el resumen cuando se completa la historia
  useEffect(() => {
    if (showSummary) {
      generateSummary();
    }
  }, [showSummary]);

  return  (
    <div className="min-h-screen theme-bg theme-text">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">Entrenamiento de Restaurante</h1>
        <p className="text-xl opacity-90">Desarrolla tus habilidades de servicio al cliente</p>
      </header>
      
      <main className="max-w-2xl mx-auto theme-box-bg rounded-xl shadow-2xl p-6 text-gray-800">
        {isLoading && !storyData ? (
          <div className="flex justify-center items-center min-h-[300px] flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-700">Generando experiencia de entrenamiento...</p>
            <p className="text-gray-500 text-sm mt-2">Esto puede tomar unos segundos</p>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={generateCompleteStory}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
            >
              Reintentar
            </button>
          </div>
        ) : showSummary && storyData?.summary ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                {score >= 4 ? "¡Excelente!" : score >= 3 ? "Buen trabajo" : "Fin de la experiencia"}
              </h2>
              
              {/* Mostrar puntuación con estrellas */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-10 h-10 mx-1 ${i < score ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-lg text-gray-700">Puntuación: {score} de 5 estrellas</p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedPath.length} decisiones tomadas • {
                  selectedPath.filter(step => step.correct).length
                } correctas
              </p>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Resumen</h3>
              <p className="text-gray-700">{storyData.summary.summary}</p>
            </div>
            
            {storyData.summary.correctActions && (
              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-green-700 mb-3">Decisiones Correctas</h3>
                <p className="text-gray-700">{storyData.summary.correctActions}</p>
              </div>
            )}
            
            {storyData.summary.incorrectActions && (
              <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                <h3 className="text-xl font-semibold text-red-700 mb-3">Decisiones a Mejorar</h3>
                <p className="text-gray-700">{storyData.summary.incorrectActions}</p>
              </div>
            )}
            
            <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold text-yellow-700 mb-3">Retroalimentación</h3>
              <p className="text-gray-700">{storyData.summary.feedback}</p>
            </div>
            
            <button 
              onClick={restartStory}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {score >= 4 ? "Intentar otra vez" : "Reintentar experiencia"}
            </button>
          </div>
        ) : storyData ? (
          <div className="space-y-6">
            <div className="p-5 rounded-lg border-l-4 border-l-purple-600 theme-border">
              <h2 className="text-2xl font-semibold text-purple-700 mb-3">Situación Actual</h2>
              <p className="text-lg leading-relaxed theme-text">{storyData.situation}</p>
            </div>
            
            {storyData.options && Object.keys(storyData.options).length > 0 ? (
              <div className="options">
                <h3 className="text-xl font-medium mb-4 theme-text">¿Qué decides hacer?</h3>
                <div className="space-y-3">
                  {Object.entries(storyData.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleOptionSelect(key)}
                      className="w-full text-left p-4 theme-bg rounded-lg dark:hover:bg-gray-700 transition-all duration-200 flex items-center cursor-pointer"
                    >
                      <span className="bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {key}
                      </span>
                      <span className="theme-text">{value}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Fin de la historia.</p>
              </div>
            )}
            
            {/* Barra de progreso */}
            <div className="">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium theme-text">Progreso</span>
                <span className="text-sm font-medium theme-text">
                  {selectedPath.length} decisiones tomadas
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(selectedPath.filter(step => step.correct).length / Math.max(1, selectedPath.length)) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedPath.filter(step => step.correct).length} de {selectedPath.length} decisiones correctas
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="text-center py-6 text-white/70 text-sm">
        <p>Simulador de entrenamiento para restaurantes • Generado con DeepSeek AI</p>
      </footer>
    </div>
  )
}