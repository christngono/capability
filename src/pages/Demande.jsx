import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'

/* ── Liste des services disponibles ─────────────────────── */
const SERVICES = [
  { valeur: 'Formation',    label: 'Formation',    icone: '🎓' },
  { valeur: 'Recrutement',  label: 'Recrutement',  icone: '🔍' },
  { valeur: 'Conseil RH',   label: 'Conseil RH',   icone: '💼' },
  { valeur: 'Audit RH',     label: 'Audit RH',     icone: '📋' },
  { valeur: 'Autre',        label: 'Autre',        icone: '✉️' },
]

/* ── Validation du formulaire ────────────────────────────── */
function validerChamps(champs) {
  const erreurs = {}
  if (!champs.service) erreurs.service = 'Veuillez sélectionner un service.'
  if (!champs.prenom.trim()) erreurs.prenom = 'Prénom requis.'
  if (!champs.nom.trim()) erreurs.nom = 'Nom requis.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email)) erreurs.email = 'Adresse email invalide.'
  if (!champs.telephone.trim()) erreurs.telephone = 'Téléphone requis.'
  if (!champs.entreprise.trim()) erreurs.entreprise = "Nom de l'entreprise requis."
  if (champs.message.trim().length < 20) erreurs.message = 'Le message doit contenir au moins 20 caractères.'
  return erreurs
}

/* ── Champ de formulaire réutilisable ────────────────────── */
function Champ({ label, erreur, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {erreur && <p className="text-red-500 text-xs mt-0.5">{erreur}</p>}
    </div>
  )
}

/* ── Style commun pour les inputs / select / textarea ─────── */
const inputClass = (erreur) =>
  `w-full border rounded-xl px-4 py-3 text-sm bg-white transition-all duration-150
  focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30 focus:border-[#0A2463]
  ${erreur ? 'border-red-400' : 'border-gray-300'}`

/* ════════════════════════════════════════════════════════════
   PAGE DEMANDE
════════════════════════════════════════════════════════════ */
export default function Demande() {
  const formRef = useRef(null)
  const [champs, setChamps] = useState({
    service: '', prenom: '', nom: '',
    email: '', telephone: '', entreprise: '', message: '',
  })
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState('idle') // idle | loading | succes | erreur
  const [erreurEnvoi, setErreurEnvoi] = useState('')

  /* Mise à jour d'un champ + effacement de son erreur */
  function maj(champ, valeur) {
    setChamps((p) => ({ ...p, [champ]: valeur }))
    setErreurs((p) => ({ ...p, [champ]: '' }))
  }

  /* Soumission du formulaire */
  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validerChamps(champs)
    if (Object.keys(errs).length) { setErreurs(errs); return }

    setEnvoi('loading')
    setErreurEnvoi('')

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      )
      setEnvoi('succes')
    } catch (err) {
      console.error('EmailJS error:', err)
      setErreurEnvoi("Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.")
      setEnvoi('erreur')
    }
  }

  /* Réinitialiser pour une nouvelle demande */
  function nouvelledemande() {
    setChamps({ service: '', prenom: '', nom: '', email: '', telephone: '', entreprise: '', message: '' })
    setErreurs({})
    setEnvoi('idle')
    setErreurEnvoi('')
  }

  /* ── Écran de succès ── */
  if (envoi === 'succes') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0A2463] to-sky-700 flex items-center justify-center px-4 py-24">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-5" />
          <h2 className="text-2xl font-black text-[#0A2463] mb-3">Demande envoyée !</h2>
          <p className="text-gray-600 mb-2">
            Merci pour votre message, <strong>{champs.prenom}</strong>.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Notre équipe vous recontactera sous <strong>48h</strong> à l'adresse{' '}
            <span className="text-sky-600">{champs.email}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={nouvelledemande} className="btn-gold w-full text-sm">
              Nouvelle demande
            </button>
            <Link to="/" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#0A2463] transition-colors">
              <ArrowLeft size={14} /> Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-r from-[#0A2463] to-sky-700 pt-32 pb-16 px-6 text-center">
        <span className="inline-flex items-center gap-2 border border-yellow-400/50 bg-yellow-400/10 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-300 text-xs font-semibold tracking-wide">Services RH</span>
        </span>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
          Sollicitez nos <span className="text-yellow-400">services</span>
        </h1>
        <p className="text-sky-200 text-lg max-w-xl mx-auto">
          Dites-nous ce dont vous avez besoin. Notre équipe vous répond sous 48h avec une proposition adaptée.
        </p>
      </section>

      {/* ── Cartes de services ── */}
      <section className="bg-gray-50 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-5 font-medium">
            Sélectionnez un service pour pré-remplir le formulaire
          </p>
          <div className="grid grid-cols-5 gap-3">
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.valeur}
                service={s}
                selectionne={champs.service === s.valeur}
                onClick={() => maj('service', s.valeur)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Formulaire ── */}
      <section className="bg-gray-50 pb-20 px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-gray-100">
          <h2 className="text-xl font-black text-[#0A2463] mb-6">Votre demande</h2>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Service */}
            <Champ label="Service souhaité *" erreur={erreurs.service}>
              <select
                name="service"
                value={champs.service}
                onChange={(e) => maj('service', e.target.value)}
                className={inputClass(erreurs.service) + ' appearance-none cursor-pointer'}
              >
                <option value="">— Choisissez un service —</option>
                {SERVICES.map((s) => (
                  <option key={s.valeur} value={s.valeur}>{s.icone} {s.label}</option>
                ))}
              </select>
            </Champ>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Champ label="Prénom *" erreur={erreurs.prenom}>
                <input
                  name="prenom"
                  type="text"
                  value={champs.prenom}
                  onChange={(e) => maj('prenom', e.target.value)}
                  placeholder="Jean"
                  className={inputClass(erreurs.prenom)}
                />
              </Champ>
              <Champ label="Nom *" erreur={erreurs.nom}>
                <input
                  name="nom"
                  type="text"
                  value={champs.nom}
                  onChange={(e) => maj('nom', e.target.value)}
                  placeholder="Dupont"
                  className={inputClass(erreurs.nom)}
                />
              </Champ>
            </div>

            {/* Email */}
            <Champ label="Email professionnel *" erreur={erreurs.email}>
              <input
                name="email"
                type="email"
                value={champs.email}
                onChange={(e) => maj('email', e.target.value)}
                placeholder="jean.dupont@entreprise.com"
                className={inputClass(erreurs.email)}
              />
            </Champ>

            {/* Téléphone + Entreprise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Champ label="Téléphone *" erreur={erreurs.telephone}>
                <input
                  name="telephone"
                  type="tel"
                  value={champs.telephone}
                  onChange={(e) => maj('telephone', e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  className={inputClass(erreurs.telephone)}
                />
              </Champ>
              <Champ label="Entreprise *" erreur={erreurs.entreprise}>
                <input
                  name="entreprise"
                  type="text"
                  value={champs.entreprise}
                  onChange={(e) => maj('entreprise', e.target.value)}
                  placeholder="Nom de votre entreprise"
                  className={inputClass(erreurs.entreprise)}
                />
              </Champ>
            </div>

            {/* Message */}
            <Champ label="Décrivez votre besoin *" erreur={erreurs.message}>
              <textarea
                name="message"
                rows={5}
                value={champs.message}
                onChange={(e) => maj('message', e.target.value)}
                placeholder="Expliquez votre besoin en quelques phrases (contexte, effectif concerné, délai souhaité…)"
                className={inputClass(erreurs.message) + ' resize-none'}
              />
              <span className="text-xs text-gray-400 text-right -mt-1">
                {champs.message.length} caractères (min. 20)
              </span>
            </Champ>

            {/* Erreur d'envoi */}
            {envoi === 'erreur' && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {erreurEnvoi}
              </p>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={envoi === 'loading'}
              className="btn-gold w-full text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {envoi === 'loading' ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>

            <p className="text-xs text-center text-gray-400">
              Vos informations sont confidentielles et ne seront jamais partagées.
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
