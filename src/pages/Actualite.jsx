import { ArrowRight, Calendar } from 'lucide-react'

const articles = [
  { date: 'Septembre 2024', tag: 'Offre d\'emploi', title: 'Chargé(e) des Affaires Générales', desc: 'ACN recrute un(e) Chargé(e) des Affaires Générales. Date limite : 14 septembre 2024.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' },
  { date: 'Août 2024', tag: 'Formation', title: 'Nouvelle formation en Leadership', desc: 'ACN lance une nouvelle formation certifiante en Leadership et Management stratégique.', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80' },
  { date: 'Juillet 2024', tag: 'Partenariat', title: 'Partenariat avec des institutions internationales', desc: 'ACN signe un partenariat stratégique avec des institutions de formation internationales.', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80' },
]

export default function Actualite() {
  return (
    <main className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-center uppercase tracking-widest mb-2 text-gray-800">Actualité</h1>
        <span className="dotted-divider" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {articles.map(({ date, tag, title, desc, img }) => (
            <article key={title} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group">
              <div className="overflow-hidden h-48">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs"><Calendar size={12} />{date}</span>
                </div>
                <h3 className="font-black text-gray-800 text-base mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
                <a href="#" className="inline-flex items-center gap-1 text-sky-600 font-bold text-sm hover:text-sky-800">
                  Lire la suite <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
