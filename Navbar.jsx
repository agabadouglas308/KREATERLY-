import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Video, User, LogOut, Dashboard } from 'lucide-react'

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, profile, logout } = useAuth()
    const navigate = useNavigate()
    
    const handleLogout = async () => {
        await logout()
        navigate('/')
    }
    
    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kreaterly</h1>
              <p className="text-xs text-gray-500 -mt-1">Ugandan Creator Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {profile?.role === 'creator' && (
                  <>
                    <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 font-medium">
                      Dashboard
                    </Link>
                    <Link to="/campaigns" className="text-gray-600 hover:text-purple-600 font-medium">
                      Campaigns
                    </Link>
                  </>
                )}
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-purple-600 font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{profile?.first_name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/#features" className="text-gray-600 hover:text-purple-600 font-medium">
                  Features
                </Link>
                <Link to="/#campaigns" className="text-gray-600 hover:text-purple-600 font-medium">
                  Campaigns
                </Link>
                <Link to="/#testimonials" className="text-gray-600 hover:text-purple-600 font-medium">
                  Testimonials
                </Link>
                <div className="flex items-center space-x-4">
                  <Link to="/" className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
                    Login
                  </Link>
                  <Link to="/" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Join Free
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  {profile?.role === 'creator' && (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Dashboard className="w-5 h-5 mr-3" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/campaigns" 
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Video className="w-5 h-5 mr-3" />
                        Campaigns
                      </Link>
                    </>
                  )}
                  {profile?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center px-4 py-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Dashboard className="w-5 h-5 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center px-4 py-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{profile?.first_name || 'User'}</p>
                        <p className="text-sm text-gray-500 capitalize">{profile?.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-3 mt-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/#features" 
                    className="px-4 py-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    to="/#campaigns" 
                    className="px-4 py-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Campaigns
                  </Link>
                  <Link 
                    to="/#testimonials" 
                    className="px-4 py-2 text-gray-600 hover:bg-purple-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Link 
                      to="/" 
                      className="block px-4 py-3 border-2 border-purple-600 text-purple-600 text-center rounded-lg hover:bg-purple-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/" 
                      className="block px-4 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Join Free
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    )
}

export default Navbar