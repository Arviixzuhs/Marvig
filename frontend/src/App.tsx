import { LoginPage } from '@/modules/auth/pages/Login'
import { UserLayout } from '@/layout'
import { ConfigPage } from '@/modules/config'
import { LandingPage } from '@/modules/landing'
import { AdminLayout } from '@/modules/admin/layout'
import { RegisterPage } from '@/modules/auth/pages/Register'
import { AdminUserPage } from '@/modules/admin/pages/users'
import { Route, Routes } from 'react-router-dom'
import { ApartmentPage } from '@/modules/apartments/pages/apartment'
import { ApartmentsPage } from '@/modules/apartments/pages/apartments'
import { AdminReportsPage } from '@/modules/admin/pages/reports'
import { AdminPaymentPage } from '@/modules/admin/pages/payments'
import { AdminExpensePage } from '@/modules/admin/pages/expenses'
import { AdminEmployeePage } from '@/modules/admin/pages/employees'
import { AdminPromotionPage } from '@/modules/admin/pages/promotion'
import { AdminApartmentPage } from '@/modules/admin/pages/apartments'
import { AdminDashboardPage } from '@/modules/admin/pages/dashboard'
import { AdminReservationPage } from '@/modules/admin/pages/reservations'
import { LoadCurrentUserMiddleware } from '@/middlewares/LoadCurrentUserMiddleware'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route element={<LoadCurrentUserMiddleware />}>
        <Route element={<UserLayout />}>
          <Route element={<ConfigPage />} path='/config' />
          <Route element={<LandingPage />} path='/' />
          <Route element={<ApartmentPage />} path='/apartment/:apartmentId' />
          <Route element={<ApartmentsPage />} path='/apartments' />
        </Route>
        <Route element={<AdminLayout />} path='/admin'>
          <Route element={<AdminUserPage />} path='users' />
          <Route element={<AdminReportsPage />} path='reports' />
          <Route element={<AdminPaymentPage />} path='payments' />
          <Route element={<AdminExpensePage />} path='expenses' />
          <Route element={<AdminEmployeePage />} path='employees' />
          <Route element={<AdminDashboardPage />} path='dashboard' />
          <Route element={<AdminApartmentPage />} path='apartments' />
          <Route element={<AdminPromotionPage />} path='promotions' />
          <Route element={<AdminReservationPage />} path='reservations' />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
