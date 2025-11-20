import { Outlet } from 'react-router-dom'
export default function AdminLayout() {
  return (
    <div>
      <h2>Panel Admin</h2>
      <Outlet />
    </div>
  )
}