import { NavLink } from "react-router-dom"
import {
  BrainCircuit,
  BarChart3,
  GitCompare,
  Search,
  Activity,
  Info,
  SlidersHorizontal,
} from "lucide-react"

const navigation = [
  {
    name: "Analyzer",
    path: "/analyzer",
    icon: Search,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Comparison",
    path: "/comparison",
    icon: GitCompare,
  },
  {
    name: "Sensitivity",
    path: "/sensitivity",
    icon: SlidersHorizontal,
  },
  {
    name: "Analysis",
    path: "/errors",
    icon: Activity,
  },
  {
    name: "About",
    path: "/about",
    icon: Info,
  },
]

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">

        <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/75 px-5 shadow-2xl shadow-black/20 backdrop-blur-xl">

          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <BrainCircuit
                size={22}
                strokeWidth={2}
                className="text-white"
              />
            </div>

            <div className="hidden sm:block">
              <div className="text-sm font-bold tracking-wide text-white">
                IMDb Sentiment
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-blue-400">
                AI Intelligence
              </div>
            </div>
          </NavLink>

          {/* Navigation */}
          <div className="hidden items-center gap-1 md:flex">

            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>{item.name}</span>
                </NavLink>
              )
            })}

          </div>

          {/* Model status */}
          <div className="hidden items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2 lg:flex">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-xs font-medium text-emerald-400">
              LSTM Online
            </span>

          </div>

        </nav>

      </div>
    </header>
  )
}

export default Navbar