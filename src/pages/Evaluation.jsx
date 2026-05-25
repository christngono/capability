import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"
import {
  doc, getDoc, addDoc, collection, serverTimestamp,
} from "firebase/firestore"
import { db } from "@/firebase"

/* ── Validation email simple ─────────────────────── */
function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/* ── Calcul du score ─────────────────────────────── */
function calculerScore(surveyJSON, reponses) {
  const pages = surveyJSON.pages || []
  const elements = pages.flatMap((p) => p.elements || [])
  let bonnes = 0
  let total = 0

  elements.forEach((el) => {
    if (!["radiogroup", "checkbox"].includes(el.type)) return
    if (el.correctAnswer === undefined) return
    total++
    const rep = reponses[el.name]
    if (el.type === "checkbox") {
      const attend = Array.isArray(el.correctAnswer)
        ? [...el.correctAnswer].sort().join(",")
        : el.correctAnswer
      const donne = Array.isArray(rep)
        ? [...rep].sort().join(",")
        : rep
      if (attend === donne) bonnes++
    } else {
      if (rep === el.correctAnswer) bonnes++
    }
  })

  const score = total > 0 ? Math.round((bonnes / total) * 100) : 0
  return { score, bonnesReponses: bonnes, totalQuestionsNotees: total }
}

/* ── Formater MM:SS ──────────────────────────────── */
function formatTimer(secondes) {
  const m = Math.floor(secondes / 60)
  const s = secondes % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

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
        {/* En-tête */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email *
            </label>
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
════════════════════════════════════════════════════ */
function EcranEvaluation({ test, nomCandidat, emailCandidat, onTermine }) {
  const [tempsRestant, setTempsRestant] = useState(test.duree * 60)
  const [soumisAuto, setSoumisAuto] = useState(false)
  const intervalRef = useRef(null)
  const surveyRef = useRef(null)

  if (!surveyRef.current) {
    const survey = new Model(test.surveyJSON)
    survey.showNavigationButtons = true
    survey.showProgressBar = "top"
    survey.progressBarType = "questions"
    surveyRef.current = survey
  }
  const survey = surveyRef.current

  /* Chronomètre maison */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTempsRestant((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setSoumisAuto(true)
          survey.completeLastPage()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  /* Événement de complétion SurveyJS */
  useEffect(() => {
    survey.onComplete.add((sender) => {
      clearInterval(intervalRef.current)
      const reponses = sender.data
      const { score, bonnesReponses, totalQuestionsNotees } = calculerScore(test.surveyJSON, reponses)
      const tempsUtilise = (test.duree * 60) - tempsRestant

      onTermine({
        score,
        bonnesReponses,
        totalQuestionsNotees,
        reponses,
        tempsUtilise,
        soumisAutomatiquement: soumisAuto,
      })
    })
  }, [tempsRestant, soumisAuto])

  /* Couleur du timer */
  const timerClass = tempsRestant <= 60
    ? "text-red-600 animate-pulse font-black"
    : tempsRestant <= 120
      ? "text-orange-500 font-black"
      : "text-gray-700 font-bold"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre timer */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/acn-logo.png" alt="ACN" className="h-8" />
          <span className="text-sm text-gray-500 hidden sm:block">{test.titre}</span>
        </div>
        <div className={`text-2xl tabular-nums ${timerClass}`}>
          ⏱ {formatTimer(tempsRestant)}
        </div>
        <div className="text-sm text-gray-500 hidden sm:block">{nomCandidat}</div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Survey model={survey} />
      </div>
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
  const [phase, setPhase] = useState("accueil") // accueil | evaluation
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
        onDemarrer={(nom, email) => {
          setCandidat({ nom, email })
          setPhase("evaluation")
        }}
      />
    )
  }

  return (
    <EcranEvaluation
      test={test}
      nomCandidat={candidat.nom}
      emailCandidat={candidat.email}
      onTermine={handleTermine}
    />
  )
}
