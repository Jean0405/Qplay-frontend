import { useEffect, useState } from 'react'
import { questionsApi } from '../api/client.js'

export default function AdminPendingQuestions() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  function load() {
    setLoading(true)
    setError('')
    questionsApi
      .pending()
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function changeStatus(id, status) {
    try {
      await questionsApi.updateStatus(id, status)
      setSuccessMsg(`Pregunta ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`)
      setTimeout(() => setSuccessMsg(''), 3000)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const pendingCount = items.length

  if (loading && items.length === 0) {
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
          Preguntas Pendientes
        </h1>
        <p className="text-dark-50">Revisa y aprueba las preguntas sugeridas por los usuarios</p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{pendingCount}</div>
            <div className="text-sm text-dark-50">Preguntas pendientes de revisión</div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {items.length === 0 ? (
        <div className="bg-dark-200 border border-dark-100 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-dark-50 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">No hay preguntas pendientes</h3>
          <p className="text-dark-50">Todas las preguntas han sido revisadas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((q, index) => {
            const isExpanded = expandedId === q.id
            const date = new Date(q.createdAt)
            const options = [
              { letter: 'A', text: q.optionA, correct: q.correctOption === 'A' },
              { letter: 'B', text: q.optionB, correct: q.correctOption === 'B' },
              { letter: 'C', text: q.optionC, correct: q.correctOption === 'C' },
              { letter: 'D', text: q.optionD, correct: q.correctOption === 'D' }
            ]

            return (
              <div
                key={q.id}
                className="bg-dark-200 border border-dark-100 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all"
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-3">
                        {q.questionText}
                      </h3>
                      
                      {/* Info badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {q.userName}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {q.categoryName}
                        </span>
                        {q.subjectName && (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {q.subjectName}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-dark-300 text-dark-50 text-xs font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {date.toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors"
                      >
                        {isExpanded ? 'Ocultar opciones' : 'Ver opciones'}
                        <svg 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  {isExpanded && (
                    <div className="space-y-2 mb-4 pl-14 animate-fade-in">
                      {options.map((o) => (
                        <div
                          key={o.letter}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                            o.correct
                              ? 'border-emerald-500/50 bg-emerald-500/10'
                              : 'border-dark-100 bg-dark-300'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                            o.correct
                              ? 'bg-emerald-500 text-white'
                              : 'bg-dark-200 text-dark-50'
                          }`}>
                            {o.letter}
                          </div>
                          <span className={o.correct ? 'text-white font-medium flex-1' : 'text-dark-50 flex-1'}>
                            {o.text}
                          </span>
                          {o.correct && (
                            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Correcta
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pl-14">
                    <button
                      onClick={() => changeStatus(q.id, 'approved')}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Aprobar Pregunta
                    </button>
                    <button
                      onClick={() => changeStatus(q.id, 'rejected')}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Rechazar Pregunta
                    </button>
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