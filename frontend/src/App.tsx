import { LoginPage } from '@/modules/auth/pages/Login'
import { AdminLayout } from '@/modules/admin/layout'
import { RegisterPage } from '@/modules/auth/pages/Register'
import { AdminUserPage } from '@/modules/admin/pages/users'
import { Route, Routes } from 'react-router-dom'
import { AdminEmployeePage } from './modules/admin/pages/employees'
import { AdminApartmentPage } from './modules/admin/pages/apartments'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route element={<AdminLayout />} path='/admin'>
        <Route element={<></>} path='dashboard' />
        <Route element={<AdminUserPage />} path='users' />
        <Route element={<AdminEmployeePage />} path='employees' />
        <Route element={<AdminApartmentPage />} path='apartments' />
      </Route>
    </Routes>
  )
}

export default App
