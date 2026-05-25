import { useState, useEffect, useRef, memo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"
import {
  doc, getDoc, addDoc, collection, serverTimestamp,
} from "firebase/firestore"
import { db } from "@/firebase"

function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function calculerScore(surveyJSON, reponses) {
  const elements = (surveyJSON.pages || []).flatMap((p) => p.elements || [])
  let bonnes = 0, total = 0
  elements.forEach((el) => {
    if (!["radiogroup", "checkbox"].includes(el.type)) return
    if (el.correctAnswer === undefined) return
    total++
    const rep = reponses[el.name]
    if (el.type === "checkbox") {
      const attend = [...(Array.isArray(el.correctAnswer) ? el.correctAnswer : [el.correctAnswer])].sort().join(",")
      const donne = [...(Array.isArray(rep) ? rep : [rep])].sort().join(",")
      if (attend === donne) bonnes++
    } else {
      if (rep === el.correctAnswer) bonnes++
    }
  })
  return { score: total > 0 ? Math.round((bonnes / total) * 100) : 0, bonnesReponses: bonnes, totalQuestionsNotees: total }
}

/* ── Timer isolé — seul lui re-render toutes les secondes ── */
const TimerBar = memo(function TimerBar({ dureeSecondes, titre, nomCandidat }) {
  const [tempsRestant, setTempsRestant] = useState(dureeSecondes)

  useEffect(() => {
    const id = setInterval(() => setTempsRestant((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const m = Math.floor(tempsRestant / 60)
  const s = String(tempsRestant % 60).padStart(2, "0")
  const classe = tempsRestant <= 60
    ? "text-red-600 animate-pulse font-black"
    : tempsRestant <= 120
      ? "text-orange-500 font-black"
      : "text-gray-700 font-bold"

  return (
    <div className="sticky top-0 z-30 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/acn-logo.png" alt="ACN" className="h-8" />
        <span className="text-sm text-gray-500 hidden sm:block">{titre}</span>
      </div>
      <div className={`text-2xl tabular-nums ${classe}`}>
        ⏱ {String(m).padStart(2, "0")}:{s}
      </div>
      <div className="text-sm text-gray-500 hidden sm:block">{nomCandidat}</div>
    </div>
  )
})

/* ── Wrapper Survey stable — ne re-render jamais depuis le timer ── */
const SurveyWrapper = memo(function SurveyWrapper({ model }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Survey model={model} />
    </div>
  )
})

/* ════════════════════════════════════════════════════
   ÉCRAN D'ACCUEIL
════════════════════════════════════════════════════ */
function EcranAccueil({ test, onDemarrer }) {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [erreurs, setErreurs] = useState({})

  function valider(e) {
    e.preventDefault()
    const err = {}
    if (!nom.trim()) err.nom = "Votre nom est requis."
    if (!emailValide(email)) err.email = "Adresse email invalide."
    if (Object.keys(err).length) { setErreurs(err); return }
    onDemarrer(nom.trim(), email.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] to-sky-700 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <img src="/acn-logo.png" alt="ACN" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0A2463]">{test.titre}</h1>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <span>⏱ {test.duree} minutes</span>
            <span>📋 {test.nombreQuestions} questions</span>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
          Une fois commencé, le chronomètre ne s'arrête pas. Préparez-vous avant de démarrer.
        </div>
        <form onSubmit={valider} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => { setNom(e.target.value); setErreurs((p) => ({ ...p, nom: "" })) }}
              placeholder="Jean Dupont"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30"
            />
            {erreurs.nom && <p className="text-red-500 text-xs mt-1">{erreurs.nom}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErreurs((p) => ({ ...p, email: "" })) }}
              placeholder="jean.dupont@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30"
            />
            {erreurs.email && <p className="text-red-500 text-xs mt-1">{erreurs.email}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#0A2463] text-white font-bold py-3 rounded-xl hover:bg-[#1a3a8f] transition-colors"
          >
            Commencer l'évaluation →
          </button>
        </form>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   ÉCRAN D'ÉVALUATION
   — EcranEvaluation ne re-render plus depuis le timer.
     Le timer (TimerBar) et le formulaire (SurveyWrapper)
     sont des composants séparés et mémoïsés.
════════════════════════════════════════════════════ */
function EcranEvaluation({ test, nomCandidat, onTermine }) {
  /* Refs pour suivre le temps sans déclencher de re-render */
  const tempsRestantRef = useRef(test.duree * 60)
  const soumisAutoRef = useRef(false)
  const intervalRef = useRef(null)
  const surveyRef = useRef(null)

  /* Créer le modèle SurveyJS une seule fois */
  if (!surveyRef.current) {
    const survey = new Model(test.surveyJSON)
    survey.showNavigationButtons = true
    survey.showProgressBar = "top"
    survey.progressBarType = "questions"
    surveyRef.current = survey
  }

  /* Enregistrer onComplete une seule fois */
  useEffect(() => {
    surveyRef.current.onComplete.add((sender) => {
      clearInterval(intervalRef.current)
      const tempsUtilise = (test.duree * 60) - tempsRestantRef.current
      onTermine({
        ...calculerScore(test.surveyJSON, sender.data),
        reponses: sender.data,
        tempsUtilise,
        soumisAutomatiquement: soumisAutoRef.current,
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Chronomètre — met à jour uniquement le ref, pas le state */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      tempsRestantRef.current -= 1
      if (tempsRestantRef.current <= 0) {
        clearInterval(intervalRef.current)
        soumisAutoRef.current = true
        surveyRef.current.completeLastPage()
      }
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TimerBar gère son propre state — n'affecte pas Survey */}
      <TimerBar
        dureeSecondes={test.duree * 60}
        titre={test.titre}
        nomCandidat={nomCandidat}
      />
      {/* SurveyWrapper mémoïsé — ne re-render jamais depuis le timer */}
      <SurveyWrapper model={surveyRef.current} />
    </div>
  )
}

/* ════════════════════════════════════════════════════
   PAGE PRINCIPALE /evaluation/:testId
════════════════════════════════════════════════════ */
export default function Evaluation() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState("")
  const [phase, setPhase] = useState("accueil")
  const [candidat, setCandidat] = useState({ nom: "", email: "" })

  useEffect(() => {
    async function charger() {
      try {
        const snap = await getDoc(doc(db, "tests", testId))
        if (!snap.exists()) { setErreur("Ce test n'existe pas."); return }
        const data = snap.data()
        if (!data.actif) { setErreur("Ce test n'est plus disponible."); return }
        setTest({ id: snap.id, ...data })
      } catch {
        setErreur("Erreur lors du chargement du test.")
      } finally {
        setChargement(false)
      }
    }
    charger()
  }, [testId])

  async function handleTermine(resultats) {
    try {
      await addDoc(collection(db, "resultats"), {
        testId,
        titreDuTest: test.titre,
        nomCandidat: candidat.nom,
        emailCandidat: candidat.email,
        score: resultats.score,
        bonnesReponses: resultats.bonnesReponses,
        totalQuestionsNotees: resultats.totalQuestionsNotees,
        reponses: resultats.reponses,
        surveyJSON: test.surveyJSON,
        tempsUtilise: resultats.tempsUtilise,
        dureeTest: test.duree,
        soumisAutomatiquement: resultats.soumisAutomatiquement,
        createdAt: serverTimestamp(),
      })
    } catch (e) {
      console.error("Erreur sauvegarde résultat:", e)
    }
    navigate(`/evaluation/${testId}/resultat`, {
      state: { ...resultats, nomCandidat: candidat.nom, titreDuTest: test.titre },
    })
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2463] to-sky-700">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement du test…</p>
        </div>
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <p className="text-6xl mb-4">⚠️</p>
          <h1 className="text-xl font-black text-gray-800 mb-2">{erreur}</h1>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-[#0A2463] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#1a3a8f] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  if (phase === "accueil") {
    return (
      <EcranAccueil
        test={test}
        onDemarrer={(nom, email) => { setCandidat({ nom, email }); setPhase("evaluation") }}
      />
    )
  }

  return (
    <EcranEvaluation
      test={test}
      nomCandidat={candidat.nom}
      onTermine={handleTermine}
    />
  )
}
