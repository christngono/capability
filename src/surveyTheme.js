/* Personnalisation du thème SurveyJS v2 pour la charte ACN (navy + gold).
   StylesManager a été supprimé en v2 — on surcharge directement les variables CSS. */
export function applyACNTheme() {
  const root = document.documentElement
  root.style.setProperty("--sjs-primary-backcolor", "#0A2463")
  root.style.setProperty("--sjs-primary-backcolor-light", "rgba(10,36,99,0.1)")
  root.style.setProperty("--sjs-primary-forecolor", "#ffffff")
  root.style.setProperty("--sjs-special-backcolor", "#D4A017")
  root.style.setProperty("--sjs-general-backcolor", "#f9fafb")
  root.style.setProperty("--sjs-general-backcolor-dark", "#f3f4f6")
  root.style.setProperty("--sjs-border-default", "#e5e7eb")
  root.style.setProperty("--sjs-font-size", "15px")
}
