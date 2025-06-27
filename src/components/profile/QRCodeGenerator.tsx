import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { Download, Copy, QrCode, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface QRCodeGeneratorProps {
  vendorId: string
  businessName: string
  trustScore: number
}

export function QRCodeGenerator({ vendorId, businessName, trustScore }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const generateQRCode = async () => {
    setLoading(true)
    try {
      const ratingUrl = `${window.location.origin}/rate/${vendorId}`
      const qrDataUrl = await QRCode.toDataURL(ratingUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      toast.error('Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = async () => {
    if (!qrRef.current) return

    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: 'white',
        scale: 2
      })
      
      const link = document.createElement('a')
      link.download = `${businessName.replace(/\s+/g, '-')}-rating-qr.png`
      link.href = canvas.toDataURL()
      link.click()
      
      toast.success('QR code downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download QR code')
    }
  }

  const copyRatingUrl = () => {
    const ratingUrl = `${window.location.origin}/rate/${vendorId}`
    navigator.clipboard.writeText(ratingUrl)
    toast.success('Rating URL copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Rating QR Code</h3>
        <p className="text-gray-600">
          Share this QR code with customers so they can easily rate your service
        </p>
      </div>

      {!qrCodeUrl ? (
        <div className="text-center">
          <button
            onClick={generateQRCode}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <QrCode className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* QR Code Card */}
          <div className="flex justify-center">
            <div ref={qrRef} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-sm">
              <div className="mb-4">
                <img src={qrCodeUrl} alt="Rating QR Code" className="mx-auto rounded-lg" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-lg">{businessName}</h4>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-700">Trust Score: {trustScore}</span>
                </div>
                <p className="text-sm text-gray-600">Scan to rate this service</p>
                <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                  Powered by Trustdot
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download QR Code
            </button>
            <button
              onClick={copyRatingUrl}
              className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy Rating Link
            </button>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3">How to use your QR code:</h4>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Print and display the QR code at your service location
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Share it digitally via messaging apps or email
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Customers scan with their phone camera to rate your service
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Reviews automatically update your trust profile
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}