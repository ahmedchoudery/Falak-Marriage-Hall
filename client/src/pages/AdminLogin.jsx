import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
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
                body: JSON.stringify({ username, password }),
            })
            const data = await res.json()
            if (data.success) {
                sessionStorage.setItem('adminToken', data.token)
                navigate('/admin/dashboard')
            } else {
                setError(data.message || 'Invalid credentials.')
            }
        } catch {
            setError('Network error. Please try again.')
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
                        <label>Username</label>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoFocus
                            autoComplete="username"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="admin-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <div className="admin-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

                    <button
                        type="submit"
                        className={`admin-btn-primary${loading ? ' is-loading' : ''}`}
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                    >
                        {loading
                            ? <><i className="fas fa-circle-notch fa-spin" /> Verifying…</>
                            : <><i className="fas fa-sign-in-alt" /> Login to Dashboard</>
                        }
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--gold-border)' }}>
                    <a href="/" style={{ color: 'var(--gold)', fontSize: '0.8rem', opacity: 0.6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <i className="fas fa-arrow-left" style={{ fontSize: '0.7rem' }} /> Back to Website
                    </a>
                </div>
            </div>
        </div>
    )
}