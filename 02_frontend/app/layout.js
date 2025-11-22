import './globals.css'

export const metadata = {
  title: 'ShopHub - Product Management',
  description: 'Browse and manage products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}