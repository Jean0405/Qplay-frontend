import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { examCategoriesApi, rankingApi } from '../api/client.js'

const medalColors = {
  1: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', gradient: 'from-yellow-500 to-yellow-600' },
  2: { bg: 'bg-gray-400/20', text: 'text-gray-300', border: 'border-gray-400/30', gradient: 'from-gray-400 to-gray-500' },
  3: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-600 to-orange-700' }
}

const MedalIcon = ({ position }) => {
  if (position === 1) {
    return (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center font-bold text-sm">
      {position}
    </div>
  )
}

export default function Ranking() {
  const { categoryId } = useParams()
  const [items, setItems] = useState([])
  const [category, setCategory] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    console.log('Cargando ranking para categoría ID:', categoryId)
    Promise.all([
      rankingApi.byCategory(parseInt(categoryId)),
      examCategoriesApi.list()
    ])
      .then(([rankingData, categories]) => {
        setItems(rankingData)
        setCategory(categories.find(c => c.id === parseInt(categoryId)))
        
        // Obtener el userId actual del localStorage o contexto
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        setCurrentUserId(userData.id)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [categoryId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link 
            to="/categories"
            className="p-2 bg-dark-200 border border-dark-100 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Ranking {category?.name}
          </h1>
        </div>
        <p className="text-dark-50 pl-14">
          Los mejores estudiantes en la categoría {category?.name}
        </p>
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

      {/* Top 3 Podium */}
      {items.length >= 3 && (
        <div className="mb-8 flex items-end justify-center gap-4">
          {/* Second Place */}
          <div className="flex-1 max-w-[200px]">
            <div className="bg-dark-200 border-2 border-gray-400/30 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="mb-2">
                <div className="text-2xl font-bold text-gray-300">#2</div>
                <div className="text-sm text-gray-400 font-medium">{items[1].username}</div>
              </div>
              <div className="text-3xl font-bold text-white">{items[1].bestScore}</div>
              <div className="text-xs text-dark-50">puntos</div>
            </div>
            <div className="h-24 bg-gradient-to-b from-gray-400/20 to-transparent rounded-b-2xl border-2 border-t-0 border-gray-400/30"></div>
          </div>

          {/* First Place */}
          <div className="flex-1 max-w-[220px]">
            <div className="bg-dark-200 border-2 border-yellow-500/50 rounded-t-2xl p-6 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-xs font-bold text-white">
                  CAMPEÓN
                </div>
              </div>
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-yellow-400">#1</div>
                <div className="text-sm text-yellow-300 font-medium">{items[0].username}</div>
              </div>
              <div className="text-4xl font-bold text-white">{items[0].bestScore}</div>
              <div className="text-xs text-dark-50">puntos</div>
            </div>
            <div className="h-32 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-b-2xl border-2 border-t-0 border-yellow-500/50"></div>
          </div>

          {/* Third Place */}
          <div className="flex-1 max-w-[200px]">
            <div className="bg-dark-200 border-2 border-orange-600/30 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="mb-2">
                <div className="text-2xl font-bold text-orange-400">#3</div>
                <div className="text-sm text-orange-300 font-medium">{items[2].username}</div>
              </div>
              <div className="text-3xl font-bold text-white">{items[2].bestScore}</div>
              <div className="text-xs text-dark-50">puntos</div>
            </div>
            <div className="h-16 bg-gradient-to-b from-orange-600/20 to-transparent rounded-b-2xl border-2 border-t-0 border-orange-600/30"></div>
          </div>
        </div>
      )}

      {/* Full Ranking List */}
      <div className="bg-dark-200 border border-dark-100 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-dark-100">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Clasificación General
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-dark-50 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">No hay datos de ranking</h3>
            <p className="text-dark-50">Sé el primero en aparecer en el ranking</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-100">
            {items.map((user, index) => {
              const position = index + 1
              const isTopThree = position <= 3
              const colors = medalColors[position] || {}
              const isCurrentUser = user.userId === currentUserId

              return (
                <div
                  key={user.userId}
                  className={`flex items-center gap-4 p-4 hover:bg-dark-300/50 transition-all ${
                    isCurrentUser ? 'bg-primary-500/10' : ''
                  }`}
                >
                  {/* Position */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    isTopThree 
                      ? `${colors.bg} ${colors.text} border-2 ${colors.border}` 
                      : 'bg-dark-300 text-dark-50'
                  }`}>
                    {isTopThree ? <MedalIcon position={position} /> : position}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold truncate ${isCurrentUser ? 'text-primary-400' : ''}`}>
                        {user.username}
                      </h3>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30">
                          Tú
                        </span>
                      )}
                      {isTopThree && (
                        <svg className={`w-5 h-5 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-dark-50">Usuario ID: {user.userId}</div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{user.bestScore}</div>
                    <div className="text-xs text-dark-50">puntos</div>
                  </div>

                  {/* Trophy */}
                  {isTopThree && (
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-8 text-center">
        <Link
          to={`/exams/generate`}
          state={{ preselectedCategoryId: parseInt(categoryId) }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Practicar {category?.name}
        </Link>
      </div>
    </div>
  )
}