import { useState, useEffect, useRef } from 'react';
import { ticketService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Wrench, Plus, X, Send, Edit2, Trash2, Image, MapPin, ChevronDown, ChevronUp, AlertTriangle, MessageSquare, Filter } from 'lucide-react';

const CATEGORIES = ['ELECTRICAL','PLUMBING','IT_EQUIPMENT','HVAC','FURNITURE','CLEANING','SECURITY','OTHER'];
const PRIORITIES = ['LOW','MEDIUM','HIGH','CRITICAL'];
const STATUSES = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED','REJECTED'];

const STATUS_STYLE = {
  OPEN: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  IN_PROGRESS: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  RESOLVED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  CLOSED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 border-red-500/30',
};
const PRIORITY_DOT = { LOW:'bg-slate-400', MEDIUM:'bg-amber-400', HIGH:'bg-orange-400', CRITICAL:'bg-red-500' };

function CreateModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({ title:'', description:'', category:'IT_EQUIPMENT', priority:'MEDIUM', location:'', preferredContact:'' });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      console.log("ticket submit token:", localStorage.getItem('sc_token') || localStorage.getItem('token'));
      const storedUser = localStorage.getItem('sc_user');
      if (storedUser) {
        console.log("current user roles:", JSON.parse(storedUser).roles);
      }
      await ticketService.create(form);
      toast.success('Ticket created!');
      onSaved(); onClose();
      setForm({ title:'', description:'', category:'IT_EQUIPMENT', priority:'MEDIUM', location:'', preferredContact:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Report Maintenance Issue</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Title</label>
            <input value={form.title} onChange={e => set('title',e.target.value)} required placeholder="Brief description of the issue"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Category</label>
              <select value={form.category} onChange={e => set('category',e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Priority</label>
              <select value={form.priority} onChange={e => set('priority',e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Location</label>
              <input value={form.location} onChange={e => set('location',e.target.value)} required placeholder="Room / Block"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Contact</label>
              <input value={form.preferredContact} onChange={e => set('preferredContact',e.target.value)} placeholder="Phone / Email"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={e => set('description',e.target.value)} required rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusModal({ open, onClose, ticket, onSaved }) {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (ticket) { setStatus(ticket.status); setAssignedTo(ticket.assignedTo || ''); } }, [ticket]);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await ticketService.updateStatus(ticket.id, { status, resolutionNotes: notes || undefined, rejectionReason: reason || undefined, assignedTo: assignedTo || undefined });
      toast.success('Status updated!');
      onSaved(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (!open || !ticket) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">Update Ticket #{ticket.id}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${status === s ? `${STATUS_STYLE[s]} border` : 'border-slate-700 text-slate-500 hover:bg-slate-800'}`}>
                  {s.replace(/_/g,' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Assign To (username)</label>
            <input value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder="tech1"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all" />
          </div>
          {(status === 'RESOLVED' || status === 'CLOSED') && (
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Resolution Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
            </div>
          )}
          {status === 'REJECTED' && (
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Rejection Reason</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none" />
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TicketCard({ ticket, onRefresh, isAdmin, isTechnician, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const canManage = isAdmin || isTechnician;

  const sendComment = async () => {
    if (!comment.trim()) return;
    setSendingComment(true);
    try {
      await ticketService.addComment(ticket.id, { content: comment });
      setComment('');
      onRefresh();
    } catch (err) { toast.error('Failed to add comment'); }
    finally { setSendingComment(false); }
  };

  const saveEdit = async (cid) => {
    try {
      await ticketService.editComment(ticket.id, cid, { content: editText });
      setEditingComment(null); onRefresh();
    } catch { toast.error('Failed to edit'); }
  };

  const delComment = async (cid) => {
    if (!confirm('Delete this comment?')) return;
    try { await ticketService.deleteComment(ticket.id, cid); onRefresh(); }
    catch { toast.error('Failed to delete comment'); }
  };

  const delTicket = async () => {
    if (!confirm('Delete this ticket?')) return;
    try { await ticketService.delete(ticket.id); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[ticket.priority]}`} />
              <h3 className="text-white font-medium text-sm truncate">{ticket.title}</h3>
              <span className="text-slate-600 text-xs">#{ticket.id}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={10} />{ticket.location}</span>
              <span>{ticket.category.replace(/_/g,' ')}</span>
              <span className="text-slate-600">by {ticket.reporterUsername}</span>
              {ticket.assignedTo && <span className="text-cyan-600">→ {ticket.assignedTo}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_STYLE[ticket.status]}`}>{ticket.status.replace(/_/g,' ')}</span>
            <span className={`text-xs font-medium ${PRIORITY_DOT[ticket.priority].replace('bg-','text-')}`}>{ticket.priority}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors">
            <MessageSquare size={13} /> {(ticket.comments || []).length} comments
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <div className="flex items-center gap-1.5">
            {canManage && (
              <button onClick={() => setStatusModal(true)} className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700 border border-slate-700 transition-all">
                Update Status
              </button>
            )}
            {isAdmin && (
              <button onClick={delTicket} className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 px-5 pb-5">
          <p className="text-slate-400 text-sm py-3">{ticket.description}</p>
          {ticket.resolutionNotes && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3 text-xs text-emerald-400">✓ Resolution: {ticket.resolutionNotes}</div>}
          {ticket.rejectionReason && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3 text-xs text-red-400">✗ Rejected: {ticket.rejectionReason}</div>}

          {(ticket.comments || []).length > 0 && (
            <div className="space-y-2 mb-4">
              {ticket.comments.map(c => (
                <div key={c.id} className="bg-slate-800/50 rounded-xl p-3">
                  {editingComment === c.id ? (
                    <div className="flex gap-2">
                      <input value={editText} onChange={e => setEditText(e.target.value)} autoFocus
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-cyan-500" />
                      <button onClick={() => saveEdit(c.id)} className="px-2 py-1 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-500">Save</button>
                      <button onClick={() => setEditingComment(null)} className="px-2 py-1 text-slate-500 text-xs hover:text-slate-300">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-cyan-400 text-xs font-medium">{c.authorUsername}</span>
                        <p className="text-slate-300 text-xs mt-0.5">{c.content}</p>
                      </div>
                      {(c.authorUsername === currentUser || isAdmin) && (
                        <div className="flex gap-1 flex-shrink-0">
                          {c.authorUsername === currentUser && (
                            <button onClick={() => { setEditingComment(c.id); setEditText(c.content); }} className="p-1 text-slate-500 hover:text-slate-300"><Edit2 size={11} /></button>
                          )}
                          <button onClick={() => delComment(c.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 size={11} /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input value={comment} onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all" />
            <button onClick={sendComment} disabled={sendingComment || !comment.trim()}
              className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 disabled:opacity-50 transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <StatusModal open={statusModal} onClose={() => setStatusModal(false)} ticket={ticket} onSaved={onRefresh} />
    </div>
  );
}

export default function TicketsPage() {
  const { isAdmin, isTechnician, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const load = async () => {
    try {
      console.debug('Ticket load', {
        token: localStorage.getItem('sc_token') || localStorage.getItem('token'),
        roles: user?.roles,
        filters: { filterStatus, filterCategory, filterPriority },
      });
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterCategory) params.category = filterCategory;
      if (filterPriority) params.priority = filterPriority;
      const res = await ticketService.getAll(params);
      setTickets(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Access denied when loading tickets. Please sign in again or contact admin.');
      } else {
        toast.error('Failed to load tickets');
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterStatus, filterCategory, filterPriority]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wrench className="text-amber-400" size={24} />
            {isAdmin || isTechnician ? 'All Maintenance Tickets' : 'My Tickets'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Report and track maintenance issues</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-amber-500/20">
          <Plus size={16} /> Report Issue
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ['Status', filterStatus, setFilterStatus, ['', ...STATUSES]],
          ['Category', filterCategory, setFilterCategory, ['', ...CATEGORIES]],
          ['Priority', filterPriority, setFilterPriority, ['', ...PRIORITIES]],
        ].map(([label, val, setter, opts]) => (
          <select key={label} value={val} onChange={e => setter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-all">
            {opts.map(o => <option key={o} value={o}>{o ? o.replace(/_/g,' ') : `All ${label}s`}</option>)}
          </select>
        ))}
        {(filterStatus || filterCategory || filterPriority) && (
          <button onClick={() => { setFilterStatus(''); setFilterCategory(''); setFilterPriority(''); }}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <Wrench size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No tickets found</p>
          <p className="text-slate-600 text-sm mt-1">Click "Report Issue" to create your first ticket</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(t => (
            <TicketCard key={t.id} ticket={t} onRefresh={load} isAdmin={isAdmin} isTechnician={isTechnician} currentUser={user?.username} />
          ))}
        </div>
      )}

      <CreateModal open={modal} onClose={() => setModal(false)} onSaved={load} />
    </div>
  );
}
