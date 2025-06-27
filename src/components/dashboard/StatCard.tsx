import { motion } from 'framer-motion'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'orange' | 'purple'
}

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-500 bg-blue-50',
    green: 'bg-green-500 text-green-500 bg-green-50',
    orange: 'bg-orange-500 text-orange-500 bg-orange-50',
    purple: 'bg-purple-500 text-purple-500 bg-purple-50'
  }

  const [bgColor, textColor, lightBg] = colorClasses[color].split(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${lightBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </motion.div>
  )
}