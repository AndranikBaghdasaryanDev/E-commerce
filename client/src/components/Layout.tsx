import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav>Header</nav>
      <Outlet />
      <footer>Footer</footer>
    </div>
  );
};

export default Layout; 