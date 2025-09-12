import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aadhaar Card Generator',
  description: 'Generate sample Aadhaar cards for educational purposes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}