import Mission from '../components/Lesson';
import misionLlevarMesa from '../assets/missions/bring-table.json';

const Home = () => {
  return (
    <div className='m-10'>
      <Mission leccionJSON={misionLlevarMesa} />
    </div>
  )
}

export default Home