import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Categories from './pages/Categories'
import Subjects from './pages/Subjects'
import RecommendQuestion from './pages/RecommendQuestion'
import GenerateExam from './pages/GenerateExam'
import TakeExam from './pages/TakeExam'
import ExamResult from './pages/ExamResult'
import ExamHistory from './pages/ExamHistory'
import Profile from './pages/Profile'
import AdminPendingQuestions from './pages/AdminPendingQuestions'
import Ranking from './pages/Ranking'
import Navbar from './components/Navbar'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  if (!user) return <Navigate to="/login" />
  if (adminOnly && !user.isAdmin) return <Navigate to="/categories" />
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-400 text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <Navigate to="/categories" />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/categories" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <Categories />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/subjects" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <Subjects />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/recommend" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <RecommendQuestion />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/exams/generate" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <GenerateExam />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/exams/take/:id" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <TakeExam />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/exams/result/:id" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <ExamResult />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/exams/history" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <ExamHistory />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/ranking/:categoryId" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <Ranking />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <Profile />
                </div>
              </PrivateRoute>
            } />
            
            <Route path="/admin/pending-questions" element={
              <PrivateRoute adminOnly>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <AdminPendingQuestions />
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
