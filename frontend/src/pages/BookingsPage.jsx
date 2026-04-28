import { useState, useEffect } from 'react';
import { bookingService, resourceService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CalendarDays, Plus, X, Check, XCircle, Clock, MapPin, Users, ChevronDown } from 'lucide-react';

const STATUS_STYLES = {
  PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  APPROVED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 border-red-500/30',
  CANCELLED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

function BookingFormModal({ open, onClose, onSaved }) {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (open) resourceService.getAll({ status: 'ACTIVE' }).then(r => setResources(r.data.data || [])).catch(() => {});
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!form.resourceId) return toast.error('Please select a resource');
    if (!form.bookingDate) return toast.error('Please select booking date');
    if (!form.startTime) return toast.error('Please select start time');
    if (!form.endTime) return toast.error('Please select end time');
    if (!form.purpose.trim()) return toast.error('Please enter purpose');
    if (!form.expectedAttendees || Number(form.expectedAttendees) < 1) {
      return toast.error('Expected attendees must be at least 1');
    }

    const formatTime = (t) => t?.length === 5 ? `${t}:00` : t;

    const payload = {
      resourceId: String(form.resourceId),
      bookingDate: form.bookingDate,
      startTime: formatTime(form.startTime),
      endTime: formatTime(form.endTime),
      purpose: form.purpose,
      expectedAttendees: Number(form.expectedAttendees)
    };

    setSaving(true);
    try {
      await bookingService.create(payload);
      toast.success('Booking requested! Pending approval.');
      onSaved(); 
      onClose();
      setForm({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to create booking'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">New Booking Request</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Resource</label>
            <select value={form.resourceId} onChange={e => set('resourceId', e.target.value)} required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
              <option value="">Select a resource...</option>
              {resources.map(r => <option key={r.id} value={r.id}>{r.name} – {r.location}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['Booking Date','bookingDate','date'],['Expected Attendees','expectedAttendees','number']].map(([l,k,t]) => (
              <div key={k}>
                <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">{l}</label>
                <input type={t} value={form[k]} onChange={e => set(k, e.target.value)} required={k !== 'expectedAttendees'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['Start Time','startTime','time'],['End Time','endTime','time']].map(([l,k,t]) => (
              <div key={k}>
                <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">{l}</label>
                <input type={t} value={form[k]} onChange={e => set(k, e.target.value)} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Purpose</label>
            <textarea value={form.purpose} onChange={e => set('purpose', e.target.value)} required rows={3}
              placeholder="Describe the purpose of this booking..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Submitting...' : 'Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewModal({ open, onClose, booking, onSaved }) {
  const [status, setStatus] = useState('APPROVED');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await bookingService.review(booking.id, { status, adminNotes: notes });
      toast.success(`Booking ${status.toLowerCase()}`);
      onSaved(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (!open || !booking) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Review Booking #{booking.id}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div className="bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Resource</span><span className="text-slate-200 font-medium">{booking.resourceName}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Requester</span><span className="text-slate-200">{booking.requesterUsername}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="text-slate-200">{booking.bookingDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Time</span><span className="text-slate-200">{booking.startTime} – {booking.endTime}</span></div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Decision</label>
            <div className="grid grid-cols-2 gap-2">
              {['APPROVED','REJECTED'].map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    status === s ? (s === 'APPROVED' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400')
                    : 'border-slate-700 text-slate-500 hover:bg-slate-800'
                  }`}>{s === 'APPROVED' ? '✓ Approve' : '✗ Reject'}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={saving} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 ${
              status === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
            }`}>{saving ? 'Saving...' : `Confirm ${status}`}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchBookings = async () => {
    return isAdmin ? bookingService.getAll() : bookingService.getMy();
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      if (!isAdmin && err.response?.status === 403) {
        toast.error('You are not allowed to view all bookings. Loading your bookings instead.');
        const res = await bookingService.getMy();
        setBookings(res.data.data || []);
      } else {
        toast.error('Failed to load bookings');
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try { await bookingService.cancel(id); toast.success('Booking cancelled'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = filterStatus ? bookings.filter(b => b.status === filterStatus) : bookings;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CalendarDays className="text-cyan-400" size={24} />
            {isAdmin ? 'All Bookings' : 'My Bookings'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{isAdmin ? 'Manage and review all booking requests' : 'View and manage your resource bookings'}</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500">
            <option value="">All Statuses</option>
            {['PENDING','APPROVED','REJECTED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
            <Plus size={16} /> New Booking
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <CalendarDays size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No bookings found</p>
          <p className="text-slate-600 text-sm mt-1">Click "New Booking" to get started</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {['#','Resource','Date & Time','Purpose','Attendees','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3.5 text-slate-500 text-sm">{b.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-200 text-sm font-medium">{b.resourceName}</div>
                    <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><MapPin size={10} />{b.resourceLocation}</div>
                    {isAdmin && <div className="text-slate-600 text-xs mt-0.5">by {b.requesterUsername}</div>}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-200 text-sm">{b.bookingDate}</div>
                    <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5"><Clock size={10} />{b.startTime} – {b.endTime}</div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px]"><span className="text-slate-400 text-sm truncate block">{b.purpose}</span></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-1 text-slate-400 text-sm"><Users size={12} />{b.expectedAttendees || '—'}</div></td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                    {b.adminNotes && <div className="text-slate-600 text-xs mt-1 italic">"{b.adminNotes}"</div>}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {isAdmin && b.status === 'PENDING' && (
                        <button onClick={() => setReviewModal(b)} className="px-2.5 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs hover:bg-cyan-500/20 transition-all">Review</button>
                      )}
                      {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                        <button onClick={() => handleCancel(b.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <XCircle size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BookingFormModal open={modal} onClose={() => setModal(false)} onSaved={load} />
      <ReviewModal open={!!reviewModal} onClose={() => setReviewModal(null)} booking={reviewModal} onSaved={load} />
    </div>
  );
}
