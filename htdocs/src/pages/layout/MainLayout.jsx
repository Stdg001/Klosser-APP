import { Outlet } from 'react-router-dom';
const MainLayout = () => (
  <div>
    <main>
      <Outlet />
    </main>
  </div>
)

export default MainLayout