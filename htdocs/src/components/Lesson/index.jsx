import { useState, useEffect } from 'react'

function Lesson() {
  const [storyData, setStoryData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentScene, setCurrentScene] = useState('scene_1')
  const [selectedPath, setSelectedPath] = useState([])
  const [showSummary, setShowSummary] = useState(false)
  const [score, setScore] = useState(0)
  const [allScenes, setAllScenes] = useState({})

  // Función para generar TODAS las posibilidades en un solo prompt
  const generateCompleteStory = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const completePrompt = `Eres un experto en crear historias interactivas de entrenamiento para restaurantes. 
      Crea un árbol completo de decisiones con todas las posibles ramas para la siguiente situación inicial:
      "Vienen 2 clientes para pedir una mesa en una noche cerca de la hora de cierre".

      REQUISITOS:
      1. Crea un árbol con 4-5 niveles de profundidad (hasta escenas como scene_1ABCA)
      2. Incluye al menos 20-25 escenas diferentes con sus respectivos finales
      3. Algunas decisiones deben llevar a finales tempranos (malas decisiones)
      4. Cada escena debe tener: situation, options (A, B, C), correctOption, y isEnding si es un final
      5. Las situaciones deben ser realistas y relevantes para el contexto de restaurantes
      6. Las opciones deben representar buenas, regulares y malas prácticas de servicio al cliente
      
      Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura:
      {
        "scene_1": {
          "situation": "Descripción detallada de la situación inicial...",
          "options": {
            "A": "Texto de la opción A",
            "B": "Texto de la opción B", 
            "C": "Texto de la opción C"
          },
          "correctOption": "B"
        },
        "scene_1A": {
          "situation": "Descripción de lo que sucede al elegir A...",
          "options": {
            "A": "Texto opción A",
            "B": "Texto opción B", 
            "C": "Texto opción C"
          },
          "correctOption": "A"
        },
        "scene_1B": {
          "situation": "Descripción de lo que sucede al elegir B...",
          "options": {
            "A": "Texto opción A",
            "B": "Texto opción B", 
            "C": "Texto opción C"
          },
          "correctOption": "C"
        },
        "scene_1C": {
          "situation": "Descripción de lo que sucede al elegir C...",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1AA": {
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
        "scene_1": {
          "situation": "Son las 10:45 PM y el restaurante cierra a las 11:00 PM. Llegan dos clientes con prisa, preguntando si pueden cenar. El restaurante está casi vacío, pero la cocina está comenzando a limpiar. Eres el host/recepcionista.",
          "options": {
            "A": "Decir directamente 'Lo siento, ya estamos cerrando' y negar la mesa",
            "B": "Explicar amablemente que cierran pronto pero ofrecer una opción limitada si desean comer rápido",
            "C": "Aceptarlos sin decirles sobre el cierre inminente y sentarlos sin más"
          },
          "correctOption": "B"
        },
        "scene_1A": {
          "situation": "Los clientes se ven visiblemente decepcionados y molestos. Uno de ellos comenta en voz alta sobre haber conducido desde lejos específicamente para probar este lugar. La situación se está volviendo incómoda.",
          "options": {
            "A": "Mantenerse firme en la negativa y señalar la hora en el reloj",
            "B": "Ofrecer disculpas y sugerir un excelente restaurante cercano que cierre más tarde",
            "C": "Ceder ante su decepción y decir 'Está bien, pueden pasar, pero de prisa'"
          },
          "correctOption": "B"
        },
        "scene_1B": {
          "situation": "Los clientes agradecen tu honestidad y aceptan la oferta de un menú limitado y rápido. Les explicas que solo pueden ofrecer unos pocos platos principales que son fáciles de preparar. El chef, que estaba apagando las estaciones, te lanza una mirada.",
          "options": {
            "A": "Llevar a los clientes a su mesa y gritarle al chef que prepare dos platos del menú express, sin más detalles",
            "B": "Pedirle un momento a los clientes, disculparte y hablar directamente con el chef para explicar la situación y ver qué es viable",
            "C": "Decirle a los clientes que, tras pensarlo, quizás sea mejor que no se queden"
          },
          "correctOption": "B"
        },
        "scene_1C": {
          "situation": "Sientas a los clientes sin mencionar el cierre. Pasan 10 minutos y nadie les lleva el menú. Los clientes empiezan a impacientarse. El personal de sala, que estaba recogiendo, los ignora porque cree que están terminando.",
          "options": {
            "A": "Ignorar la situación y dejar que otro mesero se encargue",
            "B": "Llevarles los menús de inmediato y disculparte por la demora sin explicar la razón real",
            "C": "Acercarte, disculparte profusamente y explicar honestamente el error para gestionar sus expectativas"
          },
          "correctOption": "C"
        },
        "scene_1AA": {
          "situation": "Te mantienes firme. Los clientes, muy enfadados, se marchan gritando que escribirán una pésima reseña en línea mencionando tu nombre específicamente. El gerente, que estaba en la trastienda, escucha el alboroto y se acerca.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1AB": {
          "situation": "Los clientes, aunque aún decepcionados, aprecian tu ayuda genuina. Aceptan tu recomendación para otro restaurante y se marchan de manera amistosa. El gerente, que observaba desde la distancia, asiente con aprobación.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_1AC": {
          "situation": "Los clientes se sientan rápidamente, pero el servicio es caótico. El chef está visiblemente molesto y la comida tarda más de lo prometido. Los otros camareros, que esperaban irse, murmuran entre ellos. La experiencia del cliente es mediocre.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1BA": {
          "situation": "El chef se enfada mucho por la falta de comunicación y se niega a cocinar, dejándote en una situación muy embarazosa frente a los clientes, que han escuchado todo. El ambiente es terriblemente incómodo.",
          "options": {
            "A": "Echarle la culpa al chef frente a los clientes",
            "B": "Disculparte con los clientes, admitir el error y ofrecerles una consumición gratis para llevar como compensación",
            "C": "Decirles a los clientes que hubo un malentendido y que deben irse"
          },
          "correctOption": "B"
        },
        "scene_1BB": {
          "situation": "Hablas con el chef. Aunque no está contento, aprecia que lo hayas consultado. Acuerdan preparar dos porciones de una pasta que es rápida de hacer. Los clientes son informados y están conformes.",
          "options": {
            "A": "Dejar a los clientes solos durante toda la comida ya que 'el problema está resuelto'",
            "B": "Ofrecer un servicio excepcional, asegurándote de que tienen todo lo necesario y explicando que el postre o café irá por cuenta de la casa por las molestias",
            "C": "Cobrarles inmediatamente después de comer para que se vayan rápido"
          },
          "correctOption": "B"
        },
        "scene_1BC": {
          "situation": "Vuelves con los clientes y les dices que ha sido un error y que no pueden quedarse. Se sienten confundidos y engañados, ya que primero les diste esperanzas y luego se las quitaste. Su decepción es mayor que al principio.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1CA": {
          "situation": "Los clientes se sienten completamente ignorados. Después de 15 minutos, se levantan y se van, furiosos. Al día siguiente, publican una reseña de 1 estrella describiendo el peor servicio de su vida.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1CB": {
          "situation": "Les llevas los menús. Ordenan rápidamente, pero la cocina está casi cerrada y tarda 25 minutos en servir la comida. Los clientes notan la prisa del personal y se sienten incómodos y una carga.",
          "options": {
            "A": "Apresurarlos constantemente para que coman más rápido",
            "B": "Ser amable y atento, pero no mencionar más el tema del cierre, dejando que disfruten su comida a su ritmo",
            "C": "Ofrecerles discretamente la comida o el postre por cuenta de la casa para compensar la espera inicial y la incomodidad"
          },
          "correctOption": "C"
        },
        "scene_1CC": {
          "situation": "Te acercas y eres totalmente honesto: 'Disculpen, ha sido un error de comunicación por mi parte. Estamos a punto de cerrar y no podremos ofrecerles una experiencia adecuada. Lo siento mucho'. Los clientes lo entienden, pero aún así se van decepcionados.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_1BAA": {
          "situation": "El conflicto escala. El chef y tú empiezan a discutir frente a los clientes. El gerente tiene que intervenir para calmar los ánimos. Los clientes se marchan sin comer, horrorizados por la falta de profesionalidad.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1BAB": {
          "situation": "Los clientes, aunque molestos, valoran tu honestidad y la gesture de la consumición gratis. Se van sin crear más problemas, pero probablemente no volverán.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_1BBA": {
          "situation": "Los clientes terminan su comida sintiéndose abandonados. Pagan la cuenta sin dejar propina y se van con una impresión mediocre del restaurante.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1BBB": {
          "situation": "Los clientes tienen una experiencia final positiva. A pesar de llegar tarde, se sienten bien atendidos y valoran el gesto del postre o café cortesía. Dejan una buena propina y prometen volver a una hora más apropiada.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "good"
        },
        "scene_1BBC": {
          "situation": "Al cobrarles de inmediato, los clientes se sienten literalmente echados. Pagan con malestar y se van murmurando, sintiendo que solo les importaba el dinero y no su experiencia.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1CBA": {
          "situation": "Les dices '¿Podrían comer un poco más rápido? Tenemos que cerrar'. Se sienten increíblemente incómodos y apuran la comida con desagrado. La experiencia arruina lo que pudo ser una buena cena.",
          "options": {},
          "correctOption": "A",
          "isEnding": true,
          "endingType": "bad"
        },
        "scene_1CBB": {
          "situation": "Disfrutan de su comida a un ritmo normal. El personal se va retrasando su salida, pero mantienen una actitud profesional. Los clientes no son del todo conscientes del inconveniente que causan y se van satisfechos.",
          "options": {},
          "correctOption": "B",
          "isEnding": true,
          "endingType": "neutral"
        },
        "scene_1CBC": {
          "situation": "El gesto de cortesía cambia completamente su percepción. Entienden la situación especial y comen de manera eficiente sin sentirse presionados. Agradecen enormemente el detalle y se convierten en clientes habituales gracias a cómo manejaste la situación.",
          "options": {},
          "correctOption": "C",
          "isEnding": true,
          "endingType": "good"
        }
      }
      setAllScenes(content);
      setStoryData(content["scene_1"]);
      
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
    setStoryData(allScenes["scene_1"]);
    setCurrentScene("scene_1");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 text-white">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">Entrenamiento de Restaurante</h1>
        <p className="text-xl opacity-90">Desarrolla tus habilidades de servicio al cliente</p>
      </header>
      
      <main className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 text-gray-800">
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
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-purple-600">
              <h2 className="text-2xl font-semibold text-purple-700 mb-3">Situación Actual</h2>
              <p className="text-lg leading-relaxed">{storyData.situation}</p>
            </div>
            
            {storyData.options && Object.keys(storyData.options).length > 0 ? (
              <div className="options">
                <h3 className="text-xl font-medium mb-4 text-gray-700">¿Qué decides hacer?</h3>
                <div className="space-y-3">
                  {Object.entries(storyData.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleOptionSelect(key)}
                      className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex items-start"
                    >
                      <span className="bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {key}
                      </span>
                      <span className="text-gray-700">{value}</span>
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
            <div className="pt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progreso</span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedPath.length} decisiones tomadas
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
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

export default Lesson