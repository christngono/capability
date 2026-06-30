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
  const [open, setOpen] = useState(false)      // bouton X / Menu
  const [render, setRender] = useState(false)  // overlay présent dans le DOM
  const [active, setActive] = useState(false)  // cercle ouvert (clip-path plein)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Verrouille le scroll de la page quand le menu plein écran est ouvert
  useEffect(() => {
    document.body.style.overflow = render ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [render])

  const openMenu = () => {
    setOpen(true)
    setRender(true)
    // double rAF : laisse le navigateur peindre l'état "cercle fermé" avant d'animer
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setActive(true))
    )
  }

  const closeMenu = () => {
    setOpen(false)
    setActive(false)
    // attend la fin de l'animation circulaire avant de retirer du DOM
    setTimeout(() => setRender(false), 650)
  }

  const toggleMenu = () => (open ? closeMenu() : openMenu())

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
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className={`lg:hidden relative z-[70] p-2 rounded-lg transition-colors ${
            open ? 'text-white' : scrolled || !isHome ? 'text-gray-800' : 'text-white'
          }`}
          onClick={toggleMenu}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu plein écran — révélation circulaire */}
      {render && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-gradient-to-br from-sky-700 via-sky-800 to-sky-950"
          style={{
            clipPath: active
              ? 'circle(150% at calc(100% - 2.75rem) 2.75rem)'
              : 'circle(0% at calc(100% - 2.75rem) 2.75rem)',
            transition: 'clip-path 0.6s cubic-bezier(0.77, 0, 0.175, 1)',
          }}
        >
          <nav className="h-full w-full flex flex-col items-center justify-center gap-7 px-8">
            {navLinks.map(({ label, to }, i) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                style={{
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  transitionDelay: active ? `${250 + i * 70}ms` : '0ms',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : 'translateY(20px)',
                }}
                className={`text-2xl font-bold tracking-wide text-white hover:text-yellow-300 ${
                  pathname === to ? 'text-yellow-300' : ''
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/inscription"
              onClick={closeMenu}
              style={{
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                transitionDelay: active ? `${250 + navLinks.length * 70}ms` : '0ms',
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(20px)',
              }}
              className="btn-gold text-base mt-4 inline-block"
            >
              INSCRIPTION
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
