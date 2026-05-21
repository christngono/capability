import { Phone, UserCheck } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="bg-sky-600 text-white text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#inscription" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
          <UserCheck size={15} />
          <span>Vous êtes candidat</span>
        </a>
        <div className="flex items-center gap-2">
          <Phone size={14} />
          <span>(237) 677 32 18 87 | 694 87 02 71</span>
        </div>
      </div>
    </div>
  )
}
