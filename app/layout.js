import { Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono } from 'next/font/google';
import './globals.css';

const sans = Atkinson_Hyperlegible_Next({ subsets: ['latin'], variable: '--font-sans' });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = { title: 'REFIX Cab Pooling' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
