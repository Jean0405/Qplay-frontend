import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}