import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const formations = [
  { title: 'Gestion Administrative', desc: 'Maîtrisez les outils et techniques de gestion administrative moderne pour optimiser le fonctionnement de votre organisation.', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80' },
  { title: 'Développement RH', desc: 'Développez vos compétences en gestion des ressources humaines : recrutement, formation, évaluation et motivation des équipes.', img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&q=80' },
  { title: 'Gestion du Changement', desc: 'Accompagnez votre organisation dans les transitions et transformations grâce à des méthodes éprouvées de conduite du changement.', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80' },
  { title: 'Leadership & Management', desc: 'Renforcez vos capacités de leadership pour inspirer, motiver et diriger efficacement vos équipes vers l\'excellence.', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80' },
  { title: 'Finance & Comptabilité', desc: 'Acquérez les compétences financières essentielles pour piloter efficacement la performance de votre entreprise.', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
]

export default function Expertise() {
  return (
    <main className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-center uppercase tracking-widest mb-2 text-gray-800">Notre Expertise</h1>
        <span className="dotted-divider" />

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Nous proposons des formations certifiantes de haut niveau adaptées aux réalités africaines
          et aux standards internationaux.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formations.map(({ title, desc, img }) => (
            <div key={title} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="overflow-hidden h-48">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-black text-gray-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-1 text-sky-600 font-bold text-sm hover:text-sky-800 transition-colors"
                >
                  En savoir plus <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
