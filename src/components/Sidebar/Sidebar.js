import React from 'react';
import './Sidebar.css'; // We'll create this next
// import { Home, BarChart2, Settings, User } from 'lucide-react'; // Example icons

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <h2>Analyzer AI</h2>
        {/* Hamburger for mobile view to close, only shown when sidebar is open on mobile */}
        <button className="sidebar-close-toggle" onClick={toggleSidebar}>
          &times;
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Add actual navigation links here if needed in the future */}
          <li><a href="#home" className="active" onClick={toggleSidebar}>Home</a></li>
          <li><a href="#analytics" onClick={toggleSidebar}>Analytics Dashboard</a></li>
          <li><a href="#reports" onClick={toggleSidebar}>Pattern Reports</a></li>
          <li><a href="#settings" onClick={toggleSidebar}>User Settings</a></li>
          <li><a href="#profile" onClick={toggleSidebar}>My Profile</a></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>&copy; {new Date().getFullYear()} Stock Analyzer</p>
      </div>
    </aside>
  );
};

export default Sidebar;
