import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock, User, Phone, Briefcase, Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        const { error } = await signUp(email, password, {
          business_name: businessName,
          service_type: serviceType,
          contact_phone: contactPhone
        })
        if (error) throw error
        toast.success('Account created successfully!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img 
                src="/logo.png" 
                alt="Trustdot Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-navy-800 mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-navy-600">
              {mode === 'signin' 
                ? 'Sign in to your Trustdot account' 
                : 'Join thousands of trusted service providers'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Business Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your business name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Service Type
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="e.g., Food Delivery, Home Services, etc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-navy-600">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={onToggleMode}
                className="ml-2 text-primary-500 hover:text-primary-600 font-semibold"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}