import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService, ticketService, notificationService, resourceService } from '../services/api';
import { Building2, CalendarCheck, Wrench, Bell, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STYLE = {
  ACTIVE:'text-emerald-400',PENDING:'text-amber-400',APPROVED:'text-emerald-400',REJECTED:'text-red-400',CANCELLED:'text-slate-400',
  OPEN:'text-blue-400',IN_PROGRESS:'text-amber-400',RESOLVED:'text-emerald-400',CLOSED:'text-slate-400',
};

function StatCard({ icon: Icon, label, value, gradient, link }) {
  const inner = (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${gradient}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</div>
        <div className="text-white text-2xl font-bold mt-0.5">{value ?? '—'}</div>
      </div>
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState({ bookings:[], tickets:[], notifs:[], resources:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [bRes, tRes, nRes, rRes] = await Promise.allSettled([
        isAdmin ? bookingService.getAll() : bookingService.getMy(),
        ticketService.getAll(), notificationService.getAll(),
        resourceService.getAll({ status: 'ACTIVE' }),
      ]);
      setData({
        bookings: bRes.status === 'fulfilled' ? bRes.value.data.data || [] : [],
        tickets: tRes.status === 'fulfilled' ? tRes.value.data.data || [] : [],
        notifs: nRes.status === 'fulfilled' ? nRes.value.data.data || [] : [],
        resources: rRes.status === 'fulfilled' ? rRes.value.data.data || [] : [],
      });
      setLoading(false);
    };
    load();
  }, []);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const unread = data.notifs.filter(n => !n.read).length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{greeting}, <span className="text-cyan-400">{user?.fullName || user?.username}</span> 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening on campus today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin && <StatCard icon={Building2} label="Active Resources" value={data.resources.length} gradient="from-cyan-500 to-blue-600" link="/resources" />}
        <StatCard icon={CalendarCheck} label="My Bookings" value={data.bookings.length} gradient="from-violet-500 to-purple-600" link="/bookings" />
        <StatCard icon={Wrench} label="My Tickets" value={data.tickets.length} gradient="from-amber-500 to-orange-600" link="/tickets" />
        <StatCard icon={Bell} label="Unread" value={unread} gradient="from-rose-500 to-pink-600" link="/notifications" />
        <StatCard icon={Clock} label="Pending Bookings" value={data.bookings.filter(b => b.status === 'PENDING').length} gradient="from-yellow-500 to-amber-600" link="/bookings" />
        <StatCard icon={AlertCircle} label="Open Tickets" value={data.tickets.filter(t => t.status === 'OPEN').length} gradient="from-red-500 to-rose-600" link="/tickets" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { title: 'Recent Bookings', icon: CalendarCheck, color: 'text-cyan-400', link: '/bookings', items: data.bookings.slice(0,5), renderItem: b => ({main: b.resourceName, sub: `${b.bookingDate} · ${b.startTime}–${b.endTime}`, status: b.status}) },
          { title: 'Recent Tickets', icon: Wrench, color: 'text-amber-400', link: '/tickets', items: data.tickets.slice(0,5), renderItem: t => ({main: t.title, sub: `${t.category.replace(/_/g,' ')} · ${t.priority}`, status: t.status}) },
        ].map(({ title, icon: Icon, color, link, items, renderItem }) => (
          <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2"><Icon size={16} className={color} /><h3 className="text-white font-semibold text-sm">{title}</h3></div>
              <Link to={link} className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors">View all →</Link>
            </div>
            {items.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-600 text-sm">Nothing yet</div>
            ) : (
              <div className="divide-y divide-slate-800">
                {items.map((item, i) => { const r = renderItem(item); return (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div><div className="text-slate-200 text-sm font-medium truncate max-w-[200px]">{r.main}</div><div className="text-slate-600 text-xs mt-0.5">{r.sub}</div></div>
                    <span className={`text-xs font-medium ${STATUS_STYLE[r.status] || 'text-slate-400'}`}>{r.status}</span>
                  </div>
                );})}
              </div>
            )}
          </div>
        ))}
      </div>

      {unread > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2"><Bell size={16} className="text-rose-400" /><h3 className="text-white font-semibold text-sm">Unread Notifications</h3><span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full">{unread}</span></div>
            <Link to="/notifications" className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-slate-800">
            {data.notifs.filter(n => !n.read).slice(0,4).map(n => (
              <div key={n.id} className="px-5 py-3"><div className="text-slate-200 text-sm font-medium">{n.title}</div><div className="text-slate-500 text-xs mt-0.5">{n.message}</div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
