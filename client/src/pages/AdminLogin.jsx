import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })
            const data = await res.json()
            if (data.success) {
                sessionStorage.setItem('adminToken', data.token)
                navigate('/admin/dashboard')
            } else {
                setError(data.message || 'Incorrect password.')
            }
        } catch {
            setError('Network error. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login-wrap">
            <div className="admin-login-card">
                <div className="admin-login-logo">FALAK HALL</div>
                <div className="admin-login-sub">Admin Dashboard</div>

                <form onSubmit={handleLogin}>
                    <div className="admin-form-group">
                        <label>Admin Password</label>
                        <input
                            type="password"
                            className="admin-input"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {error && <div className="admin-error">{error}</div>}
                    <button type="submit" className="admin-btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Verifying…' : 'Login to Dashboard'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <a href="/" style={{ color: 'var(--gold)', fontSize: '0.8rem', opacity: 0.7 }}>
                        ← Back to Website
                    </a>
                </div>
            </div>
        </div>
    )
}
