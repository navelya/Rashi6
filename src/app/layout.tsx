import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rashi6 — וילה יוקרתית בנתניה | Luxury Villa in Netanya',
  description: 'וילה מפנקת עם ג\'קוזי פרטי, 4 חדרי שינה, גינה פרטית ו-2 קומות בנתניה. Stunning private villa with jacuzzi, 4 bedrooms and private garden in Netanya, Israel.',
  keywords: 'וילה נתניה, villa netanya, rashi6, jacuzzi, private villa israel, vacation rental netanya',
  openGraph: {
    title: 'Rashi6 — וילה יוקרתית בנתניה',
    description: 'וילה מפנקת עם ג\'קוזי פרטי ו-4 חדרי שינה בנתניה',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
