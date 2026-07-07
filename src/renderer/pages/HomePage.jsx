import { Outlet } from 'react-router';
import NavBar from '../components/layout/NavBar.jsx';
import { mainNavItems, fixedNavItems } from '../routes/navItems.jsx';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <NavBar
        mainItems={mainNavItems}
        fixedItems={fixedNavItems}
      />

      <main className="home-content">
        <Outlet />
      </main>
    </div>
  );
}

export default HomePage;