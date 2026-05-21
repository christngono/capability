import { ArrowRight, Calendar } from 'lucide-react'

const article = {
  date: 'Septembre 2024',
  tag: "Offre d'emploi",
  title: 'Chargé(e) des Affaires Générales',
  desc: 'ACN recrute un(e) Chargé(e) des Affaires Générales. Date limite de soumission : 14 septembre 2024.',
  img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
}

export default function Actualite() {
  return (
    <main className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black text-center uppercase tracking-widest mb-2 text-gray-800">Actualité</h1>
        <span className="dotted-divider" />

        <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group mt-4">
          <div className="overflow-hidden h-64">
            <img
              src={article.img}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full">{article.tag}</span>
              <span className="flex items-center gap-1 text-gray-400 text-xs"><Calendar size={13} />{article.date}</span>
            </div>
            <h2 className="font-black text-gray-800 text-2xl mb-3">{article.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{article.desc}</p>
            <a href="#" className="btn-navy text-sm inline-flex items-center gap-2">
              Lire la suite <ArrowRight size={15} />
            </a>
          </div>
        </article>
      </div>
    </main>
  )
}
