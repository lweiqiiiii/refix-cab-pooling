import './globals.css';

export const metadata = { title: 'Cab Pool Grouping' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
