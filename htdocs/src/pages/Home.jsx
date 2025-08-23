import Mission from '../components/Lesson';
import misionLlevarMesa from '../assets/missions/bring-table.json';
import { FaStar } from 'react-icons/fa';
import MissionBtn from "../components/LevelButton"
import nobringtable from '../assets/missions/notablebring.json'
import mission2 from '../assets/missions/mission2.json'


const Home = () => {
  let number = 0
  const missions = [misionLlevarMesa,mission2,nobringtable,misionLlevarMesa,mission2,nobringtable]
  let sum = true

  return (
    <div className='theme-bg h-screen'>

      {missions.map((mission, index) =>{
          let btnclass = "max-w-200 bg-amber-50 p-10 "
          
         
          
          if (number === 0) {
            btnclass +="justify-items-start"
          } else if (number === 1) {
            btnclass +="justify-items-center"
          } else if (number === 2) {
            btnclass +="justify-items-end"
          }
          
          if(number === 0){
            number+=1
            sum=true
          }
          else if(number === 1){
            sum ? number += 1 : number -=1
          }
          else if(number === 2){
            number-=1
            sum=false
          }


          return(
            <div className={btnclass} key={index}>
              <MissionBtn missionJSON={mission}/>
            </div>
          )

          

      })}

      
    </div>

  )
}

export default Home