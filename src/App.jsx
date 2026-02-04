import { lazy, Suspense } from 'react';
import './App.css'
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from './components/Layout/Footer/Footer'
import Header from './components/Layout/Header/Header'
import AuthPage from './components/Pages/InitialPage/AuthPage'
import ProtectedRoutes from './components/Routes/ProtectedRoutes';
import ErrorBoundary from './components/Class Component/ErrorBoundary';
import ProfilePage from './components/Pages/Profile Page/ProfilePage';
const UserManagement = lazy(() => import("./components/Pages/UserManagement/UserManagement"));

function App() {

  return (
    <>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
            },
          }}
        />
        {/* Header Component */}
        <Header />
        {/* Main Component */}
        <main className="main-section">
          <Routes>
            <Route path='/' element={<AuthPage />} />
            <Route path="/users" element={
              <Suspense fallback={<p className='flex items-center justify-center h-screen w-full'>Loading Page...</p>}>
                <ProtectedRoutes>
                  <UserManagement />
                </ProtectedRoutes>
              </Suspense>
            } />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        {/* Footer Component */}
        <Footer />
      </ErrorBoundary>
    </>
  )
}

export default App
