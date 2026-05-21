import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'ACCUEIL', to: '/' },
  { label: 'A PROPOS DE NOUS', to: '/a-propos' },
  { label: 'NOTRE EXPERTISE', to: '/expertise' },
  { label: 'ACTUALITÉ', to: '/actualite' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <polygon points="40,5 75,70 5,70" fill="none" stroke="#0284c7" strokeWidth="3"/>
              <polygon points="40,5 75,70 5,70" fill="#e0f2fe" opacity="0.4"/>
              <ellipse cx="40" cy="38" rx="14" ry="18" fill="#e6b241" opacity="0.9"/>
              <rect x="33" y="30" width="14" height="18" rx="7" fill="#cc9d16"/>
              <line x1="40" y1="22" x2="40" y2="28" stroke="#0284c7" strokeWidth="2"/>
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold text-sky-700 tracking-wide">African Capability</div>
            <div className="text-xs text-gray-500">Network</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-semibold tracking-wide transition-colors hover:text-sky-600 ${
                pathname === to ? 'text-sky-600 border-b-2 border-sky-600 pb-0.5' : 'text-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link
            to="/inscription"
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm tracking-wide"
          >
            INSCRIPTION
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-gray-700 hover:text-sky-600"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/inscription"
            onClick={() => setOpen(false)}
            className="bg-sky-600 text-white text-center font-bold px-6 py-2.5 rounded-full text-sm"
          >
            INSCRIPTION
          </Link>
        </div>
      )}
    </header>
  )
}
