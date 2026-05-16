import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Lazy load pages for performance (react-best-practices: bundle-dynamic-imports)
const Home = lazy(() => import('./pages/Home'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Blog = lazy(() => import('./pages/Blog'))

import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

// Protect admin dashboard — redirect to login if no session token
function AdminGuard() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          {/* Global Loader for initial mount if needed */}
          <Loader />
          <ScrollToTop />
          
          {/* Suspense boundary for lazy-loaded routes */}
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

              {/* Admin routes — no Navbar/Footer */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminGuard />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
