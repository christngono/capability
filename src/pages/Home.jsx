import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle, ChevronRight, Quote, MapPin, Mail, Phone, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

/* ── Animated counter hook ─────────────────── */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

/* ── Intersection observer hook ────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── Data ───────────────────────────────────── */
const stats = [
  { value: 200, suffix: '+', label: 'Entreprises formées' },
  { value: 5000, suffix: '+', label: 'Professionnels certifiés' },
  { value: 15, suffix: '', label: 'Pays couverts' },
  { value: 10, suffix: ' ans', label: "D'expérience" },
]

const expertiseItems = [
  { title: 'Haut service sur mesure', desc: 'Des solutions personnalisées adaptées aux besoins spécifiques de chaque organisation.', img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=500&q=80', icon: '🎯' },
  { title: 'Qualité & Excellence', desc: 'Des standards internationaux appliqués au contexte africain pour des résultats durables.', img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&q=80', icon: '⭐' },
  { title: 'Haut professionnalisme', desc: "Une équipe d'experts certifiés avec une expérience terrain reconnue.", img: '/team-training.png', icon: '🏆' },
  { title: "L'intégrité", desc: 'Une éthique irréprochable et une transparence totale dans toutes nos interventions.', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80', icon: '🤝' },
]

const formations = [
  { title: 'Gestion Administrative', desc: 'Maîtrisez les outils modernes de gestion pour piloter votre organisation avec efficacité.', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', color: 'from-sky-600 to-blue-800' },
  { title: 'Développement RH', desc: 'Renforcez vos compétences en gestion des talents et développement des équipes africaines.', img: '/team-training.png', color: 'from-indigo-600 to-purple-800' },
  { title: 'Gestion du Changement', desc: 'Conduisez les transformations organisationnelles avec méthode et leadership affirmé.', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80', color: 'from-emerald-600 to-teal-800' },
  { title: 'Leadership Stratégique', desc: 'Développez un leadership visionnaire pour inspirer et mobiliser vos équipes vers l\'excellence.', img: '/hero-capability.png', color: 'from-amber-600 to-orange-800' },
]

const testimonials = [
  { name: 'Dr. Aminata Diallo', role: 'DRH, Groupe Banque Atlantique', text: 'ACN a transformé notre approche de la gestion des talents. Les formations sont d\'un niveau exceptionnel, parfaitement adaptées aux réalités africaines.', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&q=80' },
  { name: 'Jean-Baptiste Mbeki', role: 'CEO, Cameroon Tech Hub', text: 'Un partenaire de confiance qui comprend les enjeux du développement professionnel en Afrique. Résultats mesurables dès les premières semaines.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { name: 'Fatou Coulibaly', role: 'Directrice Formation, NSIA', text: 'La qualité des formateurs ACN est remarquable. Notre équipe a gagné en compétence et en confiance grâce à leurs programmes certifiants.', img: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&q=80' },
]

/* ── Stat card ──────────────────────────────── */
function StatCard({ value, suffix, label, started }) {
  const count = useCounter(value, 2000, started)
  return (
    <div className="text-center animate-countUp">
      <p className="text-4xl lg:text-5xl font-black text-white">
        {count}{suffix}
      </p>
      <p className="text-sky-200 text-sm mt-1 font-medium">{label}</p>
    </div>
  )
}

/* ── Home ───────────────────────────────────── */
export default function Home() {
  const [statsRef, statsInView] = useInView(0.3)
  const [whyRef, whyInView] = useInView(0.2)
  const [expertRef, expertInView] = useInView(0.1)
  const [formRef, formInView] = useInView(0.1)
  const [testiRef, testiInView] = useInView(0.2)

  return (
    <main>

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/hero-office.jpeg"
            alt="ACN Team"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2463]/90 via-[#0A2463]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fadeInUp">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-300 text-sm font-semibold tracking-wide">African Capability Network</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fadeInUp delay-100">
              Développer<br />
              <span className="text-yellow-400">l'excellence</span><br />
              africaine
            </h1>

            <p className="text-sky-100 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg animate-fadeInUp delay-200">
              Leader africain en développement des compétences professionnelles.
              Formations certifiantes, conseil stratégique et accompagnement sur mesure.
            </p>

            <div className="flex flex-wrap gap-4 animate-fadeInUp delay-300">
              <Link to="/expertise" className="btn-gold flex items-center gap-2 text-sm">
                Découvrir nos formations <ArrowRight size={16} />
              </Link>
              <Link
                to="/a-propos"
                className="flex items-center gap-2 text-white border border-white/40 hover:border-yellow-400 hover:text-yellow-400 font-bold px-6 py-3 rounded-full transition-all text-sm backdrop-blur-sm"
              >
                <Play size={14} fill="currentColor" /> Notre histoire
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── OFFRE D'EMPLOI ───────────────────── */}
      <section className="bg-[#0A2463] py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 text-[#0A2463] text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shrink-0">
              Offre d'emploi
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Chargé(e) des Affaires Générales</p>
              <p className="text-sky-300 text-sm">Date limite : 14 septembre 2024</p>
            </div>
          </div>
          <a href="#" className="btn-gold text-sm shrink-0 flex items-center gap-2">
            Consultez l'offre <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      {/* ── STATS ────────────────────────────── */}
      <section ref={statsRef} className="bg-gradient-to-r from-sky-600 to-[#0A2463] py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} started={statsInView} />
          ))}
        </div>
      </section>

      {/* ── POURQUOI NOUS CHOISIR ────────────── */}
      <section ref={whyRef} className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className={`relative transition-all duration-1000 ${whyInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/hero-capability.png"
                alt="Pourquoi ACN"
                className="w-full h-[480px] object-cover"
              />
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-xl shrink-0">🏅</div>
                  <div>
                    <p className="font-black text-[#0A2463] text-sm">Certifié excellence africaine</p>
                    <p className="text-gray-500 text-xs mt-0.5">Reconnu par +15 institutions internationales</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Deco */}
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-yellow-400/20 rounded-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sky-600/20 rounded-3xl -z-10" />
          </div>

          {/* Text side */}
          <div className={`transition-all duration-1000 delay-200 ${whyInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
            <span className="text-sky-600 font-bold text-sm tracking-widest uppercase">Pourquoi nous choisir</span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A2463] leading-tight mt-3 mb-6 section-title text-left">
              Un avantage<br />concurrentiel réel
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              L'externalisation n'est plus uniquement une stratégie de réduction des coûts — elle constitue
              un avantage concurrentiel majeur. Nous offrons à nos clients les meilleurs processus, outils
              et pratiques en leur donnant accès à des compétences de niveau international.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                'Expertise reconnue à l\'échelle internationale',
                'Formateurs certifiés avec expérience terrain',
                'Programmes adaptés aux réalités africaines',
                'Suivi et accompagnement post-formation',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-yellow-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/a-propos" className="btn-navy flex items-center gap-2 text-sm inline-flex">
              En savoir plus <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOTRE EXPERTISE ──────────────────── */}
      <section ref={expertRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-800 ${expertInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-sky-600 font-bold text-sm tracking-widest uppercase">Ce qui nous définit</span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A2463] mt-3 section-title">Notre Expertise</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertiseItems.map(({ title, desc, img, icon }, i) => (
              <div
                key={title}
                className={`group card-hover relative overflow-hidden rounded-3xl bg-white shadow-md cursor-pointer
                  transition-all duration-700 ${expertInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                `}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="overflow-hidden h-52">
                  <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2463]/80 via-[#0A2463]/20 to-transparent" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-lg shadow-lg">
                  {icon}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-[#0A2463] text-base mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS FORMATIONS ───────────────────── */}
      <section ref={formRef} className="py-24 bg-[#0A2463] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-800 ${formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-yellow-400 font-bold text-sm tracking-widest uppercase">Ce que nous enseignons</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mt-3">Nos Formations</h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formations.map(({ title, desc, img, color }, i) => (
              <div
                key={title}
                className={`group relative overflow-hidden rounded-3xl h-64 cursor-pointer card-hover
                  transition-all duration-700 ${formInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                `}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-80 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-white font-black text-xl mb-2">{title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-xs">{desc}</p>
                  <Link
                    to="/inscription"
                    className="inline-flex items-center gap-2 text-yellow-300 font-bold text-sm group-hover:gap-3 transition-all"
                  >
                    S'inscrire <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/expertise" className="btn-gold inline-flex items-center gap-2 text-sm">
              Voir toutes nos formations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────── */}
      <section ref={testiRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-800 ${testiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-sky-600 font-bold text-sm tracking-widest uppercase">Ils nous font confiance</span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A2463] mt-3 section-title">Témoignages</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, text, img }, i) => (
              <div
                key={name}
                className={`bg-gray-50 rounded-3xl p-8 relative card-hover border border-gray-100
                  transition-all duration-700 ${testiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                `}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <Quote size={36} className="text-yellow-400 mb-4" />
                <p className="text-gray-700 leading-relaxed mb-8 text-sm italic">"{text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400" />
                  <div>
                    <p className="font-black text-[#0A2463] text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{role}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-3xl -z-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sky-600 font-bold text-sm tracking-widest uppercase">Nous sommes disponibles</span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A2463] mt-3 section-title">Contactez-nous</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: MapPin, label: 'Notre siège', value: 'Koweit City, Cameroun', color: 'bg-sky-600' },
              { icon: Mail, label: 'Email', value: 'contact@africancapabilitynetwork.com', color: 'bg-yellow-500' },
              { icon: Phone, label: 'Téléphone', value: '(237) 677 32 18 87\n(237) 694 87 02 71', color: 'bg-[#0A2463]' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-3xl p-8 shadow-md text-center card-hover border border-gray-100">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon size={24} className="text-white" />
                </div>
                <p className="text-[#0A2463] font-black text-sm mb-2 uppercase tracking-wider">{label}</p>
                {value.split('\n').map(v => (
                  <p key={v} className="text-gray-600 text-sm">{v}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/inscription" className="btn-gold inline-flex items-center gap-2 text-sm">
              S'inscrire maintenant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
