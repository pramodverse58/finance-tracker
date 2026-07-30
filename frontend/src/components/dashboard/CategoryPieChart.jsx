import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '../../utils/format'

const COLORS = ['#D9A441', '#4FA37D', '#E2604F', '#6FA8DC', '#9B7FD4', '#E39ACB', '#7FBF7F', '#C4A35A']

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted text-sm">
        No expenses recorded this month yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} stroke="#0F1E26" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ background: '#152A33', border: '1px solid #2A4B54', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#EDF1F0' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#9FB3B8' }}
          formatter={(value) => <span style={{ color: '#9FB3B8' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
