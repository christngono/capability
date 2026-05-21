import { ArrowRight, Briefcase, Award, Users, Shield, Building2, UserCog, RefreshCcw, MapPin, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const expertiseCards = [
  { title: 'Haut service sur mesure', img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&q=80' },
  { title: 'La qualité et l\'excellence', img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80' },
  { title: 'Un haut niveau de professionnalisme', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { title: 'L\'intégrité', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80' },
]

const formations = [
  { title: 'GESTION', sub: 'Administrative', icon: Building2, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80' },
  { title: 'DÉVELOPPEMENT', sub: 'Ressources humaines', icon: UserCog, img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=300&q=80' },
  { title: 'GESTION', sub: 'Du changement', icon: RefreshCcw, img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&q=80' },
]

export default function Home() {
  return (
    <main>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-sky-700 via-sky-500 to-blue-400 min-h-[520px] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
          <div className="text-white z-10">
            <p className="text-yellow-300 font-semibold tracking-widest text-sm mb-3 uppercase">African Capability Network</p>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
              Bienvenue<br />chez <span className="text-yellow-300">ACN</span>
            </h1>
            <p className="text-sky-100 text-lg mb-8">African Capability Network</p>
            <Link
              to="/expertise"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-7 py-3 rounded-full transition-all text-sm shadow-lg hover:shadow-xl"
            >
              Découvrez nos offres <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative hidden lg:block">
            <div className="clip-diagonal overflow-hidden rounded-2xl shadow-2xl h-80">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80"
                alt="Équipe ACN"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400 rounded-2xl opacity-70 -z-10" />
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/5 hidden lg:block" />
        <div className="absolute bottom-10 left-1/3 w-20 h-20 rounded-full bg-yellow-400/20" />
      </section>

      {/* ── OFFRE D'EMPLOI ──────────────────────────────────── */}
      <section
        className="relative py-16 flex items-center justify-center text-white text-center overflow-hidden"
        style={{ background: 'linear-gradient(rgba(10,20,40,0.75),rgba(10,20,40,0.75)), url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80) center/cover no-repeat' }}
      >
        <div className="max-w-2xl px-4 z-10">
          <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full mb-4 tracking-widest uppercase">
            Offre d'emploi : Septembre 2024
          </span>
          <h2 className="text-3xl lg:text-4xl font-black mb-3 uppercase tracking-wide">
            Offre d'emploi : Chargé(e) des Affaires Générales
          </h2>
          <p className="text-gray-300 mb-6">Date limite de soumission : 14 septembre 2024</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-full transition-all"
          >
            Consultez l'offre <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ── POURQUOI NOUS CHOISIR ───────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center uppercase tracking-widest mb-2">Pourquoi nous choisir</h2>
          <span className="dotted-divider" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-4">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed text-justify mb-6">
                L'externalisation n'est plus uniquement considérée comme une stratégie de réduction des coûts,
                elle constitue un avantage concurrentiel. Nous offrons à nos clients les meilleurs processus,
                outils et pratiques en leur donnant accès à des compétences de niveau international et à une
                prestation des services de qualité. Des solutions flexibles et des modalités contractuelles
                leurs permettant de vous concentrer sur leur stratégie et leur cœur de métier.
              </p>
              <Link
                to="/a-propos"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-2.5 rounded-full transition-all text-sm"
              >
                Voir plus <ArrowRight size={15} />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute bottom-0 right-0 w-4/5 h-4/5 bg-yellow-300 rounded-2xl -z-0" />
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&q=80"
                alt="Consultation professionnelle"
                className="relative z-10 rounded-2xl shadow-xl w-4/5 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE EXPERTISE ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center uppercase tracking-widest mb-2">Notre Expertise</h2>
          <span className="dotted-divider" />
        </div>

        <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 py-14 mt-4">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertiseCards.map(({ title, img }) => (
              <div key={title} className="group relative overflow-hidden rounded-2xl shadow-lg h-64 cursor-pointer">
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS FORMATIONS ──────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-blue-100 via-sky-200 to-blue-300">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center uppercase tracking-widest mb-2 text-gray-800">Nos Formations</h2>
          <span className="dotted-divider" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 justify-items-center">
            {formations.map(({ title, sub, img }) => (
              <div key={sub} className="flex flex-col items-center gap-4 group">
                <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <img src={img} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="font-black text-gray-800 text-lg uppercase tracking-wide">{title}</p>
                  <p className="text-gray-600 text-sm">{sub}</p>
                </div>
                <Link
                  to="/expertise"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-colors"
                >
                  En savoir plus
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/expertise"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-full transition-all shadow-md"
            >
              Voir toutes nos formations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────── */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-px h-16 bg-gray-300" />
          </div>
          <div className="w-3 h-3 rounded-full bg-gray-300 mx-auto mb-8" />

          <h2 className="text-4xl font-black text-gray-900 mb-10">Contactez-nous</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
                <MapPin size={24} className="text-sky-600" />
              </div>
              <p className="font-black text-gray-800 uppercase tracking-wide">Koweit City</p>
              <p className="text-gray-500 text-sm">Cameroun, Afrique</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
                <Mail size={24} className="text-sky-600" />
              </div>
              <p className="font-black text-gray-800 uppercase tracking-wide">Email</p>
              <a href="mailto:contact@africancapabilitynetwork.com" className="text-sky-600 text-sm hover:underline">
                contact@africancapabilitynetwork.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
                <Phone size={24} className="text-sky-600" />
              </div>
              <p className="font-black text-gray-800 uppercase tracking-wide">Téléphone</p>
              <p className="text-gray-600 text-sm">(237) 677 32 18 87</p>
              <p className="text-gray-600 text-sm">(237) 694 87 02 71</p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/inscription"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 py-3 rounded-full transition-all shadow-md"
            >
              S'inscrire maintenant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
