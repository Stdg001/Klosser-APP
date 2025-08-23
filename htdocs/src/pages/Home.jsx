import Mission from '../components/Lesson';
import misionLlevarMesa from '../assets/missions/bring-table.json';
import { FaStar } from 'react-icons/fa';
import MissionBtn from "../components/LevelButton"


const Home = () => {

  function handleClick(click){

  }
  return (
    <div className='p-10 theme-bg h-screen'>
      {/* <Mission leccionJSON={misionLlevarMesa} /> */}
      <MissionBtn missionJSON={misionLlevarMesa}/>
      
      
      
    </div>

  )
}

export default Home