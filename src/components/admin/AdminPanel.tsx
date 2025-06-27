import React from 'react'
import { useAuth } from '../../hooks/useAuth'

const ADMIN_EMAILS = ['mahelishavanga@gmail.com'] // Add your admin email(s) here

export function AdminPanel() {
  const { user } = useAuth()

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-bold">
        Access Denied: Admins Only
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-navy-800">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <a href="/admin/vendors" className="bg-white rounded-xl shadow p-8 flex flex-col items-center hover:bg-emerald-50 transition">
          <span className="text-4xl mb-2">🏢</span>
          <span className="text-xl font-semibold">Vendor Management</span>
        </a>
      </div>
    </div>
  )
} 