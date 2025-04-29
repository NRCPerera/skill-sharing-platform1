import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, BookOpen, Award, Bell, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Learning Plans', path: '/learning-plans', icon: <BookOpen size={20} /> },
    { name: 'Progress', path: '/progress-update', icon: <Award size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sticky top-20">
      {user && (
        <div className="flex items-center gap-3 p-4 mb-4 border-b border-gray-100">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="font-bold text-xl text-primary-700">{user.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        {user && (
          <>
            <NavLink
              to={`/profile/${user.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`
              }
            >
              <User size={20} />
              <span>Profile</span>
            </NavLink>

            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;