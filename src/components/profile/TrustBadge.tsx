import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { Star, Download, Copy, Shield, ExternalLink, Edit3 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface TrustBadgeProps {
  profile: {
    id: string
    business_name: string
    avg_rating: number
    trust_score: number
    verified_jobs: number
  }
  thankYouMessage?: string
}

export function TrustBadge({ profile, thankYouMessage }: TrustBadgeProps) {
  const [badgeStyle, setBadgeStyle] = useState<'compact' | 'detailed'>('compact')
  const [customMessage, setCustomMessage] = useState(thankYouMessage || '')
  const [editingMessage, setEditingMessage] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)

  const downloadBadge = async () => {
    if (!badgeRef.current) return

    try {
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: 'transparent',
        scale: 2
      })
      
      const link = document.createElement('a')
      link.download = `${profile.business_name.replace(/\s+/g, '-')}-trust-badge.png`
      link.href = canvas.toDataURL()
      link.click()
      
      toast.success('Badge downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download badge')
    }
  }

  const copyEmbedCode = () => {
    const profileUrl = `${window.location.origin}/profile/${profile.id}`
    const embedCode = `<a href="${profileUrl}" target="_blank" style="display: inline-block; padding: 16px; background: linear-gradient(135deg, #3fbf75 0%, #232c3e 100%); border-radius: 12px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; max-width: 200px; text-decoration: none;">
  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
    <span style="font-weight: bold; font-size: 18px;">${profile.avg_rating.toFixed(1)}</span>
  </div>
  <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${profile.business_name}</div>
  <div style="font-size: 12px; opacity: 0.9;">Verified on Trustdot</div>
</a>`

    navigator.clipboard.writeText(embedCode)
    toast.success('Embed code copied to clipboard!')
  }

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${profile.id}`
    navigator.clipboard.writeText(profileUrl)
    toast.success('Profile link copied to clipboard!')
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-300 fill-current' : 'text-white/30'
        }`}
      />
    ))
  }

  const getTrustLevel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Building'
  }

  return (
    <div className="space-y-6">
      {/* Badge Style Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-navy-700">Badge Style:</span>
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setBadgeStyle('compact')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                badgeStyle === 'compact'
                  ? 'bg-primary-500 text-white'
                  : 'text-navy-600 hover:text-navy-800'
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setBadgeStyle('detailed')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                badgeStyle === 'detailed'
                  ? 'bg-primary-500 text-white'
                  : 'text-navy-600 hover:text-navy-800'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setEditingMessage(!editingMessage)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-navy-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Custom Message
          </button>
          <button
            onClick={copyProfileLink}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-navy-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Profile Link
          </button>
        </div>
      </div>

      {/* Custom Message Editor */}
      {editingMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 rounded-xl p-4"
        >
          <h4 className="font-semibold text-primary-900 mb-3">Customize Thank You Message:</h4>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            placeholder="Enter a custom thank you message for your badge..."
          />
          <p className="text-sm text-primary-700 mt-2">
            This message will appear when customers interact with your badge
          </p>
        </motion.div>
      )}

      {/* Badge Preview */}
      <div className="flex flex-col items-center space-y-4">
        <div ref={badgeRef} className="inline-block">
          {badgeStyle === 'compact' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gradient-primary text-white p-4 rounded-xl shadow-lg max-w-xs text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="flex mr-2">{renderStars(Math.floor(profile.avg_rating))}</div>
                <span className="font-bold text-lg">{profile.avg_rating.toFixed(1)}</span>
              </div>
              <div className="font-semibold text-base mb-1">{profile.business_name}</div>
              <div className="text-sm opacity-90">Verified on Trustdot</div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-gray-200 p-6 rounded-xl shadow-lg max-w-sm"
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-3">
                  <img 
                    src="/logo.png" 
                    alt="Business Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg text-navy-800 mb-1">
                  {profile.business_name}
                </h3>
                <div className="flex items-center justify-center mb-2">
                  <div className="flex mr-2">{renderStars(Math.floor(profile.avg_rating))}</div>
                  <span className="font-semibold text-navy-800">{profile.avg_rating.toFixed(1)}/5</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-primary-600 text-lg">{profile.trust_score}</div>
                  <div className="text-navy-600">Trust Score</div>
                </div>
                <div>
                  <div className="font-bold text-primary-600 text-lg">{profile.verified_jobs}</div>
                  <div className="text-navy-600">Verified Jobs</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <div className="text-xs text-navy-500">Verified by</div>
                <div className="font-semibold text-navy-800">Trustdot</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={downloadBadge}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </button>
          <button
            onClick={copyEmbedCode}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Embed Code
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-primary-50 rounded-xl p-4 text-sm">
        <h4 className="font-semibold text-primary-900 mb-2">How to use your trust badge:</h4>
        <ul className="text-primary-800 space-y-1 list-disc list-inside">
          <li>Download the PNG image for social media profiles and marketing materials</li>
          <li>Use the embed code for websites and landing pages (links to your profile)</li>
          <li>Share your profile link to showcase your complete trust score</li>
          <li>Badge automatically updates as your rating improves</li>
        </ul>
      </div>
    </div>
  )
}