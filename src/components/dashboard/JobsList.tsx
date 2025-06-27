import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'

interface Job {
  id: string
  job_id: string
  client_name: string
  service_type: string
  status: string
  created_at: string
  verified_at: string | null
}

export function JobsList() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchJobs()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('vendor_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-primary-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-primary-100 text-primary-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-navy-800">Recent Jobs</h3>
        <button className="text-primary-500 hover:text-primary-600 font-semibold text-sm">
          View All
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-navy-500">No jobs submitted yet</p>
          <p className="text-sm text-navy-400 mt-2">
            Start building your trust score by submitting your first job
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(job.status)}
                <div>
                  <h4 className="font-semibold text-navy-800">
                    Job #{job.job_id}
                  </h4>
                  <p className="text-sm text-navy-600">
                    {job.client_name} • {job.service_type}
                  </p>
                  <p className="text-xs text-navy-400 mt-1">
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}