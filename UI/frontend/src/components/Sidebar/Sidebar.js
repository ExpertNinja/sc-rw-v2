import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { userRole } = useAuth();

  const navigationItems = {
    Admin: [
      {
        path: "/Admin/Dashboard",
        icon: "bi bi-speedometer2",
        label: "Dashboard"
      },
      {
        path: "/users",
        icon: "bi bi-people",
        label: "Users"
      },
      {
        path: "/path_configuration",
        icon: "bi bi-gear",
        label: "Path Configuration"
      }
    ],
    User: [
      {
        path: "/User/Dashboard",
        icon: "bi bi-house-door",
        label: "Dashboard"
      },
      {
        path: "/subscription_status",
        icon: "bi bi-card-checklist",
        label: "Subscription Status"
      },
      {
        path: "/user_subscribe",
        icon: "bi bi-plus-circle",
        label: "Subscribe to Groups"
      }
    ],
    Operations: [
      {
        path: "/OpsPage/OpsPage",
        icon: "bi bi-diagram-3",
        label: "Operations Dashboard"
      }
    ]
  };

  const currentNavItems = navigationItems[userRole] || [];

  return (
    <aside className="sidebar" aria-label="Main sidebar">
      <div className="sidebar-inner">
        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          <ul className="sidebar-list">
            {currentNavItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <i className={item.icon}></i>
                  <span className="link-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <small>© {new Date().getFullYear()} Standard Chartered GBS Bank</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
