import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (motDePasse === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true")
      navigate("/admin")
    } else {
      setErreur(true)
      setMotDePasse("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 bg-[#0A2463] rounded-2xl flex items-center justify-center mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <CardTitle className="text-[#0A2463] text-xl">
            Espace Administrateur ACN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {erreur && (
              <Alert variant="destructive">
                <AlertDescription>Mot de passe incorrect.</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="mdp">Mot de passe</Label>
              <Input
                id="mdp"
                type="password"
                value={motDePasse}
                onChange={(e) => { setMotDePasse(e.target.value); setErreur(false) }}
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-[#0A2463] hover:bg-[#1a3a8f]">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
