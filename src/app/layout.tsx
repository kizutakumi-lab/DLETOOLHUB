import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'DLE TOOL HUB | 社内ツールポータル',
  description: 'DLE社内で利用している各種Webツールを一元管理するポータルサイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
