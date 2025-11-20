import { useState, useEffect } from 'react'
import { examsApi, examCategoriesApi, subjectsApi } from '../api/client.js'
import { useNavigate, useLocation } from 'react-router-dom'

export default function GenerateExam() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Obtener la categoría preseleccionada del state de navegación
  const preselectedCategoryId = location.state?.preselectedCategoryId || ''
  
  const [examCategoryId, setExamCategoryId] = useState(preselectedCategoryId.toString())
  const [subjectId, setSubjectId] = useState('')
  const [limit, setLimit] = useState(10)
  const [categories, setCategories] = useState([])
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    examCategoriesApi.list().then(setCategories)
    subjectsApi.list().then(setSubjects)
  }, [])

  // Actualizar la categoría cuando cambie el state de navegación
  useEffect(() => {
    if (preselectedCategoryId) {
      setExamCategoryId(preselectedCategoryId.toString())
    }
  }, [preselectedCategoryId])

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await examsApi.generate({
        examCategoryId: parseInt(examCategoryId),
        subjectId: subjectId ? parseInt(subjectId) : null,
        limit: Number(limit)
      })
      navigate(`/exams/take/${response.id}`, { state: response })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find(c => c.id === parseInt(examCategoryId))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
          Generar Examen
        </h1>
        <p className="text-dark-50">Configura tu examen personalizado y comienza a practicar</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="md:col-span-2">
          <div className="bg-dark-200 border border-dark-100 rounded-2xl p-8">
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Preselected Category Message */}
              {preselectedCategoryId && selectedCategory && (
                <div className="flex items-center gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Categoría <strong>{selectedCategory.name}</strong> seleccionada</span>
                </div>
              )}

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-dark-50 mb-2">
                  Categoría de Examen *
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
                {selectedCategory && (
                  <p className="mt-2 text-xs text-dark-50">{selectedCategory.description}</p>
                )}
              </div>

              {/* Subject Select */}
              <div>
                <label className="block text-sm font-medium text-dark-50 mb-2">
                  Materia (Opcional)
                </label>
                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="">Todas las materias</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-dark-50">Si no seleccionas una materia, se incluirán preguntas de todas</p>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-dark-50 mb-2">
                  Número de preguntas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={limit}
                    onChange={e => setLimit(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-50 text-sm">
                    preguntas
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {[5, 10, 15, 20].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLimit(num)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        limit === num
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-300 text-dark-50 hover:bg-dark-100 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!examCategoryId || loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generando examen...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generar Examen
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Config Summary */}
          <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Configuración
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-dark-50">Categoría:</dt>
                <dd className="font-medium text-right">
                  {selectedCategory?.name || 'No seleccionada'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark-50">Materia:</dt>
                <dd className="font-medium text-right">
                  {subjects.find(s => s.id === parseInt(subjectId))?.name || 'Todas'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark-50">Preguntas:</dt>
                <dd className="font-medium">{limit}</dd>
              </div>
            </dl>
          </div>

          {/* Tips */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-primary-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Consejos
            </h3>
            <ul className="space-y-2 text-xs text-dark-50">
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Selecciona una materia específica para enfocarte en un tema</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Comienza con 10 preguntas si es tu primera vez</span>
              </li>
              <li className="flex gap-2">
                <svg className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No hay límite de tiempo, responde con calma</span>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div className="bg-dark-200 border border-dark-100 rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Estadísticas
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-dark-50">Exámenes realizados:</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-50">Promedio:</span>
                <span className="font-semibold">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}