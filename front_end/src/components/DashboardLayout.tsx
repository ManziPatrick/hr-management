import { useState } from 'react';
import { 
  Search,
  User,
  ChevronDown,
  Menu
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeItem?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (Navbar) */}
        <nav className="hidden lg:flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200" style={{ minHeight: 64 }}>
          {/* Search */}
          <div className="flex items-center w-1/3">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
                <Search size={20} />
              </span>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F3F8FF] border border-blue-100 text-gray-400 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          {/* Spacer */}
          <div className="flex-1"></div>
          {/* Profile */}
          <div className="flex items-center space-x-3">
            <img
              src={'https://randomuser.me/api/portraits/lego/1.jpg'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 shadow-sm"
            />
            <span className="font-semibold text-gray-800">{user?.name || 'User'}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </nav>
        {/* Top Bar for mobile (unchanged) */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">HR Management</h1>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
