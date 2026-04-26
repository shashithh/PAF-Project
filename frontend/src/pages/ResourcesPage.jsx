import { useState, useEffect } from 'react';
import { resourceService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Building2, Plus, Search, Filter, X, Edit2, Trash2, MapPin, Users, Clock, Wifi } from 'lucide-react';

const TYPES = ['LECTURE_HALL','LAB','MEETING_ROOM','EQUIPMENT','AUDITORIUM','STUDY_ROOM'];
const STATUSES = ['ACTIVE','OUT_OF_SERVICE','MAINTENANCE','RETIRED'];

const TYPE_ICONS = {
  LECTURE_HALL: '🏛️', LAB: '🔬', MEETING_ROOM: '🤝', EQUIPMENT: '📷', AUDITORIUM: '🎭', STUDY_ROOM: '📚'
};

const STATUS_BADGE = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  OUT_OF_SERVICE: 'bg-red-500/15 text-red-400 border-red-500/30',
  MAINTENANCE: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  RETIRED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

function ResourceModal({ open, onClose, onSaved, editing }) {
  const empty = { name:'', type:'LECTURE_HALL', description:'', capacity:'', location:'', building:'', floorNumber:'', availableFrom:'08:00', availableTo:'20:00', status:'ACTIVE', amenities:'' };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '', type: editing.type || 'LECTURE_HALL',
        description: editing.description || '', capacity: editing.capacity || '',
        location: editing.location || '', building: editing.building || '',
        floorNumber: editing.floorNumber || '', availableFrom: editing.availableFrom || '08:00',
        availableTo: editing.availableTo || '20:00', status: editing.status || 'ACTIVE',
        amenities: editing.amenities || '',
      });
    } else { setForm(empty); }
  }, [editing, open]);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, capacity: form.capacity ? Number(form.capacity) : null, floorNumber: form.floorNumber ? Number(form.floorNumber) : null };
      if (editing) await resourceService.update(editing.id, payload);
      else await resourceService.create(payload);
      toast.success(editing ? 'Resource updated!' : 'Resource created!');
      onSaved(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (!open) return null;
  const F = (label, key, type='text', required=false) => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">{label}</label>
      <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} required={required}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
    </div>
  );
  const S = (label, key, opts) => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">{label}</label>
      <select value={form[key]} onChange={e => set(key, e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
        {opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">{editing ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {F('Resource Name', 'name', 'text', true)}
            {S('Type', 'type', TYPES)}
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {F('Capacity', 'capacity', 'number')}
            {F('Location', 'location', 'text', true)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {F('Building', 'building')}
            {F('Floor', 'floorNumber', 'number')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {F('Available From', 'availableFrom', 'time')}
            {F('Available To', 'availableTo', 'time')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {S('Status', 'status', STATUSES)}
            {F('Amenities', 'amenities')}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookingModal({ open, onClose, resource }) {
  const [form, setForm] = useState({ bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { bookingService: bs } = await import('../services/api');
      await bs.create({ ...form, resourceId: resource.id, expectedAttendees: Number(form.expectedAttendees) || null });
      toast.success('Booking requested! Pending admin approval.');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to book'); }
    finally { setSaving(false); }
  };

  if (!open || !resource) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Book: {resource.name}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {[['Date','bookingDate','date'],['Start Time','startTime','time'],['End Time','endTime','time'],['Expected Attendees','expectedAttendees','number']].map(([l,k,t]) => (
            <div key={k}>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">{l}</label>
              <input type={t} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} required={k !== 'expectedAttendees'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Purpose</label>
            <textarea value={form.purpose} onChange={e => setForm(f => ({...f, purpose: e.target.value}))} required rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50">
              {saving ? 'Booking...' : 'Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bookModal, setBookModal] = useState(null);

  const load = async () => {
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const res = await resourceService.getAll(params);
      setResources(res.data.data || []);
    } catch { toast.error('Failed to load resources'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterType, filterStatus]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try { await resourceService.delete(id); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = resources.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Building2 className="text-cyan-400" size={24} /> Facilities & Assets
          </h1>
          <p className="text-slate-500 text-sm mt-1">Browse and book campus resources</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditing(null); setModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
            <Plus size={16} /> Add Resource
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..."
            className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 w-56 transition-all" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
        {(search || filterType || filterStatus) && (
          <button onClick={() => { setSearch(''); setFilterType(''); setFilterStatus(''); }}
            className="flex items-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <Building2 size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No resources found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{TYPE_ICONS[r.type] || '🏢'}</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{r.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{r.type.replace(/_/g,' ')}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_BADGE[r.status]}`}>
                  {r.status.replace(/_/g,' ')}
                </span>
              </div>
              {r.description && <p className="text-slate-500 text-xs mb-3 line-clamp-2">{r.description}</p>}
              <div className="space-y-1.5 mb-4">
                {r.location && <div className="flex items-center gap-2 text-xs text-slate-500"><MapPin size={12} />{r.location}</div>}
                {r.capacity && <div className="flex items-center gap-2 text-xs text-slate-500"><Users size={12} />{r.capacity} capacity</div>}
                {r.availableFrom && <div className="flex items-center gap-2 text-xs text-slate-500"><Clock size={12} />{r.availableFrom} – {r.availableTo}</div>}
                {r.amenities && <div className="flex items-center gap-2 text-xs text-slate-500"><Wifi size={12} />{r.amenities}</div>}
              </div>
              <div className="flex gap-2">
                {r.status === 'ACTIVE' && (
                  <button onClick={() => setBookModal(r)} className="flex-1 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium rounded-xl hover:from-cyan-500/30 hover:to-blue-600/30 transition-all">
                    Book Now
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button onClick={() => { setEditing(r); setModal(true); }} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ResourceModal open={modal} onClose={() => { setModal(false); setEditing(null); }} onSaved={load} editing={editing} />
      <BookingModal open={!!bookModal} onClose={() => setBookModal(null)} resource={bookModal} />
    </div>
  );
}
