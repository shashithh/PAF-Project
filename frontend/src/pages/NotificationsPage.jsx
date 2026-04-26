import { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import toast from 'react-hot-toast';
import { Bell, CheckCheck, Trash2, BookOpen, Wrench, MessageSquare, Info } from 'lucide-react';

const TYPE_CONFIG = {
  BOOKING_APPROVED: { icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  BOOKING_REJECTED: { icon: BookOpen, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  BOOKING_CANCELLED: { icon: BookOpen, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  TICKET_STATUS_CHANGED: { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  TICKET_COMMENT_ADDED: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  TICKET_ASSIGNED: { icon: Wrench, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  SYSTEM: { icon: Info, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
};

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifs(res.data.data || []);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { toast.error('Failed'); }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllRead();
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const unread = notifs.filter(n => !n.read).length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell className="text-cyan-400" size={24} />
            Notifications
            {unread > 0 && <span className="bg-cyan-500/20 text-cyan-400 text-sm px-2.5 py-0.5 rounded-full font-medium">{unread} unread</span>}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Stay updated on bookings and tickets</p>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition-colors border border-slate-700">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <Bell size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No notifications yet</p>
          <p className="text-slate-600 text-sm mt-1">You'll be notified about bookings and tickets here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
            const Icon = cfg.icon;
            return (
              <div key={n.id} onClick={() => !n.read && handleMarkRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  n.read ? 'bg-slate-900/50 border-slate-800/50 opacity-60' : `${cfg.bg} border hover:opacity-90`
                }`}>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? 'text-slate-400' : 'text-slate-100'}`}>{n.title}</p>
                    <span className="text-xs text-slate-600 flex-shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className={`text-sm mt-0.5 ${n.read ? 'text-slate-600' : 'text-slate-400'}`}>{n.message}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
