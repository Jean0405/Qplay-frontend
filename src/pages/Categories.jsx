import { useEffect, useState } from 'react'
import { examCategoriesApi } from '../api/client.js'
import { Link, useNavigate } from 'react-router-dom'

const categoryIcons = {
  'ICFES': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'Saber PRO': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  'TyT': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

const categoryColors = {
  'ICFES': 'from-blue-500 to-cyan-500',
  'Saber PRO': 'from-purple-500 to-pink-500',
  'TyT': 'from-green-500 to-emerald-500'
}

export default function Categories() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    examCategoriesApi.list()
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStartExam = (categoryId) => {
    navigate('/exams/generate', { state: { preselectedCategoryId: categoryId } })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
          Categorías de Examen
        </h1>
        <p className="text-dark-50">Selecciona una categoría para comenzar a practicar</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((category) => {
          const colorClass = categoryColors[category.name] || 'from-primary-500 to-purple-500'
          const icon = categoryIcons[category.name] || categoryIcons['ICFES']

          return (
            <div
              key={category.id}
              className="group relative bg-dark-200 border border-dark-100 rounded-2xl p-6 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1"
            >
              {/* Icon Badge */}
              <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className="text-white">
                  {icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary-400 transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-dark-50 mb-6">
                {category.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartExam(category.id)}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-all text-center"
                >
                  Iniciar examen
                </button>
                <Link
                  to={`/ranking/${category.id}`}
                  className="px-4 py-2 bg-dark-300 hover:bg-dark-100 text-dark-50 hover:text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </Link>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && !error && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-dark-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-dark-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-dark-50">No hay categorías disponibles</p>
        </div>
      )}
    </div>
  )
}