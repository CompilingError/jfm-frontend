import { NavLink } from 'react-router';
import { t } from '../../i18n/index.js';
import './NavBar.css';

function NavBar({ mainItems, fixedItems }) {
  function renderNavItem(item) {
    const Icon = item.Icon;
    const label = t(item.labelKey);

    return (
      <NavLink
        key={item.key}
        to={item.path}
        className={({ isActive }) =>
          isActive ? 'nav-item nav-item-active' : 'nav-item'
        }
        title={label}
      >
        <Icon className="nav-icon" size={22} strokeWidth={2} />
        <span className="nav-text">{label}</span>
      </NavLink>
    );
  }

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <span className="nav-logo-icon">J</span>
        <span className="nav-logo-text">JFM</span>
      </div>

      <div className="nav-items">
        {mainItems.map(renderNavItem)}
      </div>

      <div className="nav-fixed-items">
        {fixedItems.map(renderNavItem)}
      </div>
    </nav>
  );
}

export default NavBar;