import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function AppLayout() {
  const { user, logout } = useAuth()
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-900 via-dark-900 to-[#1a1a2e]">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-dark-300/80 border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                QPlay Exams
              </span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {!user ? (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-primary-500/50">
                    Registro
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/categories" className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Categorías
                  </Link>
                  <Link to="/subjects" className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Materias
                  </Link>
                  <Link to="/recommend" className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Recomendar
                  </Link>
                  <Link to="/exams/generate" className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Generar
                  </Link>
                  <Link to="/exams/history" className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Historial
                  </Link>
                  <Link to="/profile" className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Perfil
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin/questions/pending" className="px-3 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-dark-200 rounded-lg transition-all">
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="px-3 py-2 text-sm font-medium text-dark-50 hover:text-white hover:bg-dark-200 rounded-lg transition-all">
                    Salir
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}