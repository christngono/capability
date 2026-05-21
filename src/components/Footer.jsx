import { Share2, MessageCircle, Globe, AtSign, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-sky-700 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-black tracking-wide mb-3">
            AFRICAN CAPABILITY<br />
            <span className="text-yellow-400">NETWORK</span>
          </h3>
          <p className="text-sky-100 text-sm leading-relaxed">
            Nous développons les compétences professionnelles pour un Africa plus compétitif.
          </p>
          <div className="flex gap-4 mt-5">
            {[Share2, MessageCircle, Globe, AtSign].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-sky-400 flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-400 hover:text-sky-900 transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-yellow-400 mb-4 text-sm tracking-widest uppercase">Navigation</h4>
          <ul className="space-y-2 text-sm text-sky-100">
            {['Accueil', 'À Propos', 'Notre Expertise', 'Nos Formations', 'Actualité', 'Inscription'].map(l => (
              <li key={l}><a href="#" className="hover:text-yellow-300 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-yellow-400 mb-4 text-sm tracking-widest uppercase">Contact</h4>
          <ul className="space-y-3 text-sm text-sky-100">
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-yellow-400" /> Koweit City, Cameroun</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-yellow-400" /> contact@africancapabilitynetwork.com</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-yellow-400" /> (237) 677 32 18 87</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-yellow-400" /> (237) 694 87 02 71</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-sky-600 py-4 text-center text-xs text-sky-200">
        Copyright © {new Date().getFullYear()} African Capability Network — Tous droits réservés
      </div>
    </footer>
  )
}
