import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { TrustMeter } from '../dashboard/TrustMeter'
import { 
  Star, 
  CheckCircle, 
  MessageSquare,
  Send,
  Award,
  Heart,
  Copy,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  ExternalLink
} from 'lucide-react'

interface VendorProfile {
  id: string
  business_name: string
  service_type: string
  avg_rating: number
  total_jobs: number
  trust_score: number
  instagram_url?: string
  facebook_url?: string
  twitter_url?: string
  website_url?: string
}

export function VendorRatingPage() {
  const { vendorId } = useParams()
  
  const [vendor, setVendor] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Trust meter state
  const [trustLevel, setTrustLevel] = useState(2) // Default to "Good"

  const trustLevels = [
    { value: 0, label: 'Bad', emoji: '😞', color: '#EF4444' },
    { value: 1, label: 'Okay', emoji: '😐', color: '#F59E0B' },
    { value: 2, label: 'Good', emoji: '🙂', color: '#3fbf75' },
    { value: 3, label: 'Excellent', emoji: '🤩', color: '#232c3e' }
  ]

  useEffect(() => {
    if (vendorId) {
      fetchVendorData()
    }
  }, [vendorId])

  const fetchVendorData = async () => {
    try {
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', vendorId)
        .single()

      if (vendorError) throw vendorError
      setVendor(vendorData)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Unable to load vendor information')
    } finally {
      setLoading(false)
    }
  }

  const updateVendorStats = async () => {
    try {
      // Get all reviews for this vendor
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('vendor_id', vendorId)

      if (reviewsError) throw reviewsError

      const totalReviews = reviews.length
      const avgRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0

      // Calculate trust score based on rating and number of reviews
      const trustScore = Math.min(100, Math.round((avgRating / 5) * 100 * (1 + Math.log10(totalReviews + 1) / 2)))

      // Update vendor profile
      const { error: updateError } = await supabase
        .from('vendor_profiles')
        .update({
          total_jobs: totalReviews,
          verified_jobs: totalReviews, // For now, all reviews count as verified
          avg_rating: avgRating,
          trust_score: trustScore
        })
        .eq('id', vendorId)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error updating vendor stats:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    let imageUrl = null

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${vendorId}-${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage.from('review-images').upload(fileName, imageFile)
        if (error) throw error
        imageUrl = supabase.storage.from('review-images').getPublicUrl(fileName).publicUrl
      }
      const reviewData = {
        vendor_id: vendorId,
        job_id: null,
        rating,
        comment: comment.trim() || null,
        client_name: isAnonymous ? 'Anonymous' : 'Customer',
        image_url: imageUrl
      }

      const { error } = await supabase
        .from('reviews')
        .insert(reviewData)

      if (error) throw error

      // Update vendor statistics
      await updateVendorStats()

      setSubmitted(true)
      toast.success('Review submitted successfully!')
    } catch (error: any) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1
      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-10 h-10 transition-colors ${
              starValue <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 hover:text-yellow-200'
            }`}
          />
        </button>
      )
    })
  }

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${vendorId}`
    navigator.clipboard.writeText(profileUrl)
    toast.success('Profile link copied!')
  }

  const downloadBadge = () => {
    toast.success('Badge download started!')
  }

  const currentTrustLevel = trustLevels[trustLevel]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-800 mb-2">Vendor Not Found</h1>
          <p className="text-navy-600">The vendor you're trying to rate doesn't exist.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-navy-800 mb-4">Thank You!</h2>
          <p className="text-navy-600 mb-6 text-lg">
            Your review has been submitted successfully. It will help other customers make informed decisions.
          </p>
          
          <div className="bg-gray-100 rounded-xl p-6 mb-6">
            <div className="flex justify-center mb-3">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-navy-700 font-medium">
              You rated this experience as {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]} {currentTrustLevel.emoji}
            </p>
          </div>

          {/* Custom Thank You Message */}
          <div className="bg-primary-50 rounded-xl p-6 border-l-4 border-primary-500 mb-6">
            <div className="flex items-center mb-3">
              <Heart className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-semibold text-primary-900">Message from {vendor.business_name}</span>
            </div>
            <p className="text-primary-800 italic">
              "Thank you for choosing our service! 🙏 Your feedback helps us improve and serve you better. 💪"
            </p>
          </div>

          {/* Social Links */}
          {(vendor.instagram_url || vendor.facebook_url || vendor.twitter_url || vendor.website_url) && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-navy-800 mb-4">🎯 Want to follow this vendor?</h3>
              <div className="flex justify-center space-x-4">
                {vendor.instagram_url && (
                  <a
                    href={vendor.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                )}
                {vendor.facebook_url && (
                  <a
                    href={vendor.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </a>
                )}
                {vendor.twitter_url && (
                  <a
                    href={vendor.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </a>
                )}
                {vendor.website_url && (
                  <a
                    href={vendor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Sharing Options */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <h3 className="font-semibold text-navy-800 mb-4">✅ Want to support this business? Share their Trust Badge</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={copyProfileLink}
                className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Profile Link
              </button>
              <button
                onClick={downloadBadge}
                className="flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Badge
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Thank You Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="gradient-primary text-white rounded-2xl p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Thank you for choosing {vendor.business_name}!
            </h1>
            <p className="text-white/80 text-lg">
              We'd love to hear about your experience with our service. Your feedback helps us improve.
            </p>
          </div>
        </motion.div>

        {/* Vendor Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4">
            <img 
              src="/logo.png" 
              alt="Business Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Current Stats */}
          <div className="flex justify-center space-x-6 text-sm text-navy-600">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold">{vendor.avg_rating.toFixed(1)} rating</span>
            </div>
            <div>
              <span className="font-semibold">{vendor.total_jobs}</span> completed jobs
            </div>
          </div>
        </motion.div>

        {/* Trust Level Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8"
        >
          <h3 className="text-xl font-bold text-navy-800 mb-6 text-center">
            How would you rate your overall experience?
          </h3>
          
          <div className="space-y-6">
            {/* Trust Level Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustLevels.map((level, index) => (
                <button
                  key={index}
                  onClick={() => setTrustLevel(index)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    trustLevel === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{level.emoji}</div>
                  <div className={`font-semibold ${
                    trustLevel === index ? 'text-primary-900' : 'text-navy-700'
                  }`}>
                    {level.label}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-lg font-medium text-navy-700">
                Your trust meter level: <span style={{ color: currentTrustLevel.color }}>
                  {currentTrustLevel.label} {currentTrustLevel.emoji}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Rating Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-lg font-semibold text-navy-800 mb-4 text-center">
                Rate this service
              </label>
              <div className="flex justify-center space-x-2 mb-4">
                {renderStars()}
              </div>
              <p className="text-center text-sm text-navy-600">
                {rating > 0 && (
                  <span className="font-medium text-lg">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </span>
                )}
              </p>
            </div>

            {/* Feedback Text Area */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Tell us why you chose this rating (optional)
              </label>
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-navy-400 absolute left-3 top-3" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your experience..."
                />
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm font-medium text-navy-700">
                Submit anonymously
              </label>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Upload an image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setImagePreview(file ? URL.createObjectURL(file) : null);
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg max-h-40 mx-auto" />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {submitting ? 'Submitting Review...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}