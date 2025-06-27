import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  interval: string
  features: string[]
  jobsLimit: number
  highlighted?: boolean
  icon: React.ComponentType<any>
}

const tiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    interval: 'forever',
    jobsLimit: 10,
    icon: Star,
    features: [
      '10 verified jobs per month',
      'Basic trust score',
      'Public profile page',
      'Standard trust badge',
      'Email support'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for growing businesses',
    price: 9.99,
    interval: 'month',
    jobsLimit: 50,
    icon: Zap,
    highlighted: true,
    features: [
      '50 verified jobs per month',
      'Advanced trust metrics',
      'Priority verification',
      'Custom trust badge',
      'Review management tools',
      'SMS notifications',
      'Priority support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious professionals',
    price: 29.99,
    interval: 'month',
    jobsLimit: 200,
    icon: Crown,
    features: [
      '200 verified jobs per month',
      'Advanced analytics',
      'Bulk job verification',
      'White-label badge options',
      'API access',
      'Custom branding',
      'Dedicated account manager',
      'Phone support'
    ]
  }
]

export function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = (tierId: string) => {
    if (tierId === 'free') {
      toast.success('You\'re already on the free plan!')
      return
    }
    
    // This would integrate with Stripe
    toast.success(`Redirecting to checkout for ${tierId} plan...`)
    // window.location.href = `/checkout?plan=${tierId}&interval=${billingInterval}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Choose the plan that grows with your business
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingInterval === 'monthly'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingInterval === 'yearly'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly <span className="text-green-600 font-semibold">(Save 20%)</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                tier.highlighted
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                    tier.highlighted
                      ? 'bg-blue-500'
                      : 'bg-gray-100'
                  }`}>
                    <tier.icon className={`w-6 h-6 ${
                      tier.highlighted ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-gray-600 text-sm">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ${tier.price === 0 ? '0' : 
                        billingInterval === 'yearly' 
                          ? (tier.price * 12 * 0.8).toFixed(0)
                          : tier.price.toFixed(2)
                      }
                    </span>
                    {tier.price > 0 && (
                      <span className="text-gray-600 ml-2">
                        /{billingInterval === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {billingInterval === 'yearly' && tier.price > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save ${(tier.price * 12 * 0.2).toFixed(0)} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.id)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I exceed my job limit?
              </h3>
              <p className="text-gray-600 text-sm">
                You'll be notified when you're close to your limit. You can upgrade your plan or wait for the next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! All paid plans include a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How does job verification work?
              </h3>
              <p className="text-gray-600 text-sm">
                We send verification requests to your clients via SMS or email. Once confirmed, the job counts towards your trust score.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}