import { supabase, Tables } from './supabase'

export const campaignService = {
    // Get all active campaigns
    async getActiveCampaigns() {
        try {
            const { data, error } = await supabase
                .from(Tables.CAMPAIGNS)
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching campaigns:', error)
            return { success: false, error }
        }
    },
    
    // Get campaign by ID
    async getCampaignById(id) {
        try {
            const { data, error } = await supabase
                .from(Tables.CAMPAIGNS)
                .select('*')
                .eq('id', id)
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching campaign:', error)
            return { success: false, error }
        }
    },
    
    // Create new campaign (admin only)
    async createCampaign(campaignData) {
        try {
            const { data, error } = await supabase
                .from(Tables.CAMPAIGNS)
                .insert([{
                    ...campaignData,
                    status: 'active',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error creating campaign:', error)
            return { success: false, error }
        }
    },
    
    // Update campaign (admin only)
    async updateCampaign(id, updates) {
        try {
            const { data, error } = await supabase
                .from(Tables.CAMPAIGNS)
                .update(updates)
                .eq('id', id)
                .select()
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error updating campaign:', error)
            return { success: false, error }
        }
    },
    
    // Submit content for campaign
    async submitContent(submissionData, userId) {
        try {
            const { data, error } = await supabase
                .from(Tables.SUBMISSIONS)
                .insert([{
                    ...submissionData,
                    user_id: userId,
                    status: 'pending',
                    submitted_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error submitting content:', error)
            return { success: false, error }
        }
    },
    
    // Get user submissions
    async getUserSubmissions(userId) {
        try {
            const { data, error } = await supabase
                .from(Tables.SUBMISSIONS)
                .select(`
          *,
          campaigns (
            name,
            brand,
            budget_per_creator
          )
        `)
                .eq('user_id', userId)
                .order('submitted_at', { ascending: false })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching submissions:', error)
            return { success: false, error }
        }
    },
    
    // Get submissions for review (admin)
    async getSubmissionsForReview() {
        try {
            const { data, error } = await supabase
                .from(Tables.SUBMISSIONS)
                .select(`
          *,
          campaigns (
            name,
            brand
          ),
          profiles (
            first_name,
            last_name,
            email
          )
        `)
                .eq('status', 'pending')
                .order('submitted_at', { ascending: true })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching submissions for review:', error)
            return { success: false, error }
        }
    },
    
    // Review submission (admin)
    async reviewSubmission(submissionId, status, feedback = null) {
        try {
            const { data, error } = await supabase
                .from(Tables.SUBMISSIONS)
                .update({
                    status,
                    reviewed_at: new Date().toISOString(),
                    feedback
                })
                .eq('id', submissionId)
                .select()
                .single()
            
            if (error) throw error
            
            // If approved, create payment record
            if (status === 'approved') {
                const submission = await this.getSubmissionById(submissionId)
                if (submission.success) {
                    // Calculate payment amount (you might want to fetch from campaign)
                    const paymentAmount = 250000 // Example: UGX 250,000
                    await this.createPayment(submission.data.user_id, paymentAmount, submissionId)
                }
            }
            
            return { success: true, data }
        } catch (error) {
            console.error('Error reviewing submission:', error)
            return { success: false, error }
        }
    },
    
    // Helper methods
    async getSubmissionById(id) {
        try {
            const { data, error } = await supabase
                .from(Tables.SUBMISSIONS)
                .select('*')
                .eq('id', id)
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching submission:', error)
            return { success: false, error }
        }
    },
    
    async createPayment(userId, amount, submissionId) {
        try {
            const { data, error } = await supabase
                .from(Tables.PAYMENTS)
                .insert([{
                    user_id: userId,
                    amount,
                    submission_id: submissionId,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error creating payment:', error)
            return { success: false, error }
        }
    }
}