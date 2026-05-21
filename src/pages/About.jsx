import { Target, Eye, Heart } from 'lucide-react'

export default function About() {
  return (
    <main className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-center uppercase tracking-widest mb-2 text-gray-800">À Propos de Nous</h1>
        <span className="dotted-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">
          <div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              African Capability Network (ACN) est une organisation spécialisée dans le développement des
              compétences professionnelles en Afrique. Nous accompagnons les entreprises et les individus
              dans leur croissance à travers des formations certifiantes et des services de conseil de haut niveau.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Notre mission est de renforcer les capacités professionnelles africaines en offrant des solutions
              adaptées aux besoins du marché local et international.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
            alt="À propos de ACN"
            className="rounded-2xl shadow-xl object-cover h-80 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { icon: Target, title: 'Notre Mission', text: 'Développer les compétences professionnelles pour un Afrique plus compétitif sur la scène internationale.' },
            { icon: Eye, title: 'Notre Vision', text: 'Être le leader africain en matière de développement des capacités professionnelles et institutionnelles.' },
            { icon: Heart, title: 'Nos Valeurs', text: 'Intégrité, Excellence, Professionnalisme et Innovation au service de nos clients.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-sky-600" />
              </div>
              <h3 className="font-black text-gray-800 text-lg mb-3">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
