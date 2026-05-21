import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const socials = [
  { label: 'f', title: 'Facebook' },
  { label: 'in', title: 'LinkedIn' },
  { label: 'tw', title: 'Twitter/X' },
  { label: 'ig', title: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="bg-[#060f24] text-white">
      {/* CTA band */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[#0A2463] font-black text-2xl lg:text-3xl">Prêt à développer vos compétences ?</h3>
            <p className="text-[#0A2463]/70 mt-1">Rejoignez +5000 professionnels africains déjà formés par ACN</p>
          </div>
          <Link to="/inscription" className="btn-navy text-sm shrink-0 flex items-center gap-2 inline-flex">
            S'inscrire maintenant <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <img src="/acn-logo.png" alt="ACN" className="h-16 w-auto object-contain mb-5 brightness-0 invert" />
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Leader africain en développement des compétences professionnelles et institutionnelles depuis 2014.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {socials.map(({ label, title }) => (
              <a
                key={title}
                href="#"
                title={title}
                className="w-9 h-9 rounded-xl border border-gray-700 flex items-center justify-center text-xs font-black text-gray-400 hover:bg-yellow-400 hover:border-yellow-400 hover:text-[#0A2463] transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-yellow-400 font-black text-xs tracking-widest uppercase mb-5">Navigation</h4>
          <ul className="space-y-3">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'À Propos', to: '/a-propos' },
              { label: 'Notre Expertise', to: '/expertise' },
              { label: 'Nos Formations', to: '/expertise' },
              { label: 'Actualité', to: '/actualite' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-gray-400 text-sm hover:text-yellow-400 transition-colors flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-3 h-px bg-yellow-400 transition-all duration-200 inline-block" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Formations */}
        <div>
          <h4 className="text-yellow-400 font-black text-xs tracking-widest uppercase mb-5">Formations</h4>
          <ul className="space-y-3">
            {[
              'Gestion Administrative',
              'Développement RH',
              'Gestion du Changement',
              'Leadership Stratégique',
              'Finance & Comptabilité',
              'Marketing Digital',
            ].map(f => (
              <li key={f}>
                <Link to="/inscription" className="text-gray-400 text-sm hover:text-yellow-400 transition-colors flex items-center gap-1 group">
                  <span className="w-0 group-hover:w-3 h-px bg-yellow-400 transition-all duration-200 inline-block" />
                  {f}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-yellow-400 font-black text-xs tracking-widest uppercase mb-5">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin size={15} className="text-yellow-400 mt-0.5 shrink-0" />
              Koweit City, Cameroun, Afrique
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Mail size={15} className="text-yellow-400 shrink-0" />
              <a href="mailto:contact@africancapabilitynetwork.com" className="hover:text-yellow-400 transition-colors break-all">
                contact@africancapabilitynetwork.com
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Phone size={15} className="text-yellow-400 shrink-0" />
              (237) 677 32 18 87
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <Phone size={15} className="text-yellow-400 shrink-0" />
              (237) 694 87 02 71
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} African Capability Network. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
