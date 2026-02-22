import './globals.css';
import Providers from "./providers";
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'INNOFarms.AI',
  description: 'Agricultural IoT and Vertical Farming Solutions',
  icons: {
    icon: [
      { url: '/Logomark - Green.svg', type: 'image/svg+xml' },
      { url: '/Logomark - Green.svg', sizes: '64x64', type: 'image/png' },
      { url: '/Logomark - Green.svg', sizes: '128x128', type: 'image/png' },
      { url: '/Logomark - Green.svg', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        
        {/* Calendly CSS */}
        <link 
          href="https://assets.calendly.com/assets/external/widget.css" 
          rel="stylesheet"
        />
      </head>
      
      <body>
        <Providers>
          {children}
        </Providers>

        {/* Google Analytics - runs after page is interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YNF7TZ141Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YNF7TZ141Z');
          `}
        </Script>

        {/* Calendly Script - loads when needed */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}