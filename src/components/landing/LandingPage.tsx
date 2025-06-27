import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Shield, 
  TrendingUp,
  Users,
  Award,
  Zap,
  Eye,
  BarChart3,
  Palette,
  Mail,
  Twitter,
  Linkedin,
  FileText,
  Lock
} from 'lucide-react'

export function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
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
              <span className="text-xl font-bold text-navy-800">Trustdot</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-navy-600 hover:text-navy-800 transition-colors">How it Works</a>
              <a href="#pricing" className="text-navy-600 hover:text-navy-800 transition-colors">Pricing</a>
              <Link 
                to="/auth" 
                className="gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-navy-800 mb-6 leading-tight">
                Build Trust.
                <span className="text-primary-500">
                  {' '}Win Customers.
                </span>
              </h1>
              <p className="text-xl text-navy-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Trustdot helps online vendors and service providers grow their reputation by collecting real reviews after each delivery or service. Your trust profile updates automatically with every job — giving new customers confidence to buy from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/auth"
                  className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-navy-300 text-navy-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-navy-400 hover:bg-navy-50 transition-all">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start mt-8 text-sm text-navy-500">
                <CheckCircle className="w-4 h-4 text-primary-500 mr-2" />
                Free forever plan • No credit card required
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 mr-4">
                    <img 
                      src="/logo.png" 
                      alt="Business Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-800">Mike's Delivery Service</h3>
                    <p className="text-navy-600 text-sm">Food Delivery • Member since 2024</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">94</div>
                    <div className="text-xs text-navy-500">Trust Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">127</div>
                    <div className="text-xs text-navy-500">Verified Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-yellow-600">4.8</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current ml-1" />
                    </div>
                    <div className="text-xs text-navy-500">Rating</div>
                  </div>
                </div>

                <div className="gradient-primary text-white p-4 rounded-xl text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Verified by Trustdot</span>
                  </div>
                  <div className="text-sm opacity-90">Trusted by 127 customers</div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg"
              >
                <CheckCircle className="w-6 h-6" />
              </motion.div>
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-yellow-400 text-white p-3 rounded-full shadow-lg"
              >
                <Star className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-navy-800 mb-4">How Trustdot Works</h2>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Building trust is simple. Complete jobs, get verified, earn reviews, and watch your reputation grow.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "01",
                title: "Submit a Job",
                description: "Add details about a completed delivery or service job to your Trustdot profile.",
                icon: Users,
                color: "primary"
              },
              {
                step: "02", 
                title: "Client Verifies",
                description: "We send a verification request to your client to confirm the job was completed.",
                icon: CheckCircle,
                color: "primary"
              },
              {
                step: "03",
                title: "Client Reviews",
                description: "Your satisfied client leaves a rating and review about their experience with you.",
                icon: Star,
                color: "yellow"
              },
              {
                step: "04",
                title: "Profile Updates",
                description: "Your trust score and public profile update automatically in real-time.",
                icon: TrendingUp,
                color: "navy"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 relative"
              >
                <div className="absolute -top-4 left-8">
                  <div className="gradient-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  item.color === 'primary' ? 'bg-primary-100' :
                  item.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-navy-100'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'primary' ? 'text-primary-600' :
                    item.color === 'yellow' ? 'text-yellow-600' :
                    'text-navy-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-navy-800 mb-3">{item.title}</h3>
                <p className="text-navy-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Trust Profile Preview */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-bold text-navy-800 mb-6">
                Your Professional Trust Profile
              </h2>
              <p className="text-xl text-navy-600 mb-8">
                Every verified job and review builds your public trust profile. 
                Share it with potential customers to win more business instantly.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: Shield, text: "Real-time trust score updates" },
                  { icon: Award, text: "Verified job completion badges" },
                  { icon: Star, text: "Authentic customer reviews" },
                  { icon: Eye, text: "Shareable public profile link" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <item.icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-navy-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/auth"
                className="inline-flex items-center gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                Create Your Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Trust Badge Preview */}
              <div className="gradient-primary text-white p-6 rounded-2xl shadow-2xl mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-xl">4.9</span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Sarah's Cleaning Service</div>
                  <div className="text-white/80 text-sm">Verified on Trustdot</div>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">98</div>
                    <div className="text-navy-600 text-sm">Trust Score</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">156</div>
                    <div className="text-navy-600 text-sm">Verified Jobs</div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-navy-500 mb-2">Recent Review</div>
                    <div className="text-navy-700 italic">"Excellent service, very professional!"</div>
                    <div className="text-sm text-navy-500 mt-1">- Jennifer M.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vendor Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-navy-800 mb-4">Why Service Providers Choose Trustdot</h2>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Join thousands of delivery riders and service vendors who are building trust and winning more customers.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: TrendingUp,
                title: "Increase Sales with Trust",
                description: "Customers are 3x more likely to choose service providers with verified trust profiles and positive reviews."
              },
              {
                icon: Zap,
                title: "Look Professional Instantly",
                description: "Get a professional online presence even without a website. Share your trust profile link anywhere."
              },
              {
                icon: BarChart3,
                title: "Earn Reviews Automatically",
                description: "Every verified job becomes an opportunity for a review. Build social proof with every completed task."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-navy-800 mb-4">{benefit.title}</h3>
                <p className="text-navy-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl font-bold text-navy-800 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-navy-600">Start free, upgrade when you're ready to scale</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div 
              {...fadeInUp}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-navy-800 mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-navy-800 mb-2">$0</div>
                <div className="text-navy-600">Forever free</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "10 verified jobs per month",
                  "Basic trust score",
                  "Public profile page", 
                  "Standard trust badge",
                  "Email support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary-500 mr-3" />
                    <span className="text-navy-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/auth"
                className="w-full bg-gray-200 text-navy-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-center block"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              {...fadeInUp}
              className="gradient-primary text-white rounded-2xl p-8 relative transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-400 text-navy-800 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold mb-2">$29</div>
                <div className="text-white/80">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited verified jobs",
                  "Advanced trust analytics",
                  "Priority verification",
                  "Custom badge design",
                  "Review management tools",
                  "API access",
                  "Priority support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-white/80 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to="/auth"
                className="w-full bg-white text-primary-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Start building trust with every job you complete
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of service providers who are already building their reputation and winning more customers with Trustdot.
            </p>
            <Link 
              to="/auth"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all group"
            >
              Create Your Trust Profile
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="mt-6 text-white/80 text-sm">
              Free forever • No credit card required • Setup in 2 minutes
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-3">
                  <img 
                    src="/logo.png" 
                    alt="Trustdot Logo" 
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
                <span className="text-xl font-bold">Trustdot</span>
              </div>
              <p className="text-navy-300 mb-6 max-w-md">
                Building trust between service providers and customers, one verified job at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-navy-300 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-navy-300 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-navy-300 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-navy-300">
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-navy-300">
                <li><a href="mailto:support@trustdot.com" className="hover:text-white transition-colors">support@trustdot.com</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Privacy Policy
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Terms of Service
                </a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-navy-700 mt-12 pt-8 text-center text-navy-300">
            <p>&copy; 2024 Trustdot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}