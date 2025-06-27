import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Vendor {
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
  email?: string
  status?: string
}

export function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('vendor_profiles').select('*')
    if (!error && data) setVendors(data)
    setLoading(false)
  }

  const filtered = vendors.filter(v =>
    v.business_name.toLowerCase().includes(search.toLowerCase()) ||
    (v.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-navy-800">Vendor Management</h1>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Business Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Total Jobs</th>
              <th className="p-3 text-left">Avg Rating</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No vendors found.</td></tr>
            ) : filtered.map(vendor => (
              <tr key={vendor.id} className="border-b hover:bg-emerald-50 transition">
                <td className="p-3 font-semibold">{vendor.business_name}</td>
                <td className="p-3">{vendor.email || '-'}</td>
                <td className="p-3">{vendor.status || 'active'}</td>
                <td className="p-3">{vendor.total_jobs}</td>
                <td className="p-3">{vendor.avg_rating?.toFixed(2)}</td>
                <td className="p-3 space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">View</button>
                  <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Suspend</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 