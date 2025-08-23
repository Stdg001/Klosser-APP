import { useState } from "react"
import Lesson from "./Lesson"
import { FaTimes } from "react-icons/fa"

function LevelButton({ missionJSON, isActive }) {
  const [click, setClick] = useState(false)

  return (
    <div>
      <button
        onClick={() => setClick(true)}
        className="bg-amber-600 hover:bg-amber-100 p-4 border-2 rounded-full w-20 h-20 font-bold text-3xl cursor-pointer active:bg-amber-400">
        {missionJSON.id}
      </button>

      {click && (
        <div className="fixed inset-0 w-screen h-screen theme-bg z-50 p-4 ">
            <FaTimes  className=" theme-text text-3xl" onClick={() => setClick(false)}/>
            <div className="pt-10">
              <Lesson leccionJSON={missionJSON}/></div>
        </div>
      )}
    </div>
  )
}

export default LevelButton
