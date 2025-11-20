import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { examsApi } from '../api/client.js'

export default function TakeExam() {
  const { examId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [examData, setExamData] = useState(location.state || null)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {
    // Si no hay datos en el state, hacer fetch
    if (!examData) {
      examsApi.get(examId)
        .then(data => setExamData(data))
        .catch(e => setError(e.message))
    }
  }, [examId, examData])

  function setAnswer(questionId, option) {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    
    try {
      const submissionData = {
        examId: parseInt(examId),
        answers: examData.questions.map(q => ({
          questionId: q.id, // FIX: Usar q.id en lugar de q.idQuestion
          selectedOption: answers[q.id] || null
        }))
      }
      
      const result = await examsApi.submit(submissionData)
      navigate(`/exams/result/${examId}`, { state: result })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Validar que examData existe y tiene la estructura correcta
  if (!examData || !examData.questions || !Array.isArray(examData.questions)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const questions = examData.questions
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / totalQuestions) * 100
  const currentQ = questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 bg-dark-200 border border-dark-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Examen en Curso</h1>
            <p className="text-sm text-dark-50">
              Pregunta {currentQuestion + 1} de {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400">{answeredCount}/{totalQuestions}</div>
            <div className="text-xs text-dark-50">respondidas</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-dark-300 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
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

      {/* Question Card */}
      <div className="bg-dark-200 border border-dark-100 rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 font-bold">
            {currentQuestion + 1}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-medium text-white leading-relaxed">
              {currentQ.questionText}
            </h2>
          </div>
        </div>

        {/* Options - FIX: Usar currentQ.id en lugar de currentQ.idQuestion */}
        <div className="space-y-3">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = currentQ[`option${option}`]
            const isSelected = answers[currentQ.id] === option // FIX: currentQ.id
            
            return (
              <button
                key={option}
                onClick={() => setAnswer(currentQ.id, option)} // FIX: currentQ.id
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-100 bg-dark-300 hover:border-primary-500/50 hover:bg-dark-100'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                  isSelected
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-200 text-dark-50'
                }`}>
                  {option}
                </div>
                <span className={`flex-1 ${isSelected ? 'text-white font-medium' : 'text-dark-50'}`}>
                  {optionText}
                </span>
                {isSelected && (
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-dark-200 hover:bg-dark-100 text-white font-medium rounded-xl border border-dark-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        {/* Question Indicators - FIX: Usar q.id */}
        <div className="flex gap-2 flex-wrap justify-center">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                idx === currentQuestion
                  ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-900'
                  : answers[q.id] // FIX: q.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-dark-300 text-dark-50 border border-dark-100 hover:bg-dark-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestion < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            Siguiente
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < totalQuestions || loading}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:shadow-lg hover:shadow-primary-500/50 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </>
            ) : (
              <>
                Finalizar Examen
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Help Text */}
      {answeredCount < totalQuestions && (
        <div className="mt-6 text-center text-sm text-dark-50">
          Debes responder todas las preguntas para enviar el examen
        </div>
      )}
    </div>
  )
}