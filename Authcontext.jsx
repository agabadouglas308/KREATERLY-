import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        // Check active sessions and fetch user data
        const initializeAuth = async () => {
            try {
                setLoading(true)
                
                const { data: { session } } = await supabase.auth.getSession()
                
                if (session?.user) {
                    setUser(session.user)
                    await fetchUserProfile(session.user.id)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                setLoading(false)
            }
        }
        
        initializeAuth()
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUser(session.user)
                    await fetchUserProfile(session.user.id)
                } else {
                    setUser(null)
                    setProfile(null)
                }
            }
        )
        
        return () => subscription.unsubscribe()
    }, [])
    
    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
            
            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('Failed to load user profile')
        }
    }
    
    // Creator Registration
    const registerCreator = async ({ email, password, firstName, lastName, phone, socialHandle }) => {
        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone,
                        role: 'creator'
                    }
                }
            })
            
            if (authError) throw authError
            
            // 2. Create profile in profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    phone: `+256${phone}`,
                    social_handle: socialHandle,
                    role: 'creator',
                    balance: 0,
                    total_earnings: 0,
                    created_at: new Date().toISOString()
                })
            
            if (profileError) throw profileError
            
            toast.success('Account created successfully! Please check your email to verify.')
            return { success: true, user: authData.user }
        } catch (error) {
            console.error('Registration error:', error)
            toast.error(error.message || 'Registration failed')
            return { success: false, error }
        }
    }
    
    // Creator Login
    const loginCreator = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) throw error
            
            // Check if user is a creator
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()
            
            if (profile.role !== 'creator') {
                await supabase.auth.signOut()
                throw new Error('Access restricted to creators only')
            }
            
            toast.success('Logged in successfully!')
            return { success: true, user: data.user }
        } catch (error) {
            console.error('Login error:', error)
            toast.error(error.message || 'Login failed')
            return { success: false, error }
        }
    }
    
    // Admin Login
    const loginAdmin = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) throw error
            
            // Check if user is an admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()
            
            if (profile.role !== 'admin') {
                await supabase.auth.signOut()
                throw new Error('Admin access required')
            }
            
            toast.success('Admin logged in successfully!')
            return { success: true, user: data.user }
        } catch (error) {
            console.error('Admin login error:', error)
            toast.error(error.message || 'Admin login failed')
            return { success: false, error }
        }
    }
    
    // Logout
    const logout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success('Logged out successfully')
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Logout failed')
        }
    }
    
    // Password Reset
    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            
            if (error) throw error
            toast.success('Password reset email sent!')
            return { success: true }
        } catch (error) {
            console.error('Password reset error:', error)
            toast.error(error.message || 'Failed to send reset email')
            return { success: false, error }
        }
    }
    
    const value = {
        user,
        profile,
        loading,
        registerCreator,
        loginCreator,
        loginAdmin,
        logout,
        resetPassword
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}