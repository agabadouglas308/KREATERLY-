import { supabase, Tables } from './supabase'

export const paymentService = {
    // Get user payments
    async getUserPayments(userId) {
        try {
            const { data, error } = await supabase
                .from(Tables.PAYMENTS)
                .select(`
          *,
          submissions (
            campaigns (
              name
            )
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching payments:', error)
            return { success: false, error }
        }
    },
    
    // Get user balance
    async getUserBalance(userId) {
        try {
            const { data, error } = await supabase
                .from(Tables.PAYMENTS)
                .select('amount, status')
                .eq('user_id', userId)
            
            if (error) throw error
            
            const balance = data.reduce((total, payment) => {
                if (payment.status === 'completed') {
                    return total + payment.amount
                }
                return total
            }, 0)
            
            return { success: true, balance }
        } catch (error) {
            console.error('Error calculating balance:', error)
            return { success: false, error }
        }
    },
    
    // Request withdrawal
    async requestWithdrawal(userId, amount, mobileProvider, mobileNumber) {
        try {
            // Check if user has sufficient balance
            const { success, balance } = await this.getUserBalance(userId)
            if (!success || balance < amount) {
                throw new Error('Insufficient balance')
            }
            
            const { data, error } = await supabase
                .from(Tables.WITHDRAWALS)
                .insert([{
                    user_id: userId,
                    amount,
                    mobile_provider: mobileProvider,
                    mobile_number: mobileNumber,
                    status: 'pending',
                    requested_at: new Date().toISOString()
                }])
                .select()
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error requesting withdrawal:', error)
            return { success: false, error }
        }
    },
    
    // Get user withdrawals
    async getUserWithdrawals(userId) {
        try {
            const { data, error } = await supabase
                .from(Tables.WITHDRAWALS)
                .select('*')
                .eq('user_id', userId)
                .order('requested_at', { ascending: false })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching withdrawals:', error)
            return { success: false, error }
        }
    },
    
    // Get pending withdrawals (admin)
    async getPendingWithdrawals() {
        try {
            const { data, error } = await supabase
                .from(Tables.WITHDRAWALS)
                .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `)
                .eq('status', 'pending')
                .order('requested_at', { ascending: true })
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching pending withdrawals:', error)
            return { success: false, error }
        }
    },
    
    // Process withdrawal (admin)
    async processWithdrawal(withdrawalId, status, transactionId = null) {
        try {
            const updates = {
                status,
                processed_at: new Date().toISOString(),
                transaction_id: transactionId
            }
            
            const { data, error } = await supabase
                .from(Tables.WITHDRAWALS)
                .update(updates)
                .eq('id', withdrawalId)
                .select()
                .single()
            
            if (error) throw error
            return { success: true, data }
        } catch (error) {
            console.error('Error processing withdrawal:', error)
            return { success: false, error }
        }
    }
}