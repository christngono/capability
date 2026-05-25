import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'À Propos', to: '/a-propos' },
  { label: 'Notre Expertise', to: '/expertise' },
  { label: 'Actualité', to: '/actualite' },
  { label: 'Nos Services', to: '/demande' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-white shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Top bar slim */}
      {(!scrolled && isHome) && (
        <div className="bg-sky-700/80 backdrop-blur-sm text-white text-xs py-1.5 px-4 flex justify-between max-w-7xl mx-auto rounded-b-xl">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            Vous êtes candidat ? Inscrivez-vous dès maintenant
          </span>
          <span>(237) 677 32 18 87 | 694 87 02 71</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/acn-logo.png"
            alt="African Capability Network"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-semibold tracking-wide transition-all duration-200 relative group ${
                scrolled || !isHome ? 'text-gray-700 hover:text-sky-600' : 'text-white hover:text-yellow-300'
              } ${pathname === to ? (scrolled || !isHome ? 'text-sky-600' : 'text-yellow-300') : ''}`}
            >
              {label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                pathname === to ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Link to="/inscription" className="btn-gold text-sm inline-block">
            INSCRIPTION
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 rounded-lg ${scrolled || !isHome ? 'text-gray-800' : 'text-white'}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t shadow-xl px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`text-sm font-bold text-gray-700 hover:text-sky-600 border-b border-gray-100 pb-3 ${
                pathname === to ? 'text-sky-600' : ''
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/inscription"
            onClick={() => setOpen(false)}
            className="btn-gold text-sm text-center inline-block"
          >
            INSCRIPTION
          </Link>
        </div>
      )}
    </header>
  )
}
