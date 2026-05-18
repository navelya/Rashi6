import type { Metadata } from 'next';
import './themes.css';

export const metadata: Metadata = {
  title: 'Rashi6 Villa — Redesign Preview',
  description: 'Preview of the new Rashi6 villa landing page redesign.',
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
