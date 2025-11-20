const API_URL = 'http://localhost:4000'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`)
  }
  return data
}

// Auth
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/users/me')
}

// Catalog
export const examCategoriesApi = {
  list: () => request('/exam-categories')
}

export const subjectsApi = {
  list: () => request('/subjects')
}

// Questions
export const questionsApi = {
  listApproved: (examCategoryId, subjectId) => request(`/questions/${examCategoryId}/${subjectId}`),
  recommend: (body) => request('/questions/recommend', { method: 'POST', body: JSON.stringify(body) }),
  pending: () => request('/admin/questions/pending'),
  updateStatus: (id, status) => request(`/admin/questions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

// Exams
export const examsApi = {
  generate: (body) => request('/exams/generate', { method: 'POST', body: JSON.stringify(body) }),
  submit: (body) => request('/exams/submit', { method: 'POST', body: JSON.stringify(body) }),
  get: (id) => request(`/exams/${id}`),
  history: () => request(`/exams/history/me`)
}

// Ranking
export const rankingApi = {
  byCategory: (examCategoryId) => request(`/users/ranking/${examCategoryId}`)
}