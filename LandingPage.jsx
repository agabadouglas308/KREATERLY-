import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Upload, DollarSign, Users, Shield, CheckCircle, 
  ArrowRight, Play, Star, ChevronRight 
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import LoginModal from '../components/auth/LoginForm'
import RegisterModal from '../components/auth/RegisterForm'

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload Videos',
      description: 'Submit your content directly through our platform with drag & drop.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Get Paid via Mobile Money',
      description: 'Receive payments directly to your MTN or Airtel Money account.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Connect with Brands',
      description: 'Work with Ugandan brands looking for authentic creator content.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Platform',
      description: 'Your data and payments are protected with enterprise security.'
    }
  ]

  const testimonials = [
    {
      name: 'Joseph Kato',
      role: 'YouTube Creator, Kampala',
      content: 'Kreaterly changed everything for me. Earned over UGX 2.5M in 6 months!',
      rating: 5
    },
    {
      name: 'Sarah Nakitto',
      role: 'TikTok Influencer, Jinja',
      content: 'Perfect for Ugandan creators. Payments via Airtel Money are instant!',
      rating: 5
    },
    {
      name: 'David Mugisha',
      role: 'Instagram Creator, Mbarara',
      content: 'Worked with 5 Ugandan brands and earned UGX 1.8M. Highly recommended!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full text-white font-bold mb-6">
                <span>MADE FOR UGANDA</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Monetize Your Creativity with{' '}
                <span className="text-purple-600">Ugandan Brands</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                Connect with brands, submit your content, and get paid via mobile money.
                Join thousands of Ugandan creators earning with Kreaterly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-shadow"
                >
                  Start Creating Now
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors"
                >
                  Sign In
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Free to Join</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Mobile Money Payments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">UG Brands Only</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Dashboard Preview */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-900 p-4 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-white font-medium">
                    Kreaterly Dashboard
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                      <p className="text-sm opacity-90">Available Balance</p>
                      <p className="text-2xl font-bold">UGX 245,000</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                      <p className="text-sm opacity-90">Active Campaigns</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Coca-Cola Summer Campaign</p>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      65% completed • UGX 500,000 per creator
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">Withdraw to Mobile Money</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold">M</span>
                      </div>
                      <div>
                        <p className="text-white">+256 772 XXX XXX</p>
                        <p className="text-gray-300 text-sm">Tap to withdraw</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-2">1,250+</p>
              <p className="text-gray-600">Ugandan Creators</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-2">UGX 48M+</p>
              <p className="text-gray-600">Paid to Creators</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-2">75+</p>
              <p className="text-gray-600">Ugandan Brands</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-purple-600 mb-2">98%</p>
              <p className="text-gray-600">Payment Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kreaterly provides Ugandan creators with the tools and opportunities to monetize their content effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Kreaterly Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start earning from your content in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up Free', desc: 'Create your free creator account' },
              { step: '2', title: 'Browse Campaigns', desc: 'Find brands that match your style' },
              { step: '3', title: 'Submit Content', desc: 'Upload videos for campaigns' },
              { step: '4', title: 'Get Paid', desc: 'Receive mobile money payments' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Ugandan Creators Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from creators who are already earning with Kreaterly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Monetize Your Creativity?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto">
            Join thousands of Ugandan content creators who are already earning with Kreaterly.
            Sign up free and start earning today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100"
            >
              Join Free Now
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10"
            >
              Sign In to App
            </button>
          </div>
          <p className="mt-8 text-sm text-purple-200">
            No credit card required • Free forever for creators
          </p>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
      
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  )
}

export default LandingPage