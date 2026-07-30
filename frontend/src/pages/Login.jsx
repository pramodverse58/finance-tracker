import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not sign in. Check your details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-paper">Ledger</p>
          <p className="text-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs text-muted mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold-500 text-ink-950 font-medium text-sm rounded-md py-2 hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          New here?{' '}
          <Link to="/signup" className="text-gold-400 hover:text-gold-300">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
