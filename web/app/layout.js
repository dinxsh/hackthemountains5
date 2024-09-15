import { Poppins, Fira_Code } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata = {
  title: "ezlearn - Empowering Efficient Study",
  description: "Upload your PDF and start learning efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${firaCode.variable} font-sans antialiased`}
        style={{ backgroundColor: '#0a1520' }}
      >
        {children}
      </body>
    </html>
  );
}
