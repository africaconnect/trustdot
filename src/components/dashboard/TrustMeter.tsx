import { motion } from 'framer-motion'

interface TrustMeterProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function TrustMeter({ score, size = 'md', showLabel = true }: TrustMeterProps) {
  const radius = size === 'sm' ? 40 : size === 'md' ? 60 : 80
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return '#3fbf75' // primary green - Excellent
    if (score >= 60) return '#F59E0B' // yellow - Good
    return '#EF4444' // red - Needs Work
  }

  const getTrustLevel = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: '#3fbf75' }
    if (score >= 60) return { text: 'Good', color: '#F59E0B' }
    return { text: 'Needs Work', color: '#EF4444' }
  }

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const trustLevel = getTrustLevel(score)

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <motion.circle
            stroke={getColor(score)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className={`font-bold text-navy-800 ${textSizes[size]}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              {Math.round(score)}
            </motion.div>
            {size !== 'sm' && (
              <div className={`text-navy-500 font-medium ${labelSizes[size]}`}>
                TRUST SCORE
              </div>
            )}
          </div>
        </div>
      </div>
      {showLabel && size !== 'sm' && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className={`font-bold ${textSizes[size]}`} style={{ color: trustLevel.color }}>
            {trustLevel.text}
          </div>
          <div className={`text-navy-500 ${labelSizes[size]}`}>Trust Level</div>
        </motion.div>
      )}
    </div>
  )
}