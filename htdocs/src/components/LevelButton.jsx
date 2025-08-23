import { useState } from "react"
import Lesson from "./Lesson"
import { FaTimes } from "react-icons/fa"

function LevelButton({ missionJSON, isActive }) {
  const [click, setClick] = useState(false)

  return (
    <div>
      <button
        onClick={() => setClick(true)}
        className="bg-amber-600 p-4 border-2 rounded-full w-20 h-20 font-bold text-3xl hover:cursor-pointer">
        {missionJSON.id}
      </button>

      {click && (
        <div className="fixed inset-0 w-screen h-screen bg-white z-50 p-4">
            <FaTimes  className="text-3xl" onClick={() => setClick(false)}/>
            <div className="pt-10"><Lesson leccionJSON={missionJSON}/></div>
        </div>
      )}
    </div>
  )
}

export default LevelButton
