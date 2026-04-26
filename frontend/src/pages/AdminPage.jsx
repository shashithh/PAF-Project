import { useState, useEffect } from 'react';
import { ticketService, bookingService, resourceService } from '../services/api';
import { BarChart2, Wrench, CalendarDays, Building2, TrendingUp } from 'lucide-react';

function AnalyticsBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label.replace(/_/g,' ')}</span>
        <span className="text-slate-300 font-medium">{value}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [tRes, bRes, rRes] = await Promise.allSettled([
        ticketService.getAnalytics(), bookingService.getAll(), resourceService.getAll(),
      ]);
      setAnalytics({
        tickets: tRes.status === 'fulfilled' ? tRes.value.data.data : null,
        bookings: bRes.status === 'fulfilled' ? bRes.value.data.data || [] : [],
        resources: rRes.status === 'fulfilled' ? rRes.value.data.data || [] : [],
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const t = analytics?.tickets;
  const bookings = analytics?.bookings || [];
  const resources = analytics?.resources || [];

  const byCat = t?.byCategory || {};
  const byPri = t?.byPriority || {};
  const maxCat = Math.max(1, ...Object.values(byCat));
  const maxPri = Math.max(1, ...Object.values(byPri));

  const bookingByStatus = ['PENDING','APPROVED','REJECTED','CANCELLED'].reduce((acc, s) => ({
    ...acc, [s]: bookings.filter(b => b.status === s).length
  }), {});
  const maxBook = Math.max(1, ...Object.values(bookingByStatus));

  const resourceByType = resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1; return acc;
  }, {});

  const CAT_COLORS = ['bg-cyan-500','bg-blue-500','bg-violet-500','bg-purple-500','bg-pink-500','bg-rose-500','bg-amber-500','bg-orange-500'];
  const PRI_COLORS = { LOW:'bg-slate-400', MEDIUM:'bg-amber-400', HIGH:'bg-orange-500', CRITICAL:'bg-red-500' };
  const BOOK_COLORS = { PENDING:'bg-amber-400', APPROVED:'bg-emerald-500', REJECTED:'bg-red-500', CANCELLED:'bg-slate-500' };

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><BarChart2 className="text-cyan-400" size={24} />Admin Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">System-wide overview and statistics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tickets', value: t?.totalTickets || 0, icon: Wrench, color: 'text-amber-400' },
          { label: 'Open Tickets', value: t?.openTickets || 0, icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Total Bookings', value: bookings.length, icon: CalendarDays, color: 'text-cyan-400' },
          { label: 'Total Resources', value: resources.length, icon: Building2, color: 'text-violet-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2"><Icon size={16} className={color} /><span className="text-slate-500 text-xs uppercase tracking-wider">{label}</span></div>
            <div className="text-white text-3xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tickets by status */}
        {t && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Wrench size={16} className="text-amber-400" />Tickets by Status</h3>
            <div className="space-y-3">
              {[['Open', t.openTickets,'bg-blue-500'],['In Progress',t.inProgressTickets,'bg-amber-500'],['Resolved',t.resolvedTickets,'bg-emerald-500'],['Closed',t.closedTickets,'bg-slate-500'],['Rejected',t.rejectedTickets,'bg-red-500']].map(([l,v,c]) => (
                <AnalyticsBar key={l} label={l} value={v} max={t.totalTickets} color={c} />
              ))}
            </div>
          </div>
        )}

        {/* Bookings by status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><CalendarDays size={16} className="text-cyan-400" />Bookings by Status</h3>
          <div className="space-y-3">
            {Object.entries(bookingByStatus).map(([s, v]) => (
              <AnalyticsBar key={s} label={s} value={v} max={maxBook} color={BOOK_COLORS[s] || 'bg-slate-500'} />
            ))}
          </div>
        </div>

        {/* Tickets by category */}
        {t && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Tickets by Category</h3>
            <div className="space-y-3">
              {Object.entries(byCat).filter(([,v]) => v > 0).sort(([,a],[,b]) => b-a).map(([cat, v], i) => (
                <AnalyticsBar key={cat} label={cat} value={v} max={maxCat} color={CAT_COLORS[i % CAT_COLORS.length]} />
              ))}
            </div>
          </div>
        )}

        {/* Resources by type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Building2 size={16} className="text-violet-400" />Resources by Type</h3>
          <div className="space-y-3">
            {Object.entries(resourceByType).sort(([,a],[,b]) => b-a).map(([type, v], i) => (
              <AnalyticsBar key={type} label={type} value={v} max={resources.length} color={CAT_COLORS[i % CAT_COLORS.length]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
