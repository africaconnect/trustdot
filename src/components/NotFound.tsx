import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <Link to="/" className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">
        Go Home
      </Link>
    </div>
  )
} 