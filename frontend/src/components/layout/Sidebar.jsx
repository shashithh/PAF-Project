import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { notificationService } from '../../services/api';
import {
  LayoutDashboard, Building2, CalendarDays, Wrench,
  Bell, LogOut, GraduationCap, Shield, ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resources', icon: Building2, label: 'Facilities & Assets' },
  { to: '/bookings', icon: CalendarDays, label: 'My Bookings' },
  { to: '/tickets', icon: Wrench, label: 'Maintenance' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const adminItems = [
  { to: '/admin/resources', icon: Building2, label: 'Manage Resources' },
  { to: '/admin/bookings', icon: CalendarDays, label: 'All Bookings' },
  { to: '/admin/tickets', icon: Wrench, label: 'All Tickets' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        setUnread(res.data.data?.count || 0);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">Smart Campus</p>
            <p className="text-xs text-slate-500">Operations Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}>
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {to === '/notifications' && unread > 0 && (
              <span className="bg-cyan-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-1.5 px-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={10} /> Admin Panel
              </p>
            </div>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}>
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User profile */}
      <div className="px-3 py-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.fullName || user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.roles?.join(' · ')}</p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
            title="Logout"
            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
