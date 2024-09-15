import logoInOrbit from '../assets/logo-in-orbit.svg'
import letsStartIllustration from '../assets/lets-start-illustration.svg'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'

export function EmptyGoals() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logoInOrbit} alt="Logo In Orbit" className="mb-8 w-32" />
      <img
        src={letsStartIllustration}
        alt="Let's Start Illustration"
        className="mb-8 w-64"
      />
      <p className="text-center text-zinc-300 mb-8 max-w-[400px] leading-relaxed">
        Você ainda não cadastrou nenhuma meta, que tal{' '}
        <a href="/create-goal" className="underline">
          cadastrar uma
        </a>{' '}
        agora mesmo?
      </p>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </main>
  )
}
