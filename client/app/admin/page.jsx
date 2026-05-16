'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

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
                login(data.token)
                router.push('/admin/dashboard')
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

                    {error ? <div className="admin-error"><i className="fas fa-exclamation-circle" /> {error}</div> : null}

                    <button
                        type="submit"
                        className={`admin-btn-primary${loading ? ' is-loading' : ''}`}
                        disabled={loading}
                    >
                        {loading
                            ? <><i className="fas fa-circle-notch fa-spin" /> Verifying…</>
                            : <><i className="fas fa-sign-in-alt" /> Login to Dashboard</>
                        }
                    </button>
                </form>

                <div className="admin-login-footer">
                    <Link href="/" className="admin-back-link">
                        <i className="fas fa-arrow-left" /> Back to Website
                    </Link>
                </div>
            </div>
        </div>
    )
}
