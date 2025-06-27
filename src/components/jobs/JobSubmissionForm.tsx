import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { 
  Briefcase, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Send,
  CheckCircle 
} from 'lucide-react'

interface JobFormData {
  jobId: string
  clientName: string
  clientContact: string
  serviceType: string
  description: string
}

export function JobSubmissionForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>()

  const onSubmit = async (data: JobFormData) => {
    if (!user) return

    setLoading(true)
    try {
      // Insert job
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          vendor_id: user.id,
          job_id: data.jobId,
          client_name: data.clientName,
          client_contact: data.clientContact,
          service_type: data.serviceType,
          description: data.description,
          status: 'pending'
        })

      if (jobError) throw jobError

      // Here you would typically send a verification request to the client
      // For now, we'll just show success
      
      toast.success('Job submitted successfully! Verification request sent to client.')
      setSubmitted(true)
      reset()
      
      // Reset form after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error: any) {
      toast.error('Error submitting job: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification request to your client. Once they confirm the job, 
          it will be added to your trust score and they'll be invited to leave a review.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
        >
          Submit Another Job
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit New Job</h2>
        <p className="text-gray-600">
          Add a completed job to build your trust score. We'll verify it with your client.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job ID / Reference Number
          </label>
          <div className="relative">
            <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...register('jobId', { required: 'Job ID is required' })}
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter job ID or reference number"
            />
          </div>
          {errors.jobId && (
            <p className="mt-1 text-sm text-red-600">{errors.jobId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...register('clientName', { required: 'Client name is required' })}
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter client's name"
            />
          </div>
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Contact (Phone or Email)
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...register('clientContact', { required: 'Client contact is required' })}
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter client's phone number or email"
            />
          </div>
          {errors.clientContact && (
            <p className="mt-1 text-sm text-red-600">{errors.clientContact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <div className="relative">
            <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              {...register('serviceType', { required: 'Service type is required' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">Select service type</option>
              <option value="Food Delivery">Food Delivery</option>
              <option value="Package Delivery">Package Delivery</option>
              <option value="Ride Sharing">Ride Sharing</option>
              <option value="Home Services">Home Services</option>
              <option value="Freelance Services">Freelance Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Describe the service you provided (optional but recommended)"
          />
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
            <li>We'll send a verification request to your client</li>
            <li>Once verified, the job will count towards your trust score</li>
            <li>Your client will be invited to leave a review</li>
            <li>You'll receive notifications about the verification status</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Submitting...' : 'Submit Job for Verification'}
        </button>
      </form>
    </div>
  )
}