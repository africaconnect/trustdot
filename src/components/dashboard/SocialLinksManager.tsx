import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Globe, 
  Save,
  X
} from 'lucide-react'

interface SocialLinksManagerProps {
  profile: any
  onUpdate: () => void
}

export function SocialLinksManager({ profile, onUpdate }: SocialLinksManagerProps) {
  const [socialLinks, setSocialLinks] = useState({
    instagram_url: profile?.instagram_url || '',
    facebook_url: profile?.facebook_url || '',
    twitter_url: profile?.twitter_url || '',
    website_url: profile?.website_url || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('vendor_profiles')
        .update(socialLinks)
        .eq('id', profile.id)

      if (error) throw error
      
      toast.success('Social links updated successfully!')
      onUpdate()
    } catch (error: any) {
      toast.error('Error updating social links: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const socialPlatforms = [
    {
      key: 'instagram_url',
      label: 'Instagram',
      icon: Instagram,
      placeholder: 'https://instagram.com/yourbusiness',
      color: 'text-pink-600'
    },
    {
      key: 'facebook_url',
      label: 'Facebook',
      icon: Facebook,
      placeholder: 'https://facebook.com/yourbusiness',
      color: 'text-blue-600'
    },
    {
      key: 'twitter_url',
      label: 'Twitter/X',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourbusiness',
      color: 'text-navy-800'
    },
    {
      key: 'website_url',
      label: 'Website',
      icon: Globe,
      placeholder: 'https://yourbusiness.com',
      color: 'text-primary-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-navy-800">Social Media Links</h3>
        <p className="text-sm text-navy-600">Help customers connect with you on social media</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialPlatforms.map((platform) => (
          <div key={platform.key}>
            <label className="block text-sm font-medium text-navy-700 mb-2">
              <div className="flex items-center">
                <platform.icon className={`w-4 h-4 mr-2 ${platform.color}`} />
                {platform.label}
              </div>
            </label>
            <div className="relative">
              <platform.icon className={`w-5 h-5 ${platform.color} absolute left-3 top-1/2 -translate-y-1/2`} />
              <input
                type="url"
                value={socialLinks[platform.key as keyof typeof socialLinks]}
                onChange={(e) => setSocialLinks(prev => ({
                  ...prev,
                  [platform.key]: e.target.value
                }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder={platform.placeholder}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Links'}
        </button>
      </div>

      <div className="bg-primary-50 rounded-xl p-4">
        <h4 className="font-semibold text-primary-900 mb-2">Benefits of adding social links:</h4>
        <ul className="text-primary-800 space-y-1 text-sm list-disc list-inside">
          <li>Customers can follow you for updates and promotions</li>
          <li>Build stronger relationships with your audience</li>
          <li>Increase your online presence and credibility</li>
          <li>Links appear on your public profile and rating page</li>
        </ul>
      </div>
    </motion.div>
  )
}