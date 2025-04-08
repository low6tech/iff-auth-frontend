import ClientLogo from 'src/assets/client-logo.svg'

import { ArrowLeft } from "lucide-react"

export const Header = () => {
  return (
    <header>
        <div className="relative flex items-center py-3 h-16">
          <div className="flex flex-1 px-4">
            <button className="text-accent-foreground">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <img src={ClientLogo} alt="" className="absolute left-1/2 -translate-x-1/2 w-[140px]" />
        </div>
    </header>
  )
}