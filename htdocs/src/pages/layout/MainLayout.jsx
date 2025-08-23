import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
const MainLayout = () => (
  <div>
    <Sidebar />
    <main className='pl-70'>
      <Outlet />
    </main>
  </div>
)

export default MainLayout