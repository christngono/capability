import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "@/firebase"

export default function EvaluationResultat() {
  const { testId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  /* Les données peuvent venir de location.state (navigation directe)
     ou être rechargées depuis Firestore si l'utilisateur rafraîchit la page */
  const [data, setData] = useState(location.state || null)
  const [chargement, setChargement] = useState(!location.state)

  useEffect(() => {
    if (location.state) return
    async function charger() {
      const snap = await getDocs(
        query(
          collection(db, "resultats"),
          where("testId", "==", testId),
          orderBy("createdAt", "desc"),
          limit(1)
        )
      )
      if (!snap.empty) {
        const d = snap.docs[0].data()
        setData({
          score: d.score,
          bonnesReponses: d.bonnesReponses,
          totalQuestionsNotees: d.totalQuestionsNotees,
          tempsUtilise: d.tempsUtilise,
          dureeTest: d.dureeTest,
          soumisAutomatiquement: d.soumisAutomatiquement,
          nomCandidat: d.nomCandidat,
          titreDuTest: d.titreDuTest,
        })
      }
      setChargement(false)
    }
    charger()
  }, [testId])

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0A2463]/20 border-t-[#0A2463] rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-gray-600 mb-6">Résultat introuvable.</p>
          <button onClick={() => navigate("/")} className="bg-[#0A2463] text-white px-6 py-2 rounded-xl text-sm">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  const { score, bonnesReponses, totalQuestionsNotees, tempsUtilise, dureeTest, soumisAutomatiquement, nomCandidat, titreDuTest } = data
  const reussi = score >= 70

  /* Couleur du cercle score */
  const cercleColor = score >= 70
    ? { bg: "bg-green-100", text: "text-green-600", ring: "ring-green-400" }
    : score >= 50
      ? { bg: "bg-orange-100", text: "text-orange-600", ring: "ring-orange-400" }
      : { bg: "bg-red-100", text: "text-red-600", ring: "ring-red-400" }

  /* Formater le temps */
  const tempsM = Math.floor((tempsUtilise ?? 0) / 60)
  const tempsS = (tempsUtilise ?? 0) % 60
  const dureeM = (dureeTest ?? 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2463] to-sky-700 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <img src="/acn-logo.png" alt="ACN" className="h-10 mx-auto mb-6" />

        {/* Cercle score */}
        <div className={`w-36 h-36 ${cercleColor.bg} ${cercleColor.ring} ring-4 rounded-full flex flex-col items-center justify-center mx-auto mb-6`}>
          <span className={`text-4xl font-black ${cercleColor.text}`}>{score}%</span>
          <span className="text-xs text-gray-500 mt-0.5">Score</span>
        </div>

        {/* Message */}
        <h1 className={`text-xl font-black mb-2 ${reussi ? "text-green-700" : "text-gray-700"}`}>
          {reussi ? "🎉 Félicitations, vous avez réussi !" : "Merci pour votre participation"}
        </h1>
        {nomCandidat && <p className="text-gray-500 text-sm mb-1">{nomCandidat}</p>}
        {titreDuTest && <p className="text-gray-400 text-xs mb-6">{titreDuTest}</p>}

        {/* Détails */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-black text-[#0A2463]">
              {bonnesReponses ?? 0}/{totalQuestionsNotees ?? 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Bonnes réponses</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-black text-[#0A2463]">
              {tempsM}m{String(tempsS).padStart(2, "0")}s
            </p>
            <p className="text-xs text-gray-500 mt-1">Temps utilisé / {dureeM} min</p>
          </div>
        </div>

        {/* Badge soumission automatique */}
        {soumisAutomatiquement && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium px-4 py-2 rounded-full inline-block mb-6">
            ⏰ Temps écoulé — soumission automatique
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#0A2463] text-white font-bold py-3 rounded-xl hover:bg-[#1a3a8f] transition-colors text-sm"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
