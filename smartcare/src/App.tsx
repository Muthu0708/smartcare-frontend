import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './Pages/Home'
import { Doctors } from './Pages/Doctors'
import { About } from './Pages/About'
import { Contact } from './Pages/Contact'
import { Login } from './Pages/Login'
import { MyProfile } from './Pages/MyProfile'
import { MyAppointments } from './Pages/MyAppointments'
import { Appointments } from './Pages/Appointments'
import { Navbar } from './components/Navbar/Navbar'
import { Footer } from './components/Header/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DoctorDashboard } from './Pages/DoctorDashBoard'
import { DoctorProfile } from './Pages/DoctorProfile'

function App() {
  return (
    <div className="mx-2 sm:mx-[10%]">
      <Navbar />

      <Routes>

        {/* Login only public */}
        <Route path="/login" element={<Login />} />

        {/* Protected ALL pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute role="patient">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors/:speciality"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:docName"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
      

<Route
  path="/doctor-dashboard"
  element={
    <ProtectedRoute role="doctor">
      <DoctorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctor-profile"
  element={
    <ProtectedRoute role="doctor">
      <DoctorProfile />
    </ProtectedRoute>
  }
/>

      </Routes>

      <Footer />
    </div>
  )
}

export default App;