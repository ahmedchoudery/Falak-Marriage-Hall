import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ── helpers ────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
    pending: { bg: 'rgba(255,193,7,0.15)', color: '#ffc107', label: 'Pending' },
    approved: { bg: 'rgba(40,167,69,0.15)', color: '#28a745', label: 'Approved' },
    rejected: { bg: 'rgba(220,53,69,0.15)', color: '#dc3545', label: 'Rejected' },
    manual: { bg: 'rgba(198,167,105,0.15)', color: '#C6A769', label: 'Manual' },
}

const SOURCE_BADGE = {
    online: { bg: 'rgba(13,110,253,0.15)', color: '#4d94ff', label: 'Online' },
    manual: { bg: 'rgba(198,167,105,0.15)', color: '#C6A769', label: 'Manual' },
}

function StatusPill({ status }) {
    const s = STATUS_COLORS[status] || STATUS_COLORS.pending
    return (
        <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {s.label}
        </span>
    )
}

function SourcePill({ source }) {
    const s = SOURCE_BADGE[source] || SOURCE_BADGE.online
    return (
        <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600, marginLeft: 6 }}>
            {s.label}
        </span>
    )
}

const BLANK_FORM = {
    name: '', phone: '', email: '', eventDate: '',
    eventType: '', hall: 'Any Available', guests: '', message: '', status: 'approved',
}

const EVENT_TYPES = ['Wedding (Nikah)', 'Walima / Reception', 'Mehndi Night', 'Birthday Party', 'Corporate Event', 'Other']
const HALLS = ['Main Grand Hall', 'Garden Terrace', 'Any Available']

// ── main component ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const navigate = useNavigate()
    const token = sessionStorage.getItem('adminToken')

    const [tab, setTab] = useState('bookings')   // bookings | availability
    const [filter, setFilter] = useState('all')
    const [bookings, setBookings] = useState([])
    const [availability, setAvailability] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)

    // Modal state
    const [modal, setModal] = useState(null)          // null | 'add' | 'edit'
    const [editTarget, setEditTarget] = useState(null)
    const [form, setForm] = useState(BLANK_FORM)
    const [formLoading, setFormLoading] = useState(false)

    // Availability block date
    const [blockDate, setBlockDate] = useState('')

    // ── auth guard ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!token) navigate('/admin')
    }, [token])

    // ── api helpers ────────────────────────────────────────────────────────
    const apiHeaders = { 'Content-Type': 'application/json', 'x-admin-token': token }

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    const fetchBookings = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/bookings?status=${filter}`, { headers: apiHeaders })
            const data = await res.json()
            if (data.success) setBookings(data.data)
            else if (res.status === 401) { sessionStorage.clear(); navigate('/admin') }
        } catch { showToast('Failed to load bookings.', 'error') }
        finally { setLoading(false) }
    }, [filter])

    const fetchAvailability = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/availability', { headers: apiHeaders })
            const data = await res.json()
            if (data.success) setAvailability(data.data)
        } catch { }
    }, [])

    useEffect(() => { fetchBookings() }, [fetchBookings])
    useEffect(() => { fetchAvailability() }, [fetchAvailability])

    // ── booking actions ────────────────────────────────────────────────────
    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/admin/bookings/${id}`, {
                method: 'PUT', headers: apiHeaders, body: JSON.stringify({ status }),
            })
            const data = await res.json()
            if (data.success) { showToast(`Booking ${status}.`); fetchBookings(); fetchAvailability() }
            else showToast(data.message, 'error')
        } catch { showToast('Error updating booking.', 'error') }
    }

    const deleteBooking = async (id) => {
        if (!confirm('Delete this booking? This cannot be undone.')) return
        try {
            const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE', headers: apiHeaders })
            const data = await res.json()
            if (data.success) { showToast('Booking deleted.'); fetchBookings(); fetchAvailability() }
            else showToast(data.message, 'error')
        } catch { showToast('Error deleting.', 'error') }
    }

    const openEdit = (booking) => {
        setEditTarget(booking)
        setForm({
            name: booking.name || '',
            phone: booking.phone || '',
            email: booking.email || '',
            eventDate: booking.eventDate || '',
            eventType: booking.eventType || '',
            hall: booking.hall || 'Any Available',
            guests: booking.guests || '',
            message: booking.message || '',
            status: booking.status || 'pending',
        })
        setModal('edit')
    }

    const openAdd = () => {
        setForm(BLANK_FORM)
        setEditTarget(null)
        setModal('add')
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        try {
            const isEdit = modal === 'edit'
            const url = isEdit ? `/api/admin/bookings/${editTarget._id}` : '/api/admin/bookings'
            const method = isEdit ? 'PUT' : 'POST'
            const res = await fetch(url, { method, headers: apiHeaders, body: JSON.stringify(form) })
            const data = await res.json()
            if (data.success) {
                showToast(isEdit ? 'Booking updated.' : 'Booking added.')
                setModal(null)
                fetchBookings()
                fetchAvailability()
            } else {
                showToast(data.message, 'error')
            }
        } catch { showToast('Error saving booking.', 'error') }
        finally { setFormLoading(false) }
    }

    const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

    // ── availability actions ────────────────────────────────────────────────
    const toggleDate = async (date, currentStatus) => {
        const newStatus = currentStatus === 'booked' ? 'available' : 'booked'
        try {
            const res = await fetch('/api/admin/availability', {
                method: 'POST', headers: apiHeaders, body: JSON.stringify({ date, status: newStatus }),
            })
            const data = await res.json()
            if (data.success) { showToast(`Date ${newStatus}.`); fetchAvailability() }
            else showToast(data.message, 'error')
        } catch { showToast('Error updating date.', 'error') }
    }

    const blockManualDate = async () => {
        if (!blockDate) return
        try {
            const res = await fetch('/api/admin/availability', {
                method: 'POST', headers: apiHeaders, body: JSON.stringify({ date: blockDate, status: 'booked' }),
            })
            const data = await res.json()
            if (data.success) { showToast('Date blocked.'); setBlockDate(''); fetchAvailability() }
            else showToast(data.message, 'error')
        } catch { showToast('Error.', 'error') }
    }

    // ── counts for header ──────────────────────────────────────────────────
    const counts = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
    }, {})

    const today = new Date().toISOString().split('T')[0]

    // ── render ──────────────────────────────────────────────────────────────
    return (
        <div className="admin-wrap">

            {/* Toast */}
            {toast && (
                <div className={`admin-toast admin-toast--${toast.type}`}>
                    <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />
                    {toast.msg}
                </div>
            )}

            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">FALAK HALL</div>
                <div className="admin-sidebar-sub">Admin Dashboard</div>

                <nav className="admin-nav">
                    <button className={`admin-nav-item${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>
                        <i className="fas fa-calendar-check" /> Bookings
                    </button>
                    <button className={`admin-nav-item${tab === 'availability' ? ' active' : ''}`} onClick={() => setTab('availability')}>
                        <i className="fas fa-calendar-alt" /> Availability
                    </button>
                </nav>

                <div className="admin-sidebar-stats">
                    <div className="admin-stat-mini"><span>{bookings.length}</span>Total</div>
                    <div className="admin-stat-mini"><span style={{ color: '#ffc107' }}>{counts.pending || 0}</span>Pending</div>
                    <div className="admin-stat-mini"><span style={{ color: '#28a745' }}>{counts.approved || 0}</span>Approved</div>
                    <div className="admin-stat-mini"><span style={{ color: '#dc3545' }}>{counts.rejected || 0}</span>Rejected</div>
                </div>

                <button className="admin-logout" onClick={() => { sessionStorage.clear(); navigate('/admin') }}>
                    <i className="fas fa-sign-out-alt" /> Logout
                </button>

                <a href="/" className="admin-logout" style={{ textAlign: 'center', display: 'block', marginTop: 8, background: 'none', border: '1px solid var(--gold-border)', borderRadius: 4, padding: '10px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    ← View Website
                </a>
            </aside>

            {/* Mobile Nav Switcher — only visible on small screens */}
            <nav className="admin-mobile-nav">
                <button className={`admin-mobile-nav-item${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>
                    <i className="fas fa-calendar-check" /> Bookings
                </button>
                <button className={`admin-mobile-nav-item${tab === 'availability' ? ' active' : ''}`} onClick={() => setTab('availability')}>
                    <i className="fas fa-calendar-alt" /> Availability
                </button>
                <div style={{ flex: 1 }} />
                <button className="admin-mobile-nav-item" style={{ border: 'none' }} onClick={() => { sessionStorage.clear(); navigate('/admin') }}>
                    <i className="fas fa-sign-out-alt" style={{ color: '#dc3545' }} />
                </button>
            </nav>

            {/* Main */}
            <main className="admin-main">

                {/* ── BOOKINGS TAB ── */}
                {tab === 'bookings' && (
                    <>
                        <div className="admin-header">
                            <div>
                                <h1 className="admin-page-title">Bookings</h1>
                                <p className="admin-page-sub">Manage all booking requests and manual entries</p>
                            </div>
                            <button className="admin-btn-primary" onClick={openAdd}>
                                <i className="fas fa-plus" /> Add Manual Booking
                            </button>
                        </div>

                        {/* Filter tabs */}
                        <div className="admin-filters">
                            {['all', 'pending', 'approved', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    className={`admin-filter-btn${filter === f ? ' active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                    {f === 'pending' && counts.pending > 0 && (
                                        <span className="admin-badge">{counts.pending}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="admin-loading"><i className="fas fa-circle-notch fa-spin" /> Loading…</div>
                        ) : bookings.length === 0 ? (
                            <div className="admin-empty">
                                <i className="fas fa-inbox" />
                                <p>No bookings found</p>
                            </div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Event Date</th>
                                            <th>Event Type</th>
                                            <th>Guests</th>
                                            <th>Status</th>
                                            <th>Source</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(b => (
                                            <tr key={b._id}>
                                                <td>
                                                    <div className="admin-client-name">{b.name}</div>
                                                    <div className="admin-client-phone">{b.phone}</div>
                                                    {b.email && <div className="admin-client-phone">{b.email}</div>}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{b.eventDate}</div>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                        {b.hall}
                                                    </div>
                                                </td>
                                                <td>{b.eventType}</td>
                                                <td>{b.guests > 0 ? b.guests : '—'}</td>
                                                <td><StatusPill status={b.status} /></td>
                                                <td><SourcePill source={b.source} /></td>
                                                <td>
                                                    <div className="admin-actions">
                                                        {b.status === 'pending' && (
                                                            <>
                                                                <button className="admin-action-btn approve" title="Approve" onClick={() => updateStatus(b._id, 'approved')}>
                                                                    <i className="fas fa-check" />
                                                                </button>
                                                                <button className="admin-action-btn reject" title="Reject" onClick={() => updateStatus(b._id, 'rejected')}>
                                                                    <i className="fas fa-times" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {b.status !== 'pending' && (
                                                            <button className="admin-action-btn reset" title="Set Pending" onClick={() => updateStatus(b._id, 'pending')}>
                                                                <i className="fas fa-undo" />
                                                            </button>
                                                        )}
                                                        <button className="admin-action-btn edit" title="Edit" onClick={() => openEdit(b)}>
                                                            <i className="fas fa-edit" />
                                                        </button>
                                                        <button className="admin-action-btn delete" title="Delete" onClick={() => deleteBooking(b._id)}>
                                                            <i className="fas fa-trash" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Message preview below table if booking selected */}
                    </>
                )}

                {/* ── AVAILABILITY TAB ── */}
                {tab === 'availability' && (
                    <>
                        <div className="admin-header">
                            <div>
                                <h1 className="admin-page-title">Availability</h1>
                                <p className="admin-page-sub">Block or unblock dates manually</p>
                            </div>
                        </div>

                        {/* Block date form */}
                        <div className="admin-card" style={{ marginBottom: 32 }}>
                            <h3 className="admin-card-title">Block a Date Manually</h3>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <div className="admin-form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
                                    <label>Select Date</label>
                                    <input type="date" className="admin-input" min={today} value={blockDate} onChange={e => setBlockDate(e.target.value)} />
                                </div>
                                <button className="admin-btn-primary" onClick={blockManualDate} disabled={!blockDate}>
                                    <i className="fas fa-ban" /> Block Date
                                </button>
                            </div>
                        </div>

                        {/* Booked dates list */}
                        <div className="admin-card">
                            <h3 className="admin-card-title">All Blocked / Booked Dates</h3>
                            {availability.length === 0 ? (
                                <div className="admin-empty" style={{ padding: '40px 0' }}>
                                    <i className="fas fa-calendar-check" />
                                    <p>No dates blocked — all dates available</p>
                                </div>
                            ) : (
                                <div className="admin-date-list">
                                    {availability.sort((a, b) => a.date.localeCompare(b.date)).map(d => (
                                        <div className="admin-date-item" key={d.date}>
                                            <div>
                                                <span className="admin-date-val">{d.date}</span>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 10 }}>
                                                    {d.source === 'manual' ? 'Manually blocked' : 'From booking'}
                                                </span>
                                            </div>
                                            <button
                                                className="admin-action-btn approve"
                                                title="Unblock this date"
                                                onClick={() => toggleDate(d.date, 'booked')}
                                            >
                                                <i className="fas fa-lock-open" /> Unblock
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* ── MODAL: Add / Edit Booking ── */}
            {modal && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{modal === 'add' ? 'Add Manual Booking' : 'Edit Booking'}</h2>
                            <button className="admin-modal-close" onClick={() => setModal(null)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="admin-modal-body">
                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Full Name <span>*</span></label>
                                    <input className="admin-input" type="text" placeholder="Client name" value={form.name} onChange={e => setF('name', e.target.value)} required />
                                </div>
                                <div className="admin-form-group">
                                    <label>Phone <span>*</span></label>
                                    <input className="admin-input" type="tel" placeholder="03xx-xxxxxxx" value={form.phone} onChange={e => setF('phone', e.target.value)} required />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Email</label>
                                    <input className="admin-input" type="email" placeholder="Optional" value={form.email} onChange={e => setF('email', e.target.value)} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Event Date <span>*</span></label>
                                    <input className="admin-input" type="date" value={form.eventDate} onChange={e => setF('eventDate', e.target.value)} required />
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Event Type <span>*</span></label>
                                    <select className="admin-input" value={form.eventType} onChange={e => setF('eventType', e.target.value)} required>
                                        <option value="">Select type…</option>
                                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-group">
                                    <label>Hall</label>
                                    <select className="admin-input" value={form.hall} onChange={e => setF('hall', e.target.value)}>
                                        {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>Guests</label>
                                    <input className="admin-input" type="number" min="1" placeholder="500" value={form.guests} onChange={e => setF('guests', e.target.value)} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Status</label>
                                    <select className="admin-input" value={form.status} onChange={e => setF('status', e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Notes / Requirements</label>
                                <textarea className="admin-input" rows={3} placeholder="Any special requirements…" value={form.message} onChange={e => setF('message', e.target.value)} style={{ resize: 'vertical' }} />
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                                <button type="submit" className="admin-btn-primary" disabled={formLoading}>
                                    {formLoading
                                        ? <><i className="fas fa-circle-notch fa-spin" /> Saving…</>
                                        : <><i className="fas fa-save" /> {modal === 'add' ? 'Add Booking' : 'Save Changes'}</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
