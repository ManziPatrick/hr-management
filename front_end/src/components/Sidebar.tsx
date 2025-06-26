import { 
  Home, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  User,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../image/log.png';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-20 bg-[#0B2A7D] shadow-lg lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-blue-900">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={Logo} alt="" className="w-8 h-10" />
          </div>
        </div>

        {/* User Info */}
        {/* User Info section removed as per the instructions */}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 flex flex-col justify-between">
          <div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center space-y-1 px-0 py-2 transition-all duration-300
                    ${isActive
                      ? 'relative text-white font-bold before:content-[""] before:absolute before:left-0 before:top-0 before:h-12 before:w-1 before:rounded before:bg-orange-400'
                      : 'text-blue-100 hover:bg-blue-900 hover:text-white'
                    }`}
                  style={{ minHeight: '40px' }}
                >
                  <span className={isActive ? "sidebar-icon-glow p-2" : ""}>
                    <Icon size={24} />
                  </span>
                  <span className="font-medium text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center space-y-1 px-0 py-2 text-blue-100 hover:bg-blue-900 hover:text-white font-medium text-xs transition-all duration-300"
            style={{ minHeight: '40px' }}
          >
            <span>
              <LogOut size={24} />
            </span>
            <span className="mt-1">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
