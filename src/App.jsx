import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './pages/layouts/AppLayout.jsx'
import AdminLayout from './pages/layouts/AdminLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Categories from './pages/Categories.jsx'
import Subjects from './pages/Subjects.jsx'
import Questions from './pages/Questions.jsx'
import RecommendQuestion from './pages/RecommendQuestion.jsx'
import GenerateExam from './pages/GenerateExam.jsx'
import TakeExam from './pages/TakeExam.jsx'
import ExamResult from './pages/ExamResult.jsx'
import ExamHistory from './pages/ExamHistory.jsx'
import Ranking from './pages/Ranking.jsx'
import AdminPendingQuestions from './pages/AdminPendingQuestions.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="questions/:examCategoryId/:subjectId" element={<Questions />} />
          <Route path="recommend" element={<RecommendQuestion />} />
          <Route path="exams/generate" element={<GenerateExam />} />
          <Route path="exams/take/:examId" element={<TakeExam />} />
          <Route path="exams/result/:examId" element={<ExamResult />} />
          <Route path="exams/history" element={<ExamHistory />} />
          <Route path="ranking/:categoryId" element={<Ranking />} />
        </Route>
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route path="questions/pending" element={<AdminPendingQuestions />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<div style={{padding:'2rem'}}>404</div>} />
    </Routes>
  )
}

export default App
