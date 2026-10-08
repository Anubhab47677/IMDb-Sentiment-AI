import { BrainCircuit } from "lucide-react"

function LoadingState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025]">

      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-400">

        <div className="absolute inset-0 animate-ping rounded-2xl border border-blue-400/20" />

        <BrainCircuit
          size={28}
          className="relative animate-pulse"
        />

      </div>

      <h3 className="mt-6 text-sm font-semibold text-white">
        Processing your review
      </h3>

      <p className="mt-2 text-xs text-slate-500">
        Tokenizing text and running the LSTM model...
      </p>

      <div className="mt-6 flex gap-1">

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />

        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" />

      </div>

    </div>
  )
}

export default LoadingState