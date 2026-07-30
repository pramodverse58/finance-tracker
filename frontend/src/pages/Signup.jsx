import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(fullName, email, password)
      navigate('/dashboard')
    } catch (err) {
      const fieldErrors = err.response?.data?.fieldErrors
      const firstFieldError = fieldErrors ? Object.values(fieldErrors)[0] : null
      setError(firstFieldError || err.response?.data?.error || 'Could not create account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-paper">Ledger</p>
          <p className="text-muted text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <p className="text-loss-400 text-sm bg-loss-500/10 border border-loss-500/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs text-muted mb-1" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
              placeholder="Jane Doe"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-800 border border-ink-600 rounded-md px-3 py-2 text-sm text-paper focus:border-gold-500 outline-none"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold-500 text-ink-950 font-medium text-sm rounded-md py-2 hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
