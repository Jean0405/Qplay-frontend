import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { examsApi } from '../api/client.js'

export default function ExamResult() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    examsApi.get(examId)
      .then(setData)
      .catch(e => setError(e.message))
  }, [examId])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const { exam, questions } = data
  const totalQuestions = questions.length
  const correctAnswers = questions.filter(q => q.isCorrect === 1).length
  const incorrectAnswers = totalQuestions - correctAnswers
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
          Resultados del Examen
        </h1>
        <p className="text-dark-50">Revisa tu desempeño y aprende de tus errores</p>
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

      {/* Score Card */}
      <div className="bg-dark-200 border border-dark-100 rounded-2xl p-8 mb-6">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Score Circle */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-dark-300"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                  className={`${
                    percentage >= 70 ? 'text-emerald-500' : 
                    percentage >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  } transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{percentage}%</span>
                <span className="text-xs text-dark-50">Puntaje</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-dark-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{correctAnswers}</div>
                  <div className="text-sm text-dark-50">Correctas</div>
                </div>
              </div>
            </div>

            <div className="bg-dark-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{incorrectAnswers}</div>
                  <div className="text-sm text-dark-50">Incorrectas</div>
                </div>
              </div>
            </div>

            <div className="bg-dark-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-400">{totalQuestions}</div>
                  <div className="text-sm text-dark-50">Total</div>
                </div>
              </div>
            </div>

            <div className="bg-dark-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{exam.score}</div>
                  <div className="text-sm text-dark-50">Puntos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className={`p-4 rounded-xl border-2 ${
          percentage >= 70 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : percentage >= 50 
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {percentage >= 70 ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">¡Excelente trabajo! Dominas muy bien el tema.</span>
              </>
            ) : percentage >= 50 ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Buen intento. Sigue practicando para mejorar.</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Necesitas reforzar este tema. ¡No te rindas!</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 py-3 px-4 bg-dark-200 hover:bg-dark-100 text-white font-medium rounded-xl border border-dark-100 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          {showDetails ? 'Ocultar' : 'Ver'} Respuestas Detalladas
        </button>
        <Link
          to="/exams/generate"
          className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-500 hover:shadow-lg hover:shadow-primary-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Intentar Nuevo Examen
        </Link>
      </div>

      {/* Detailed Results */}
      {showDetails && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Revisión Detallada</h3>
          {questions.map((q, idx) => {
            const isCorrect = q.isCorrect === 1
            const userAnswer = q.selectedOption
            const correctAnswer = q.correctOption

            return (
              <div
                key={q.idQuestion}
                className={`bg-dark-200 border-2 rounded-2xl p-6 ${
                  isCorrect ? 'border-emerald-500/30' : 'border-red-500/30'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium mb-2">{q.questionText}</h4>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = q[`option${option}`]
                    const isUserAnswer = userAnswer === option
                    const isCorrectAnswer = correctAnswer === option

                    return (
                      <div
                        key={option}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                          isCorrectAnswer
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : isUserAnswer && !isCorrect
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-dark-100 bg-dark-300'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-sm ${
                          isCorrectAnswer
                            ? 'bg-emerald-500 text-white'
                            : isUserAnswer && !isCorrect
                              ? 'bg-red-500 text-white'
                              : 'bg-dark-200 text-dark-50'
                        }`}>
                          {option}
                        </div>
                        <span className={`flex-1 ${
                          isCorrectAnswer || (isUserAnswer && !isCorrect) ? 'font-medium' : 'text-dark-50'
                        }`}>
                          {optionText}
                        </span>
                        {isCorrectAnswer && (
                          <span className="text-xs text-emerald-400 font-medium">Correcta</span>
                        )}
                        {isUserAnswer && !isCorrect && (
                          <span className="text-xs text-red-400 font-medium">Tu respuesta</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}