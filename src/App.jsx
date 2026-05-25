import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Expertise from './pages/Expertise'
import Actualite from './pages/Actualite'
import Inscription from './pages/Inscription'
import Demande from './pages/Demande'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Evaluation from './pages/Evaluation'
import EvaluationResultat from './pages/EvaluationResultat'
import PrivateRoute from './components/PrivateRoute'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques avec Navbar + Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/expertise" element={<PublicLayout><Expertise /></PublicLayout>} />
        <Route path="/actualite" element={<PublicLayout><Actualite /></PublicLayout>} />
        <Route path="/inscription" element={<PublicLayout><Inscription /></PublicLayout>} />
        <Route path="/demande" element={<PublicLayout><Demande /></PublicLayout>} />

        {/* Espace admin — sans Navbar/Footer publique */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

        {/* Espace candidat — sans Navbar/Footer publique */}
        <Route path="/evaluation/:testId" element={<Evaluation />} />
        <Route path="/evaluation/:testId/resultat" element={<EvaluationResultat />} />
      </Routes>
    </BrowserRouter>
  )
}
