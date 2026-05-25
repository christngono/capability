import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  PlusCircle, ClipboardList, BarChart2, LogOut,
  Copy, Trash2, Eye, Download, ToggleLeft, ToggleRight,
} from "lucide-react"
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"
import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, writeBatch,
} from "firebase/firestore"
import { db } from "@/firebase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

/* ── Options du Creator SurveyJS ─────────────────────────── */
const creatorOptions = {
  showLogicTab: false,
  showTranslationTab: false,
  showJSONEditorTab: false,
  isAutoSave: false,
  showPreviewTab: true,
  questionTypes: ["text", "radiogroup", "checkbox", "rating", "comment"],
}

/* ── Utilitaire : formater une date Firestore ───────────── */
function formatDate(ts) {
  if (!ts) return "—"
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

/* ── Générer le lien candidat ───────────────────────────── */
function lienEvaluation(testId) {
  return `${window.location.origin}/evaluation/${testId}`
}

/* ═══════════════════════════════════════════════════════════
   Extraire toutes les questions notables du surveyJSON
═══════════════════════════════════════════════════════════ */
function extraireQuestionsQCM(surveyJSON) {
  const pages = surveyJSON.pages || []
  return pages.flatMap((p) =>
    (p.elements || []).filter((el) => ["radiogroup", "checkbox"].includes(el.type))
  )
}

/* ═══════════════════════════════════════════════════════════
   Dialog — Configurer les bonnes réponses
═══════════════════════════════════════════════════════════ */
function DialogBonnesReponses({ open, onOpenChange, surveyJSON, onConfirmer }) {
  const questions = extraireQuestionsQCM(surveyJSON)
  // État local : { [questionName]: valeur ou tableau }
  const [reponses, setReponses] = useState(() => {
    const init = {}
    questions.forEach((q) => { init[q.name] = q.correctAnswer ?? (q.type === "checkbox" ? [] : "") })
    return init
  })

  function toggleCheckbox(name, valeur) {
    setReponses((prev) => {
      const actuel = Array.isArray(prev[name]) ? prev[name] : []
      return {
        ...prev,
        [name]: actuel.includes(valeur)
          ? actuel.filter((v) => v !== valeur)
          : [...actuel, valeur],
      }
    })
  }

  function handleConfirmer() {
    // Injecter correctAnswer dans chaque question du surveyJSON
    const json = JSON.parse(JSON.stringify(surveyJSON))
    ;(json.pages || []).forEach((page) => {
      ;(page.elements || []).forEach((el) => {
        if (reponses[el.name] !== undefined) {
          el.correctAnswer = reponses[el.name]
        }
      })
    })
    onConfirmer(json)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0A2463]">🎯 Configurer les bonnes réponses</DialogTitle>
        </DialogHeader>

        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-3">📝</p>
            <p className="font-medium text-gray-600">Aucune question QCM détectée.</p>
            <p className="text-sm mt-1">
              Seules les questions <strong>Choix unique</strong> et <strong>Cases à cocher</strong>
              sont notées automatiquement. Vous pouvez enregistrer sans configurer de réponses.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {questions.map((q, idx) => {
              const choices = q.choices || []
              return (
                <div key={q.name} className="border rounded-xl p-4 bg-gray-50">
                  <p className="font-semibold text-gray-800 mb-1 text-sm">
                    <span className="inline-block bg-[#0A2463] text-white text-xs rounded-full w-5 h-5 text-center leading-5 mr-2">{idx + 1}</span>
                    {q.title || q.name}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {q.type === "radiogroup" ? "Choix unique — sélectionnez la bonne réponse" : "Cases à cocher — sélectionnez toutes les bonnes réponses"}
                  </p>

                  {q.type === "radiogroup" ? (
                    <div className="space-y-2">
                      {choices.map((c) => {
                        const val = typeof c === "object" ? c.value : c
                        const label = typeof c === "object" ? (c.text || c.value) : c
                        const selectionne = reponses[q.name] === val
                        return (
                          <label
                            key={val}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selectionne
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.name}
                              value={val}
                              checked={selectionne}
                              onChange={() => setReponses((p) => ({ ...p, [q.name]: val }))}
                              className="accent-green-600"
                            />
                            <span className={`text-sm ${selectionne ? "font-semibold text-green-700" : "text-gray-700"}`}>
                              {label}
                            </span>
                            {selectionne && <span className="ml-auto text-green-600 text-xs font-bold">✓ Bonne réponse</span>}
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {choices.map((c) => {
                        const val = typeof c === "object" ? c.value : c
                        const label = typeof c === "object" ? (c.text || c.value) : c
                        const selectionne = Array.isArray(reponses[q.name]) && reponses[q.name].includes(val)
                        return (
                          <label
                            key={val}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selectionne
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectionne}
                              onChange={() => toggleCheckbox(q.name, val)}
                              className="accent-green-600"
                            />
                            <span className={`text-sm ${selectionne ? "font-semibold text-green-700" : "text-gray-700"}`}>
                              {label}
                            </span>
                            {selectionne && <span className="ml-auto text-green-600 text-xs font-bold">✓</span>}
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button className="bg-[#0A2463] hover:bg-[#1a3a8f]" onClick={handleConfirmer}>
            Valider les réponses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 1 — CRÉER UN TEST
═══════════════════════════════════════════════════════════ */
function TabCreerTest() {
  const [titre, setTitre] = useState("")
  const [duree, setDuree] = useState(30)
  const [sauvegarde, setSauvegarde] = useState(false)
  const [lienGenere, setLienGenere] = useState("")
  const [copie, setCopie] = useState(false)
  const [dialogReponses, setDialogReponses] = useState(false)
  const creatorRef = useRef(null)

  if (!creatorRef.current) {
    creatorRef.current = new SurveyCreator(creatorOptions)
  }
  const creator = creatorRef.current

  /* Étape 1 : ouvrir le dialog des bonnes réponses */
  function handleOuvrirReponses() {
    if (!titre.trim()) { alert("Veuillez saisir un titre pour le test."); return }
    if (!duree || duree < 1) { alert("Veuillez saisir une durée valide."); return }
    const pages = creator.JSON.pages || []
    const total = pages.reduce((acc, p) => acc + (p.elements?.length ?? 0), 0)
    if (total === 0) { alert("Ajoutez au moins une question dans le Creator."); return }
    setDialogReponses(true)
  }

  /* Étape 2 : valider les réponses → enregistrer dans Firestore */
  async function handleConfirmerReponses(jsonFinal) {
    setDialogReponses(false)
    const pages = jsonFinal.pages || []
    const nombreQuestions = pages.reduce((acc, p) => acc + (p.elements?.length ?? 0), 0)
    const docRef = await addDoc(collection(db, "tests"), {
      titre: titre.trim(),
      duree: Number(duree),
      surveyJSON: jsonFinal,
      createdAt: serverTimestamp(),
      actif: true,
      nombreQuestions,
    })
    setLienGenere(lienEvaluation(docRef.id))
    setSauvegarde(true)
  }

  function handleCopier() {
    navigator.clipboard.writeText(lienGenere)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  function handleNouveauTest() {
    setSauvegarde(false)
    setLienGenere("")
    setTitre("")
    setDuree(30)
    creatorRef.current = new SurveyCreator(creatorOptions)
  }

  return (
    <div className="space-y-6">
      {/* Indicateur d'étapes */}
      <div className="flex items-center gap-3 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#0A2463] text-white text-xs font-black flex items-center justify-center">1</span>
          <span className="text-sm font-semibold text-[#0A2463]">Créer les questions</span>
        </div>
        <div className="flex-1 h-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-black flex items-center justify-center">2</span>
          <span className="text-sm font-semibold text-gray-400">Configurer les bonnes réponses</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div className="space-y-1.5">
          <Label htmlFor="titre-test">Titre du test *</Label>
          <Input
            id="titre-test"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex : Test de recrutement RH"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duree-test">Durée (minutes) *</Label>
          <Input
            id="duree-test"
            type="number"
            min={1}
            max={180}
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden" style={{ height: "600px" }}>
        <SurveyCreatorComponent creator={creator} />
      </div>

      <Button onClick={handleOuvrirReponses} className="bg-[#0A2463] hover:bg-[#1a3a8f]">
        Étape 2 — Configurer les bonnes réponses →
      </Button>

      {/* Dialog bonnes réponses */}
      {dialogReponses && (
        <DialogBonnesReponses
          open={dialogReponses}
          onOpenChange={setDialogReponses}
          surveyJSON={creator.JSON}
          onConfirmer={handleConfirmerReponses}
        />
      )}

      {/* Dialog lien généré */}
      <Dialog open={sauvegarde} onOpenChange={setSauvegarde}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A2463]">✅ Test enregistré !</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mb-3">Partagez ce lien avec vos candidats :</p>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
            <span className="text-xs text-gray-700 break-all flex-1">{lienGenere}</span>
            <Button size="sm" variant="outline" onClick={handleCopier} className="shrink-0">
              <Copy size={14} className="mr-1" />
              {copie ? "Copié !" : "Copier"}
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSauvegarde(false)}>Fermer</Button>
            <Button className="bg-[#0A2463] hover:bg-[#1a3a8f]" onClick={handleNouveauTest}>
              Créer un nouveau test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 2 — MES TESTS
═══════════════════════════════════════════════════════════ */
function TabMesTests() {
  const [tests, setTests] = useState([])
  const [chargement, setChargement] = useState(true)
  const [apercu, setApercu] = useState(null)
  const [suppression, setSuppression] = useState(null)
  const [copie, setCopie] = useState(null)

  useEffect(() => { chargerTests() }, [])

  async function chargerTests() {
    setChargement(true)
    const snap = await getDocs(query(collection(db, "tests"), orderBy("createdAt", "desc")))
    setTests(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setChargement(false)
  }

  async function toggleActif(test) {
    await updateDoc(doc(db, "tests", test.id), { actif: !test.actif })
    setTests((prev) => prev.map((t) => t.id === test.id ? { ...t, actif: !t.actif } : t))
  }

  async function supprimerTest(id) {
    await deleteDoc(doc(db, "tests", id))
    setTests((prev) => prev.filter((t) => t.id !== id))
    setSuppression(null)
  }

  function copierLien(id) {
    navigator.clipboard.writeText(lienEvaluation(id))
    setCopie(id)
    setTimeout(() => setCopie(null), 2000)
  }

  if (chargement) return <p className="text-center py-12 text-gray-500">Chargement…</p>
  if (!tests.length) return (
    <div className="text-center py-16 text-gray-400">
      <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
      <p>Aucun test créé pour l'instant.</p>
    </div>
  )

  return (
    <>
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.titre}</TableCell>
                <TableCell>{t.duree} min</TableCell>
                <TableCell>{t.nombreQuestions ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={t.actif ? "default" : "secondary"}
                    className={t.actif ? "bg-green-100 text-green-700 border-green-200" : ""}>
                    {t.actif ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(t.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" title="Copier le lien" onClick={() => copierLien(t.id)}>
                      <Copy size={15} className={copie === t.id ? "text-green-600" : ""} />
                    </Button>
                    <Button size="icon" variant="ghost" title="Aperçu" onClick={() => setApercu(t)}>
                      <Eye size={15} />
                    </Button>
                    <Button size="icon" variant="ghost" title={t.actif ? "Désactiver" : "Activer"} onClick={() => toggleActif(t)}>
                      {t.actif
                        ? <ToggleRight size={18} className="text-green-600" />
                        : <ToggleLeft size={18} className="text-gray-400" />}
                    </Button>
                    <Button size="icon" variant="ghost" title="Supprimer" onClick={() => setSuppression(t)}>
                      <Trash2 size={15} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog aperçu */}
      <Dialog open={!!apercu} onOpenChange={() => setApercu(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu — {apercu?.titre}</DialogTitle>
          </DialogHeader>
          {apercu && (() => {
            const model = new Model(apercu.surveyJSON)
            model.mode = "display"
            return <Survey model={model} />
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog suppression */}
      <Dialog open={!!suppression} onOpenChange={() => setSuppression(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Supprimer <strong>{suppression?.titre}</strong> ? Cette action est irréversible.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSuppression(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => supprimerTest(suppression.id)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 3 — RÉSULTATS
   • Filtre par test
   • Suppression individuelle
   • Vider tous les résultats d'un test
═══════════════════════════════════════════════════════════ */
function TabResultats() {
  const [tous, setTous] = useState([])          // tous les résultats chargés
  const [tests, setTests] = useState([])         // liste des tests pour le filtre
  const [testSelectionne, setTestSelectionne] = useState("tous")
  const [chargement, setChargement] = useState(true)
  const [detail, setDetail] = useState(null)
  const [suppressionUn, setSuppressionUn] = useState(null)   // un résultat
  const [viderConfirm, setViderConfirm] = useState(false)    // vider la sélection

  useEffect(() => { chargerDonnees() }, [])

  async function chargerDonnees() {
    setChargement(true)
    const [snapR, snapT] = await Promise.all([
      getDocs(query(collection(db, "resultats"), orderBy("createdAt", "desc"))),
      getDocs(query(collection(db, "tests"), orderBy("createdAt", "desc"))),
    ])
    setTests(snapT.docs.map((d) => ({ id: d.id, ...d.data() })))
    setTous(snapR.docs.map((d) => ({ id: d.id, ...d.data() })))
    setChargement(false)
  }

  /* Résultats filtrés selon le test sélectionné */
  const resultats = testSelectionne === "tous"
    ? tous
    : tous.filter((r) => r.testId === testSelectionne)

  /* Supprimer un seul résultat */
  async function supprimerUn(id) {
    await deleteDoc(doc(db, "resultats", id))
    setTous((prev) => prev.filter((r) => r.id !== id))
    setSuppressionUn(null)
  }

  /* Vider tous les résultats du filtre actuel (par lots de 500) */
  async function viderListe() {
    const aSupprimer = resultats
    const batch = writeBatch(db)
    aSupprimer.forEach((r) => batch.delete(doc(db, "resultats", r.id)))
    await batch.commit()
    const idsSupprimes = new Set(aSupprimer.map((r) => r.id))
    setTous((prev) => prev.filter((r) => !idsSupprimes.has(r.id)))
    setViderConfirm(false)
  }

  /* Export CSV des résultats filtrés */
  function exporterCSV() {
    const lignes = [
      ["Candidat", "Email", "Test", "Score", "Bonnes réponses", "Temps utilisé (s)", "Date"],
      ...resultats.map((r) => [
        r.nomCandidat, r.emailCandidat, r.titreDuTest,
        `${r.score ?? 0}%`,
        `${r.bonnesReponses ?? 0}/${r.totalQuestionsNotees ?? 0}`,
        r.tempsUtilise ?? 0,
        formatDate(r.createdAt),
      ]),
    ]
    const csv = lignes.map((l) => l.map((v) => `"${v}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url
    a.download = `resultats_${testSelectionne === "tous" ? "tous" : testSelectionne}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  /* Statistiques sur les résultats filtrés */
  const total = resultats.length
  const scoreMoyen = total ? Math.round(resultats.reduce((s, r) => s + (r.score ?? 0), 0) / total) : 0
  const tauxReussite = total ? Math.round((resultats.filter((r) => (r.score ?? 0) >= 70).length / total) * 100) : 0
  const testsActifs = tests.filter((t) => t.actif).length

  const stats = [
    { label: "Candidats", value: total, color: "text-[#0A2463]" },
    { label: "Score moyen", value: `${scoreMoyen}%`, color: "text-sky-600" },
    { label: "Taux de réussite", value: `${tauxReussite}%`, color: "text-green-600" },
    { label: "Tests actifs", value: testsActifs, color: "text-amber-600" },
  ]

  if (chargement) return <p className="text-center py-12 text-gray-500">Chargement…</p>

  return (
    <>
      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Barre de filtres + actions */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Filtre par test */}
        <select
          value={testSelectionne}
          onChange={(e) => setTestSelectionne(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2463]/30 flex-1 max-w-xs"
        >
          <option value="tous">Tous les tests ({tous.length} résultats)</option>
          {tests.map((t) => (
            <option key={t.id} value={t.id}>
              {t.titre} ({tous.filter((r) => r.testId === t.id).length} résultats)
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" onClick={exporterCSV} disabled={resultats.length === 0}>
            <Download size={14} className="mr-1.5" /> Exporter CSV
          </Button>
          <Button
            variant="destructive"
            onClick={() => setViderConfirm(true)}
            disabled={resultats.length === 0}
          >
            <Trash2 size={14} className="mr-1.5" />
            Vider la liste
          </Button>
        </div>
      </div>

      {resultats.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BarChart2 size={48} className="mx-auto mb-4 opacity-30" />
          <p>Aucun résultat{testSelectionne !== "tous" ? " pour ce test" : ""}.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Email</TableHead>
                {testSelectionne === "tous" && <TableHead>Test</TableHead>}
                <TableHead>Score</TableHead>
                <TableHead>Temps</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultats.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nomCandidat}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{r.emailCandidat}</TableCell>
                  {testSelectionne === "tous" && (
                    <TableCell className="text-sm text-gray-600 max-w-[160px] truncate">{r.titreDuTest}</TableCell>
                  )}
                  <TableCell>
                    <Badge className={
                      (r.score ?? 0) >= 70 ? "bg-green-100 text-green-700 border-green-200"
                        : (r.score ?? 0) >= 50 ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }>
                      {r.score ?? 0}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {Math.floor((r.tempsUtilise ?? 0) / 60)}m{String((r.tempsUtilise ?? 0) % 60).padStart(2, "0")}s
                  </TableCell>
                  <TableCell>{formatDate(r.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" title="Voir le détail" onClick={() => setDetail(r)}>
                        <Eye size={15} />
                      </Button>
                      <Button size="icon" variant="ghost" title="Supprimer" onClick={() => setSuppressionUn(r)}>
                        <Trash2 size={15} className="text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog — détail résultat */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detail?.nomCandidat} — {detail?.titreDuTest}</DialogTitle>
          </DialogHeader>
          {detail && (() => {
            const model = new Model(detail.surveyJSON)
            model.data = detail.reponses
            model.mode = "display"
            return (
              <div className="space-y-4">
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Score : <strong>{detail.score}%</strong></span>
                  <span>Bonnes réponses : <strong>{detail.bonnesReponses}/{detail.totalQuestionsNotees}</strong></span>
                </div>
                <Separator />
                <Survey model={model} />
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog — supprimer un résultat */}
      <Dialog open={!!suppressionUn} onOpenChange={() => setSuppressionUn(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer ce résultat ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Le résultat de <strong>{suppressionUn?.nomCandidat}</strong> sera définitivement supprimé.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSuppressionUn(null)}>Annuler</Button>
            <Button variant="destructive" onClick={() => supprimerUn(suppressionUn.id)}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog — vider la liste */}
      <Dialog open={viderConfirm} onOpenChange={setViderConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Vider la liste ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {testSelectionne === "tous"
              ? <>Vous allez supprimer <strong>tous les {resultats.length} résultats</strong>. Cette action est irréversible.</>
              : <>Vous allez supprimer les <strong>{resultats.length} résultats</strong> du test sélectionné. Cette action est irréversible.</>
            }
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setViderConfirm(false)}>Annuler</Button>
            <Button variant="destructive" onClick={viderListe}>Confirmer la suppression</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD PRINCIPAL
═══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [onglet, setOnglet] = useState("creer")
  const navigate = useNavigate()

  function seDeconnecter() {
    sessionStorage.removeItem("admin_auth")
    navigate("/admin/login")
  }

  const navItems = [
    { id: "creer", icon: PlusCircle, label: "Créer un test" },
    { id: "tests", icon: ClipboardList, label: "Mes tests" },
    { id: "resultats", icon: BarChart2, label: "Résultats" },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0A2463] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="font-black text-lg tracking-wide">ACN Admin</p>
          <p className="text-sky-300 text-xs mt-1">Espace administrateur</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setOnglet(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                onglet === id
                  ? "bg-white/15 text-white"
                  : "text-sky-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={seDeconnecter}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-sky-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Zone principale */}
      <main className="flex-1 p-8 overflow-auto">
        <Tabs value={onglet} onValueChange={setOnglet}>
          <TabsList className="mb-8">
            <TabsTrigger value="creer">Créer un test</TabsTrigger>
            <TabsTrigger value="tests">Mes tests</TabsTrigger>
            <TabsTrigger value="resultats">Résultats</TabsTrigger>
          </TabsList>

          <TabsContent value="creer">
            <TabCreerTest />
          </TabsContent>
          <TabsContent value="tests">
            <TabMesTests />
          </TabsContent>
          <TabsContent value="resultats">
            <TabResultats />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
