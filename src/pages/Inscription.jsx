import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const formations = [
  'Gestion Administrative',
  'Développement Ressources Humaines',
  'Gestion du Changement',
  'Leadership & Management',
  'Finance & Comptabilité',
  'Marketing Digital',
]

export default function Inscription() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', formation: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-black text-center uppercase tracking-widest mb-2 text-gray-800">Inscription</h1>
        <span className="dotted-divider" />
        <p className="text-center text-gray-600 mb-10">Remplissez le formulaire pour vous inscrire à l'une de nos formations.</p>

        {sent ? (
          <div className="text-center py-16">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">Inscription envoyée !</h2>
            <p className="text-gray-600">Nous vous contacterons dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet *</label>
                <input
                  required
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="jean@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
              <input
                value={form.telephone}
                onChange={e => setForm({ ...form, telephone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="(237) 6XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Formation souhaitée *</label>
              <select
                required
                value={form.formation}
                onChange={e => setForm({ ...form, formation: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              >
                <option value="">Choisissez une formation</option>
                {formations.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                placeholder="Informations complémentaires..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              <Send size={16} /> Envoyer ma demande
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
