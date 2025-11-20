import { useState, useEffect } from 'react'
import { questionsApi, examCategoriesApi, subjectsApi } from '../api/client.js'

export default function RecommendQuestion() {
  const [statement, setStatement] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctOption, setCorrectOption] = useState('A')
  const [examCategoryId, setExamCategoryId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [categories, setCategories] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    examCategoriesApi.list().then(setCategories)
    subjectsApi.list().then(setSubjects)
  }, [])

  function updateOption(i, val) {
    setOptions(o => o.map((x, idx) => idx === i ? val : x))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await questionsApi.recommend({
        questionText: statement,
        optionA: options[0],
        optionB: options[1],
        optionC: options[2],
        optionD: options[3],
        correctOption,
        idExamCategory: parseInt(examCategoryId),
        idSubject: parseInt(subjectId)
      })
      
      setSuccess(true)
      setStatement('')
      setOptions(['', '', '', ''])
      setCorrectOption('A')
      setExamCategoryId('')
      setSubjectId('')
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const optionLabels = ['A', 'B', 'C', 'D']
  const isValid = statement && examCategoryId && subjectId && options.every(o => o.trim())

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
          Recomendar Pregunta
        </h1>
        <p className="text-dark-50">Contribuye con preguntas para enriquecer nuestro banco de exámenes</p>
      </div>

      <div className="bg-dark-200 border border-dark-100 rounded-2xl p-8">
        <form onSubmit={submit} className="space-y-6">
          {/* Success Alert */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>¡Pregunta enviada exitosamente! Será revisada por nuestro equipo.</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Selects Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-50 mb-2">
                Categoría de Examen
              </label>
              <select
                value={examCategoryId}
                onChange={e => setExamCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-50 mb-2">
                Materia
              </label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Selecciona una materia</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Statement */}
          <div>
            <label className="block text-sm font-medium text-dark-50 mb-2">
              Enunciado de la pregunta
            </label>
            <textarea
              value={statement}
              onChange={e => setStatement(e.target.value)}
              required
              rows={4}
              placeholder="Escribe aquí el enunciado de tu pregunta..."
              className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-dark-50 mb-3">
              Opciones de respuesta
            </label>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-dark-300 border border-dark-100 rounded-lg flex items-center justify-center font-semibold text-primary-400">
                    {optionLabels[i]}
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    required
                    placeholder={`Escribe la opción ${optionLabels[i]}`}
                    className="flex-1 px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctOption === optionLabels[i]}
                      onChange={() => setCorrectOption(optionLabels[i])}
                      className="w-5 h-5 text-primary-500 focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-dark-50">Correcta</span>
                  </label>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-dark-50 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Marca la opción correcta con el botón de radio
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando pregunta...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar pregunta
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-dark-50">
            <p className="font-medium text-primary-400 mb-1">Proceso de revisión</p>
            <p>Tu pregunta será revisada por nuestro equipo antes de ser aprobada. Asegúrate de que sea clara, correcta y apropiada para el nivel del examen.</p>
          </div>
        </div>
      </div>
    </div>
  )
}