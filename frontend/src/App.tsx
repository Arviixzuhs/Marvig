import { AdminUserPage } from './modules/admin/pages/users'
import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from './modules/admin/layout'

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route element={<AdminUserPage />} path='/' />
      </Route>
    </Routes>
  )
}

export default App
