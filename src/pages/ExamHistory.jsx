import { useEffect, useState } from 'react'
import { examsApi } from '../api/client.js'
import { Link } from 'react-router-dom'

export default function ExamHistory() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, recent, older

  useEffect(() => {
    examsApi.history()
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Ordenar por fecha descendente
  const sortedItems = [...items].sort((a, b) => 
    new Date(b.takenAt) - new Date(a.takenAt)
  )

  const filteredItems = sortedItems.filter(exam => {
    if (filter === 'recent') {
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 7)
      return new Date(exam.takenAt) > dayAgo
    }
    if (filter === 'older') {
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 7)
      return new Date(exam.takenAt) <= dayAgo
    }
    return true
  })

  const totalExams = items.length
  const totalScore = items.reduce((sum, e) => sum + e.score, 0)
  const avgScore = items.length > 0 
    ? (totalScore / items.length).toFixed(1)
    : 0

  // Mejor examen
  const bestScore = items.length > 0 
    ? Math.max(...items.map(e => e.score))
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
          Historial de Exámenes
        </h1>
        <p className="text-dark-50">Revisa tu progreso y estadísticas</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalExams}</div>
              <div className="text-sm text-dark-50">Exámenes</div>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{avgScore}</div>
              <div className="text-sm text-dark-50">Promedio</div>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{bestScore}</div>
              <div className="text-sm text-dark-50">Mejor puntaje</div>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalScore}</div>
              <div className="text-sm text-dark-50">Puntos totales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filtrar por fecha</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-300 text-dark-50 hover:bg-dark-100 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'recent'
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-300 text-dark-50 hover:bg-dark-100 hover:text-white'
              }`}
            >
              Últimos 7 días
            </button>
            <button
              onClick={() => setFilter('older')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'older'
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-300 text-dark-50 hover:bg-dark-100 hover:text-white'
              }`}
            >
              Más antiguos
            </button>
          </div>
        </div>
      </div>

      {/* Exam List */}
      {filteredItems.length === 0 ? (
        <div className="bg-dark-200 border border-dark-100 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-dark-50 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">No hay exámenes</h3>
          <p className="text-dark-50 mb-6">
            {filter === 'all' 
              ? 'Aún no has realizado ningún examen' 
              : 'No hay exámenes en este periodo'}
          </p>
          <Link
            to="/exams/generate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Comenzar un examen
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((exam, index) => {
            const date = new Date(exam.takenAt)
            const isRecent = index === 0
            const scoreColor = exam.score >= 5 ? 'emerald' : exam.score >= 2 ? 'yellow' : 'red'

            return (
              <div
                key={exam.id}
                className="bg-dark-200 border border-dark-100 rounded-2xl p-6 hover:border-primary-500/50 transition-all"
              >
                <div className="flex items-center gap-6">
                  {/* Score Badge */}
                  <div className="flex-shrink-0">
                    <div className={`relative w-20 h-20 bg-${scoreColor}-500/20 rounded-2xl flex items-center justify-center border-2 border-${scoreColor}-500/30`}>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-${scoreColor}-400`}>
                          {exam.score}
                        </div>
                        <div className="text-xs text-dark-50">puntos</div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            Examen #{exam.id}
                          </h3>
                          {isRecent && (
                            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30">
                              Más reciente
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-dark-50">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {date.toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {date.toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <span className="flex items-center gap-2 ml-2 text-white font-medium">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {exam.score} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    <Link
                      to={`/exams/result/${exam.id}`}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}