import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      vendor_profiles: {
        Row: {
          id: string
          business_name: string
          service_type: string
          contact_phone: string | null
          trust_score: number
          total_jobs: number
          verified_jobs: number
          avg_rating: number
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          business_name: string
          service_type: string
          contact_phone?: string | null
          trust_score?: number
          total_jobs?: number
          verified_jobs?: number
          avg_rating?: number
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          service_type?: string
          contact_phone?: string | null
          trust_score?: number
          total_jobs?: number
          verified_jobs?: number
          avg_rating?: number
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          vendor_id: string
          job_id: string
          client_name: string
          client_contact: string
          service_type: string
          description: string | null
          status: string
          verification_sent_at: string | null
          verified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          job_id: string
          client_name: string
          client_contact: string
          service_type: string
          description?: string | null
          status?: string
          verification_sent_at?: string | null
          verified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          job_id?: string
          client_name?: string
          client_contact?: string
          service_type?: string
          description?: string | null
          status?: string
          verification_sent_at?: string | null
          verified_at?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          vendor_id: string
          job_id: string
          rating: number
          comment: string | null
          client_name: string
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          job_id: string
          rating: number
          comment?: string | null
          client_name: string
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          job_id?: string
          rating?: number
          comment?: string | null
          client_name?: string
          created_at?: string
        }
      }
    }
  }
}