import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Expertise from './pages/Expertise'
import Actualite from './pages/Actualite'
import Inscription from './pages/Inscription'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/actualite" element={<Actualite />} />
            <Route path="/inscription" element={<Inscription />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
