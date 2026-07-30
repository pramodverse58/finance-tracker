import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', glyph: '01' },
  { to: '/transactions', label: 'Transactions', glyph: '02' },
  { to: '/budgets', label: 'Budgets', glyph: '03' },
  { to: '/reports', label: 'Reports', glyph: '04' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-ink-950 text-paper font-body flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-ink-700 flex flex-col">
        <div className="px-6 py-6 border-b border-ink-700">
          <p className="font-display text-xl tracking-tight text-paper">Ledger</p>
          <p className="text-xs text-muted mt-1">personal finance, kept plainly</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-ink-800 text-gold-400'
                    : 'text-muted hover:bg-ink-900 hover:text-paper'
                }`
              }
            >
              <span className="font-mono text-xs text-muted">{item.glyph}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-ink-700">
          <p className="text-sm text-paper truncate">{user?.fullName}</p>
          <p className="text-xs text-muted truncate mb-3">{user?.email}</p>
          <button
            onClick={logout}
            className="w-full text-left text-xs text-loss-400 hover:text-loss-500 transition-colors"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
