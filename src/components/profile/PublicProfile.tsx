import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { TrustMeter } from '../dashboard/TrustMeter'
import { TrustBadge } from './TrustBadge'
import { 
  Star, 
  CheckCircle, 
  Calendar,
  Phone,
  MapPin,
  Award,
  Share2,
  Copy,
  MessageCircle,
  ExternalLink,
  ThumbsUp,
  Info
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

interface VendorProfile {
  id: string
  business_name: string
  service_type: string
  contact_phone: string | null
  trust_score: number
  total_jobs: number
  verified_jobs: number
  avg_rating: number
  created_at: string
  profile_image_url?: string | null
}

interface Review {
  id: string
  rating: number
  comment: string | null
  client_name: string
  created_at: string
  image_url?: string | null
}

export function PublicProfile() {
  const { vendorId } = useParams()
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [upvotes, setUpvotes] = useState<Record<string, number>>({})
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({})
  const [showTrustModal, setShowTrustModal] = useState(false)
  const [limit, setLimit] = useState(6)
  const [hasMore, setHasMore] = useState(true)
  const [badges, setBadges] = useState<any[]>([])

  useEffect(() => {
    if (vendorId) {
      fetchProfile()
      setLimit(6)
      fetchReviews(6, 0)
    }
  }, [vendorId])

  // Generate or get session ID
  useEffect(() => {
    let sessionId = localStorage.getItem('review_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem('review_session_id', sessionId)
    }
  }, [])

  useEffect(() => {
    if (reviews.length > 0) {
      fetchUpvotes()
    }
  }, [reviews])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', vendorId)
        .single()

      if (error) throw error
      setProfile(data)

      // Calculate badges after profile is set
      const now = new Date()
      const memberSince = new Date(data.created_at)
      const yearsOnPlatform = now.getFullYear() - memberSince.getFullYear()
      const calculatedBadges = [
        {
          key: 'reviews10',
          label: '10 Reviews',
          description: 'Received 10 customer reviews',
          unlocked: data.total_jobs >= 10,
          icon: '⭐',
          color: 'from-yellow-400 to-orange-500'
        },
        {
          key: 'reviews50',
          label: '50 Reviews',
          description: 'Received 50 customer reviews',
          unlocked: data.total_jobs >= 50,
          icon: '🏆',
          color: 'from-purple-400 to-pink-500'
        },
        {
          key: 'reviews100',
          label: '100 Reviews',
          description: 'Received 100 customer reviews',
          unlocked: data.total_jobs >= 100,
          icon: '👑',
          color: 'from-indigo-400 to-purple-500'
        },
        {
          key: 'rating4.5',
          label: 'Top Rated',
          description: 'Maintained a 4.5+ average rating',
          unlocked: data.avg_rating >= 4.5,
          icon: '🌟',
          color: 'from-green-400 to-emerald-500'
        },
        {
          key: 'trust90',
          label: 'Trust Champion',
          description: 'Achieved a 90%+ trust score',
          unlocked: data.trust_score >= 90,
          icon: '💎',
          color: 'from-blue-400 to-cyan-500'
        },
        {
          key: 'oneyear',
          label: '1 Year Member',
          description: 'Been on the platform for 1 year',
          unlocked: yearsOnPlatform >= 1,
          icon: '🎉',
          color: 'from-red-400 to-pink-500'
        },
      ]
      setBadges(calculatedBadges)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Profile not found')
    }
  }

  const fetchReviews = async (fetchLimit = limit, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + fetchLimit - 1)
      if (error) throw error
      if (offset === 0) {
        setReviews(data || [])
      } else {
        setReviews(prev => [...prev, ...(data || [])])
      }
      setHasMore((data?.length || 0) === fetchLimit)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpvotes = async () => {
    const sessionId = localStorage.getItem('review_session_id') || ''
    const reviewIds = reviews.map(r => r.id)
    const { data, error } = await supabase
      .from('review_upvotes')
      .select('review_id, session_id')
      .in('review_id', reviewIds)
    if (!error && data) {
      const upvoteCounts: Record<string, number> = {}
      const upvotedMap: Record<string, boolean> = {}
      reviewIds.forEach(id => {
        upvoteCounts[id] = data.filter(d => d.review_id === id).length
        upvotedMap[id] = data.some(d => d.review_id === id && d.session_id === sessionId)
      })
      setUpvotes(upvoteCounts)
      setUpvoted(upvotedMap)
    }
  }

  const handleUpvote = async (reviewId: string) => {
    const sessionId = localStorage.getItem('review_session_id') || ''
    const { error } = await supabase.from('review_upvotes').insert({ review_id: reviewId, session_id: sessionId })
    if (!error) {
      setUpvotes(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }))
      setUpvoted(prev => ({ ...prev, [reviewId]: true }))
    }
  }

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Profile URL copied to clipboard!')
  }

  const copyRatingUrl = () => {
    const ratingUrl = `${window.location.origin}/rate/${vendorId}`
    navigator.clipboard.writeText(ratingUrl)
    toast.success('Rating URL copied to clipboard!')
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const verificationPercentage = profile?.total_jobs 
    ? Math.round((profile.verified_jobs / profile.total_jobs) * 100) 
    : 0

  const handleLoadMore = () => {
    fetchReviews(limit, reviews.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">The vendor profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Vendor Logo" className="w-full h-full object-cover" />
              ) : (
                <Award className="w-12 h-12 text-white" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{profile.business_name}</h1>
            <p className="text-xl text-blue-100 mb-6">{profile.service_type}</p>
            <div className="flex items-center justify-center space-x-6 text-sm mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Member since {new Date(profile.created_at).getFullYear()}
              </div>
              {profile.contact_phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {profile.contact_phone}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/rate/${vendorId}`}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <Star className="w-5 h-5 mr-2" />
                Rate This Service
              </Link>
              <button
                onClick={copyRatingUrl}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Rating Link
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-400 to-slate-800 text-white rounded-2xl p-8 shadow-lg flex flex-col items-center border-4 border-emerald-200/40 relative"
        >
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md border-2 border-emerald-400">
            <Star className="w-8 h-8 text-emerald-400 drop-shadow" />
          </div>
          <div className="mt-6 mb-2 text-xl font-bold tracking-wide">Trust Badge</div>
          <div className="flex items-center space-x-3 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 drop-shadow ${i < Math.round(profile.avg_rating) ? 'text-yellow-300' : 'text-white/30'}`}
              />
            ))}
            <span className="text-4xl font-extrabold ml-2">{profile.avg_rating.toFixed(1)}</span>
            <span className="text-lg font-semibold opacity-80">/ 5</span>
          </div>
          <div className="text-base opacity-90">Based on customer reviews</div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Achievements & Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 border-2 shadow-lg ${
                    badge.unlocked 
                      ? `bg-gradient-to-br ${badge.color} border-white shadow-lg` 
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                </motion.div>
                <span className={`text-xs font-semibold text-center ${badge.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                  {badge.label}
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {badge.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews ({reviews.length})
            </h2>
            <Link
              to={`/rate/${vendorId}`}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Leave a Review
            </Link>
          </div>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No reviews yet</p>
              <Link
                to={`/rate/${vendorId}`}
                className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                <Star className="w-5 h-5 mr-2" />
                Be the First to Review
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.client_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.client_name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-600">{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  )}
                  {review.image_url && (
                    <img src={review.image_url} alt="Review" className="mt-4 rounded-lg max-h-48 w-full object-cover" />
                  )}
                  <div className="flex items-center mt-2">
                    <button
                      className={`flex items-center px-2 py-1 rounded text-sm ${upvoted[review.id] ? 'bg-green-100 text-green-600 cursor-not-allowed' : 'bg-gray-100 text-gray-600 hover:bg-green-50'}`}
                      onClick={() => handleUpvote(review.id)}
                      disabled={upvoted[review.id]}
                      title={upvoted[review.id] ? 'You already upvoted' : 'Upvote this review'}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {upvotes[review.id] || 0}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {hasMore && reviews.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </motion.div>
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