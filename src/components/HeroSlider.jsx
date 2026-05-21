import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 1,
    img: '/hero-office.webp',
    tag: 'African Capability Network',
    title: ['Développer', "l'excellence", 'africaine'],
    titleHighlight: 1,
    sub: 'Leader africain en développement des compétences professionnelles. Formations certifiantes et conseil stratégique.',
    cta: { label: 'Découvrir nos formations', to: '/expertise' },
    ctaSecondary: { label: 'Notre histoire', to: '/a-propos' },
    accent: '#D4A017',
  },
  {
    id: 2,
    img: '/team-training.webp',
    tag: 'Formations Certifiantes',
    title: ['Formez', 'vos équipes', 'aux standards mondiaux'],
    titleHighlight: 2,
    sub: 'Des programmes sur mesure conçus par des experts certifiés, adaptés aux réalités du marché africain.',
    cta: { label: 'Voir les formations', to: '/expertise' },
    ctaSecondary: { label: "S'inscrire", to: '/inscription' },
    accent: '#0284c7',
  },
  {
    id: 3,
    img: '/image_ca.webp',
    tag: 'Conseil Stratégique',
    title: ['Transformez', 'votre', 'organisation'],
    titleHighlight: 0,
    sub: 'Accompagnement sur mesure pour les entreprises qui veulent atteindre l\'excellence et se démarquer sur le marché.',
    cta: { label: "Contactez-nous", to: '/inscription' },
    ctaSecondary: { label: 'À propos de nous', to: '/a-propos' },
    accent: '#D4A017',
  },
]

const DURATION = 6000

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const intervalRef = useRef(null)
  const progressRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  const goTo = (index) => {
    if (animating || index === current) return
    setAnimating(true)
    setTextVisible(false)
    setPrev(current)
    setTimeout(() => {
      setCurrent(index)
      setProgress(0)
      startTimeRef.current = Date.now()
      setTimeout(() => {
        setTextVisible(true)
        setAnimating(false)
        setPrev(null)
      }, 100)
    }, 600)
  }

  const next = () => goTo((current + 1) % slides.length)
  const goBack = () => goTo((current - 1 + slides.length) % slides.length)

  // Auto advance
  useEffect(() => {
    intervalRef.current = setInterval(next, DURATION)
    return () => clearInterval(intervalRef.current)
  }, [current, animating])

  // Progress bar
  useEffect(() => {
    startTimeRef.current = Date.now()
    setProgress(0)
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / DURATION) * 100, 100))
    }, 30)
    return () => clearInterval(progressRef.current)
  }, [current])

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">

      {/* ── Background images ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.img}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            className="w-full h-full object-cover object-center"
            style={{
              transform: i === current ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 8s ease-out',
            }}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/90 via-[#0A2463]/60 to-[#0A2463]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 pt-24 w-full">
          <div className="max-w-2xl">

            {/* Tag badge */}
            <div
              className="inline-flex items-center gap-2 border border-yellow-400/50 bg-yellow-400/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: '0ms',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-300 text-sm font-semibold tracking-wide">{slide.tag}</span>
            </div>

            {/* Title lines */}
            <h1 className="font-black leading-none mb-8">
              {slide.title.map((line, i) => (
                <span
                  key={i}
                  className="block overflow-hidden"
                >
                  <span
                    className={`block text-5xl lg:text-7xl ${i === slide.titleHighlight ? 'text-yellow-400' : 'text-white'}`}
                    style={{
                      opacity: textVisible ? 1 : 0,
                      transform: textVisible ? 'translateY(0)' : 'translateY(60px)',
                      transition: 'opacity 0.7s ease, transform 0.7s ease',
                      transitionDelay: `${80 + i * 100}ms`,
                    }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p
              className="text-sky-100 text-lg leading-relaxed mb-10 max-w-lg"
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                transitionDelay: '380ms',
              }}
            >
              {slide.sub}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4"
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: '480ms',
              }}
            >
              <Link to={slide.cta.to} className="btn-gold flex items-center gap-2 text-sm">
                {slide.cta.label} <ArrowRight size={16} />
              </Link>
              <Link
                to={slide.ctaSecondary.to}
                className="flex items-center gap-2 text-white border border-white/30 hover:border-yellow-400 hover:text-yellow-400 font-bold px-6 py-3 rounded-full transition-all text-sm backdrop-blur-sm"
              >
                <Play size={13} fill="currentColor" />
                {slide.ctaSecondary.label}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20 flex flex-col items-center gap-3 hidden lg:flex">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-400 rounded-full ${
              i === current
                ? 'w-2 h-10 bg-yellow-400'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        onClick={goBack}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 hover:border-yellow-400 transition-all duration-200 hidden md:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-14 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 hover:border-yellow-400 transition-all duration-200 hidden md:flex"
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Bottom bar: dots + progress ── */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6">

          {/* Dots mobile */}
          <div className="flex gap-2 lg:hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-yellow-400' : 'w-2 h-2 bg-white/40'}`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-xs font-mono tabular-nums">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
              <div className="flex-1 h-px bg-white/20 relative overflow-hidden rounded-full">
                <div
                  className="absolute left-0 top-0 h-full bg-yellow-400 rounded-full transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 right-6 z-20 hidden lg:flex flex-col items-center gap-2 opacity-60">
        <div className="w-5 h-9 border border-white/40 rounded-full flex justify-center pt-1.5">
          <div
            className="w-1 h-2 bg-white/80 rounded-full"
            style={{ animation: 'scrollBounce 1.5s infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(6px); opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}
