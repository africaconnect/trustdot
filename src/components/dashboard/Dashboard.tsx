import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { TrustMeter } from './TrustMeter'
import { StatCard } from './StatCard'
import { JobsList } from './JobsList'
import { ReviewsList } from './ReviewsList'
import { QRCodeGenerator } from '../profile/QRCodeGenerator'
import { TrustBadge } from '../profile/TrustBadge'
import { SocialLinksManager } from './SocialLinksManager'
import { 
  Briefcase, 
  CheckCircle, 
  Star, 
  Calendar, 
  Plus,
  Bell,
  Settings,
  LogOut,
  Share2,
  QrCode,
  ExternalLink,
  Edit3,
  Award,
  Eye,
  Info,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Lock
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'

interface VendorProfile {
  id: string
  business_name: string
  service_type: string
  contact_phone: string | null
  trust_score: number
  total_jobs: number
  verified_jobs: number
  avg_rating: number
  subscription_tier: string
  created_at: string
  instagram_url?: string
  facebook_url?: string
  twitter_url?: string
  website_url?: string
  profile_image_url?: string | null
}

declare module '../../lib/supabase' {
  interface VendorProfile {
    profile_image_url?: string | null
  }
}

const ADMIN_EMAILS = ['mahelishavanga@gmail.com'] // Make sure this matches your admin panel

export function Dashboard() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showTrustBadge, setShowTrustBadge] = useState(false)
  const [showSocialLinks, setShowSocialLinks] = useState(false)
  const [thankYouMessage, setThankYouMessage] = useState('Thank you for choosing our service! 🙏 Your feedback helps us improve and serve you better. 💪')
  const [editingMessage, setEditingMessage] = useState(false)
  const [showMessagePreview, setShowMessagePreview] = useState(false)
  const [showTrustModal, setShowTrustModal] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        await createProfile()
      } else if (error) {
        throw error
      } else {
        setProfile(data)
      }
    } catch (error: any) {
      toast.error('Error loading profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async () => {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: selectError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (existingProfile) {
        // Profile already exists, do not insert again
        setProfile(existingProfile);
        return;
      }
      // If selectError is not the 'no rows' error, throw it
      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      const metadata = user?.user_metadata;
      const { error } = await supabase
        .from('vendor_profiles')
        .insert({
          id: user?.id,
          business_name: metadata?.business_name || 'My Business',
          service_type: metadata?.service_type || 'Other',
          contact_phone: metadata?.contact_phone || null
        });

      if (error) throw error;
      // Fetch the created profile
      await fetchProfile();
    } catch (error: any) {
      toast.error('Error creating profile: ' + error.message);
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    }
  }

  const copyRatingUrl = () => {
    const ratingUrl = `${window.location.origin}/rate/${user?.id}`
    navigator.clipboard.writeText(ratingUrl)
    toast.success('Customer rating link copied to clipboard!')
  }

  const saveThankYouMessage = () => {
    setEditingMessage(false)
    toast.success('Thank you message updated!')
  }

  const getTrustLevel = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-primary-600' }
    if (score >= 60) return { text: 'Good', color: 'text-yellow-600' }
    return { text: 'Needs Work', color: 'text-red-600' }
  }

  const verificationPercentage = profile?.total_jobs 
    ? Math.round((profile.verified_jobs / profile.total_jobs) * 100) 
    : 0

  const trustLevel = getTrustLevel(profile?.trust_score || 0)

  // Add mock data for demonstration
  const reviewTrends = [
    { date: '2024-06-01', avgRating: 4.2, reviewCount: 3, trustScore: 70, verifiedJobs: 2 },
    { date: '2024-06-08', avgRating: 4.5, reviewCount: 5, trustScore: 75, verifiedJobs: 4 },
    { date: '2024-06-15', avgRating: 4.7, reviewCount: 7, trustScore: 80, verifiedJobs: 6 },
    { date: '2024-06-22', avgRating: 4.6, reviewCount: 6, trustScore: 82, verifiedJobs: 5 },
  ]
  const feedbackHighlights = [
    { type: 'positive', comment: 'Excellent service, very professional!', client: 'Jane' },
    { type: 'negative', comment: 'Service was late, but quality was good.', client: 'John' },
  ]
  const strengths = ['professional', 'excellent', 'friendly']
  const improvements = ['late', 'slow']

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading profile...</div>;
  }

  const now = new Date()
  const memberSince = new Date(profile.created_at)
  const yearsOnPlatform = now.getFullYear() - memberSince.getFullYear()
  const badges = [
    {
      key: 'reviews10',
      label: '10 Reviews',
      description: 'Received 10 customer reviews',
      unlocked: profile!.total_jobs >= 10,
    },
    {
      key: 'reviews50',
      label: '50 Reviews',
      description: 'Received 50 customer reviews',
      unlocked: profile!.total_jobs >= 50,
    },
    {
      key: 'reviews100',
      label: '100 Reviews',
      description: 'Received 100 customer reviews',
      unlocked: profile!.total_jobs >= 100,
    },
    {
      key: 'rating4.5',
      label: 'Top Rated',
      description: 'Maintained a 4.5+ average rating',
      unlocked: profile!.avg_rating >= 4.5,
    },
    {
      key: 'trust90',
      label: 'Trust Champion',
      description: 'Achieved a 90%+ trust score',
      unlocked: profile!.trust_score >= 90,
    },
    {
      key: 'oneyear',
      label: '1 Year Member',
      description: 'Been on the platform for 1 year',
      unlocked: yearsOnPlatform >= 1,
    },
  ]

  const isAdmin = Boolean(user && user.email && ADMIN_EMAILS.includes(user.email as string))

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Panel Button */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-end">
          <a
            href="/admin"
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow hover:bg-emerald-700 transition"
          >
            Go to Admin Panel
          </a>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3">
                <img 
                  src="/logo.png" 
                  alt="Trustdot Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-navy-800">
                {profile?.business_name}
                {isAdmin && <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold align-middle">Admin</span>}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-navy-400 hover:text-navy-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowSocialLinks(!showSocialLinks)}
                className="p-2 text-navy-400 hover:text-navy-600 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 text-navy-400 hover:text-navy-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center mb-6 lg:mb-0">
                <div className="w-16 h-16 mr-6 relative group">
                  <img 
                    src={profile.profile_image_url || '/logo.png'}
                    alt="Business Logo" 
                    className="w-full h-full object-contain rounded-full border border-gray-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-1 cursor-pointer shadow-lg opacity-80 hover:opacity-100 transition-opacity" title="Upload profile image">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file || !user) return
                        setUploadingImage(true)
                        try {
                          const fileExt = file.name.split('.').pop()
                          const fileName = `${user.id}-profile.${fileExt}`
                          const { data, error } = await supabase.storage.from('profile-images').upload(fileName, file, { upsert: true })
                          if (error) throw error
                          const { publicUrl } = supabase.storage.from('profile-images').getPublicUrl(fileName).data
                          const imageUrl = publicUrl
                          const { error: updateError } = await supabase.from('vendor_profiles').update({ profile_image_url: imageUrl }).eq('id', user.id)
                          if (updateError) throw updateError
                          toast.success('Profile image updated!')
                          fetchProfile()
                        } catch (err) {
                          toast.error('Failed to upload image')
                        } finally {
                          setUploadingImage(false)
                        }
                      }}
                      disabled={uploadingImage}
                    />
                    <Edit3 className="w-4 h-4" />
                  </label>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-navy-800 mb-1">
                    {profile?.business_name}
                  </h2>
                  <p className="text-lg text-navy-600 mb-2">{profile?.service_type}</p>
                  <p className="text-sm text-navy-500">Free Plan • Member since {new Date(profile?.created_at || '').getFullYear()}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={copyRatingUrl}
                  className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Copy Customer Link
                </button>
                <button 
                  onClick={() => {
                    const profileUrl = `${window.location.origin}/profile/${profile.id}`
                    navigator.clipboard.writeText(profileUrl)
                    toast.success('Public profile link copied!')
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Copy Public Profile Link
                </button>
                <button 
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Download QR Code
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Links Manager */}
        {showSocialLinks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8"
          >
            <SocialLinksManager profile={profile} onUpdate={fetchProfile} />
          </motion.div>
        )}

        {/* QR Code Section */}
        {showQRCode && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8"
          >
            <QRCodeGenerator 
              vendorId={profile.id}
              businessName={profile.business_name}
              trustScore={profile.trust_score}
            />
          </motion.div>
        )}

        {/* Trust Score and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Trust Score */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-navy-800 mb-6 text-center">
              Your Trust Score
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrustMeter score={profile.trust_score} size="lg" />
              <button onClick={() => setShowTrustModal(true)} className="ml-2 text-blue-500 hover:text-blue-700" title="How is trust score calculated?">
                <Info className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${trustLevel.color}`}>
                {trustLevel.text}
              </div>
              <p className="text-sm text-navy-600">
                Your trust level based on verified jobs and customer reviews
              </p>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <h3 className="text-xl font-bold text-navy-800">Performance Overview</h3>
              <div className="ml-2 group relative">
                <Info className="w-4 h-4 text-navy-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Metrics update automatically with each review
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group relative">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {profile?.total_jobs || 0}
                </div>
                <p className="text-navy-600 text-sm">Total Jobs</p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Total number of jobs submitted
                </div>
              </div>
              <div className="text-center group relative">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {profile?.verified_jobs || 0}
                </div>
                <p className="text-navy-600 text-sm">Verified Jobs</p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Jobs confirmed by customers
                </div>
              </div>
              <div className="text-center group relative">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-yellow-600 mr-1">
                    {profile?.avg_rating ? profile.avg_rating.toFixed(1) : '0.0'}
                  </span>
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
                <p className="text-navy-600 text-sm">Rating</p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Average customer rating
                </div>
              </div>
              <div className="text-center group relative">
                <div className="text-3xl font-bold text-navy-600 mb-2">
                  {verificationPercentage}%
                </div>
                <p className="text-navy-600 text-sm">Verification Rate</p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Percentage of jobs verified by customers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-navy-800">Customer Thank You Message 💬</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowMessagePreview(!showMessagePreview)}
                className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={() => setEditingMessage(!editingMessage)}
                className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editingMessage ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
          
          {editingMessage ? (
            <div className="space-y-4">
              <textarea
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter your thank you message for customers..."
              />
              <button
                onClick={saveThankYouMessage}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Save Message
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-navy-700 italic">"{thankYouMessage}"</p>
            </div>
          )}

          {showMessagePreview && (
            <div className="mt-6 p-6 bg-primary-50 rounded-xl border-l-4 border-primary-500">
              <h4 className="font-semibold text-primary-900 mb-3">Customer Preview:</h4>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3">
                    <img 
                      src="/logo.png" 
                      alt="Business Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-semibold text-primary-900">Message from {profile?.business_name}</span>
                </div>
                <p className="text-primary-800 italic">"{thankYouMessage}"</p>
              </div>
            </div>
          )}
          
          <p className="text-sm text-navy-500 mt-4">
            This message will be shown to customers after they submit a review
          </p>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-navy-800">Shareable Trust Badge</h3>
            <button
              onClick={() => setShowTrustBadge(!showTrustBadge)}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Award className="w-4 h-4 mr-2" />
              {showTrustBadge ? 'Hide Badge' : 'Show Badge'}
            </button>
          </div>
          
          {showTrustBadge && profile && (
            <TrustBadge profile={profile} thankYouMessage={thankYouMessage} />
          )}
          
          {!showTrustBadge && (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-navy-500">Click "Show Badge" to view and download your trust badge</p>
            </div>
          )}
        </motion.div>

        {/* Badges & Achievements */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-navy-800">Badges & Achievements</h2>
          <div className="flex flex-wrap gap-6">
            {badges.map(badge => (
              <div key={badge.key} className="flex flex-col items-center group relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 border-2 ${badge.unlocked ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                  {badge.unlocked ? (
                    <Award className="w-8 h-8 text-green-600" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <span className={`text-sm font-semibold ${badge.unlocked ? 'text-green-700' : 'text-gray-400'}`}>{badge.label}</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <JobsList />
          <ReviewsList />
        </div>

        {/* Add Insights section after main stats/cards */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-navy-800">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating Over Time */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Average Rating Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={reviewTrends}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="avgRating" stroke="#3fbf75" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Review Volume Over Time */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Review Volume Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={reviewTrends}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Bar dataKey="reviewCount" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Verified Jobs Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Verified Jobs Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={reviewTrends}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Bar dataKey="verifiedJobs" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Trust Score Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Trust Score Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={reviewTrends}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="trustScore" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Feedback Highlights and Actionable Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Recent Feedback Highlights</h3>
              <ul>
                {feedbackHighlights.map((f, i) => (
                  <li key={i} className={`mb-3 p-3 rounded-lg ${f.type === 'positive' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="block font-medium">"{f.comment}"</span>
                    <span className="block text-xs mt-1">- {f.client}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">Actionable Insights</h3>
              <div className="mb-3">
                <span className="font-medium text-green-700">Strengths:</span>
                <ul className="list-disc ml-5 text-green-700">
                  {strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium text-red-700">Areas for Improvement:</span>
                <ul className="list-disc ml-5 text-red-700">
                  {improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTrustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 relative">
            <button onClick={() => setShowTrustModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">How is Trust Score Calculated?</h2>
            <p className="mb-3 text-gray-700">The Trust Score is a dynamic metric that reflects the reliability and reputation of a vendor based on:</p>
            <ul className="list-disc ml-6 mb-3 text-gray-700">
              <li><b>Average Rating:</b> Higher customer ratings increase your score.</li>
              <li><b>Number of Verified Jobs:</b> More completed and verified jobs boost your trust.</li>
              <li><b>Review Quality:</b> Detailed, positive reviews help more than short or negative ones.</li>
              <li><b>Recent Activity:</b> Consistent, recent positive feedback keeps your score high.</li>
            </ul>
            <p className="mb-2 text-gray-700">The formula is approximately:</p>
            <div className="bg-blue-50 rounded p-3 mb-3 text-blue-900 text-sm">
              Trust Score = (Average Rating / 5) × 100 × (1 + log₁₀(Total Reviews + 1) / 2)
            </div>
            <p className="text-gray-600 text-sm">Tip: Encourage customers to leave detailed, positive reviews and keep completing jobs to improve your score!</p>
          </div>
        </div>
      )}
    </div>
  )
}