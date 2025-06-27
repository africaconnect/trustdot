import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Star, MessageCircle, Filter, Calendar, ThumbsUp } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface Review {
  id: string
  rating: number
  comment: string | null
  client_name: string
  created_at: string
  image_url?: string | null
}

export function ReviewsList() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all')
  const [upvotes, setUpvotes] = useState<Record<string, number>>({})
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({})
  const [analytics, setAnalytics] = useState<{ positives: string[]; negatives: string[] }>({ positives: [], negatives: [] })
  const [limit, setLimit] = useState(6)
  const [hasMore, setHasMore] = useState(true)

  // Generate or get session ID
  useEffect(() => {
    let sessionId = localStorage.getItem('review_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem('review_session_id', sessionId)
    }
  }, [])

  useEffect(() => {
    if (user) {
      setLimit(6)
      fetchReviews(6, 0)
    }
  }, [user, dateFilter])

  useEffect(() => {
    if (reviews.length > 0) {
      fetchUpvotes()
    }
  }, [reviews])

  useEffect(() => {
    if (reviews.length > 0) {
      // Simple word frequency analysis
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'fast', 'friendly', 'helpful', 'professional', 'recommend']
      const negativeWords = ['bad', 'poor', 'slow', 'rude', 'unprofessional', 'late', 'disappoint', 'problem', 'issue', 'worst']
      const wordCounts: Record<string, number> = {}
      reviews.forEach(r => {
        if (r.comment) {
          r.comment.toLowerCase().split(/\W+/).forEach(word => {
            if (word) wordCounts[word] = (wordCounts[word] || 0) + 1
          })
        }
      })
      const positives = positiveWords.filter(w => wordCounts[w]).sort((a, b) => wordCounts[b] - wordCounts[a])
      const negatives = negativeWords.filter(w => wordCounts[w]).sort((a, b) => wordCounts[b] - wordCounts[a])
      setAnalytics({ positives, negatives })
    }
  }, [reviews])

  const fetchReviews = async (fetchLimit = limit, offset = 0) => {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('vendor_id', user?.id)
        .order('created_at', { ascending: false })

      // Apply date filter
      if (dateFilter === 'week') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        query = query.gte('created_at', weekAgo.toISOString())
      } else if (dateFilter === 'month') {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        query = query.gte('created_at', monthAgo.toISOString())
      }

      const { data, error } = await query.range(offset, offset + fetchLimit - 1)

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

  const handleLoadMore = () => {
    fetchReviews(limit, reviews.length)
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-navy-800">Recent Reviews</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'week' | 'month')}
              className="appearance-none bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">Last Month</option>
            </select>
            <Filter className="w-4 h-4 text-navy-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
            View All
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-navy-800 mb-2">Review Analytics</h4>
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="font-medium text-green-700">Most mentioned positives:</span>
            {analytics.positives.length > 0 ? (
              <ul className="list-disc ml-5 text-green-700">
                {analytics.positives.map(w => <li key={w}>{w}</li>)}
              </ul>
            ) : <span className="ml-2 text-gray-500">No strong positives yet</span>}
          </div>
          <div>
            <span className="font-medium text-red-700">Most mentioned negatives:</span>
            {analytics.negatives.length > 0 ? (
              <ul className="list-disc ml-5 text-red-700">
                {analytics.negatives.map(w => <li key={w}>{w}</li>)}
              </ul>
            ) : <span className="ml-2 text-gray-500">No strong negatives yet</span>}
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-navy-500">No reviews yet</p>
          <p className="text-sm text-navy-400 mt-2">
            Complete verified jobs to start receiving customer reviews
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-sm font-medium text-navy-800">
                    {review.rating}/5
                  </span>
                </div>
                <span className="text-xs text-navy-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-navy-600 mb-2 line-clamp-2">
                {review.comment || 'No comment provided'}
              </p>
              {review.image_url && (
                <img src={review.image_url} alt="Review" className="mt-2 rounded-lg max-h-32" />
              )}
              <p className="text-xs text-navy-500 font-medium">
                - {review.client_name}
              </p>
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
    </div>
  )
}