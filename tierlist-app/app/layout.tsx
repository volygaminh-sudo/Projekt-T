import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Liên Quân Tier List Maker | Projekt-T',
  description: 'Tạo bảng xếp hạng tướng Liên Quân Mobile theo ý muốn. Kéo thả, lọc vai trò, xuất ảnh PNG.',
  openGraph: {
    title: 'Liên Quân Tier List Maker',
    description: 'Drag-and-drop tier list builder cho 127 tướng Liên Quân Mobile',
    type: 'website',
  },
};

import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="vi" className={outfit.variable}>
        <body className={`${outfit.className} antialiased bg-gray-950`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
