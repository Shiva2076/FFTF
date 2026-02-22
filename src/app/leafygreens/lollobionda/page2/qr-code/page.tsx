'use client';

export default function QRCodePage() {
  const targetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/apps/leafygreens/lollobionda/page2`
    : 'https://innofarms.ai/apps/leafygreens/lollobionda/page2';

  // Generate QR code using a free API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}&format=png&margin=20`;

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'lollo-bionda-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        
        {/* Header */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">🌿</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Lollo Bionda QR Code
        </h1>
        
        <p className="text-gray-600 mb-8">
          Scan this QR code to open the Leafy Greens Overview page directly
        </p>

        {/* QR Code Display */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-4 border-green-200">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for Leafy Greens Overview"
            className="w-full max-w-xs mx-auto"
          />
        </div>

        {/* Target URL */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800 font-medium mb-1">Opens to:</p>
          <p className="text-blue-600 text-sm break-all">
            {targetUrl}
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadQRCode}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Code
        </button>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">How to use:</h3>
          <ul className="text-yellow-700 text-sm text-left space-y-1">
            <li>• Download the QR code image</li>
            <li>• Print it or share digitally</li>
            <li>• When scanned, it opens the Leafy Greens page directly</li>
            <li>• No need to visit homepage first</li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <a 
            href="/apps/leafy-greens-overview"
            className="text-blue-500 hover:text-blue-600 font-medium text-sm"
          >
            ← Back to Leafy Greens Overview
          </a>
        </div>
      </div>
    </div>
  );
}