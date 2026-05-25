/* Carte cliquable représentant un service RH.
   Au clic, pré-sélectionne le service dans le formulaire parent. */
export default function ServiceCard({ service, selectionne, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center w-full
        ${selectionne
          ? 'border-yellow-400 bg-yellow-50 shadow-md scale-[1.03]'
          : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-sm'
        }`}
    >
      <span className="text-2xl">{service.icone}</span>
      <span className={`text-xs font-bold tracking-wide ${selectionne ? 'text-[#0A2463]' : 'text-gray-600'}`}>
        {service.label}
      </span>
    </button>
  )
}
