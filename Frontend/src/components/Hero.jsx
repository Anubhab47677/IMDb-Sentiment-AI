import { ArrowRight, PlayCircle, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-44">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">

        {/* Left side */}
        <div>

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-xs font-medium text-blue-400">
            <Sparkles size={14} />

            Deep Learning • NLP • Sentiment Intelligence
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">

            Understand the emotion

            <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              behind every review.
            </span>

          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Analyze IMDb movie reviews using a trained recurrent neural
            network and discover whether the review expresses a positive
            or negative sentiment.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">

            <Link
              to="/analyzer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Analyze a Review

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/comparison"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:bg-white/[0.07] hover:text-white"
            >
              <PlayCircle size={17} />

              Explore Models
            </Link>

          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-500">

            <span>IMDb Dataset</span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span>10K Vocabulary</span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span>100 Token Sequence</span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span>LSTM Architecture</span>

          </div>

        </div>

        {/* Right side - Model visualization */}
        <div className="relative">

          <div className="absolute -inset-8 rounded-[40px] bg-blue-500/10 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Selected Model
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  LSTM Sentiment Classifier
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ready
              </div>

            </div>

            {/* Neural network visualization */}
            <div className="my-8 flex items-center justify-between gap-2">

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-xs font-semibold text-blue-400">
                  TEXT
                </div>

                <span className="text-[10px] text-slate-500">
                  Review
                </span>
              </div>

              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-violet-500/40" />

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-xs font-semibold text-violet-400">
                  EMB
                </div>

                <span className="text-[10px] text-slate-500">
                  Embedding
                </span>
              </div>

              <div className="h-px flex-1 bg-gradient-to-r from-violet-500/40 to-cyan-500/40" />

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xs font-semibold text-cyan-400">
                  LSTM
                </div>

                <span className="text-[10px] text-slate-500">
                  Recurrent
                </span>
              </div>

              <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/40 to-emerald-500/40" />

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-xs font-semibold text-emerald-400">
                  0/1
                </div>

                <span className="text-[10px] text-slate-500">
                  Output
                </span>
              </div>

            </div>

            {/* Model details */}
            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  Embedding
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  128
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  RNN Units
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  64
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  Vocabulary
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  10K
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  Sequence
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  100
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero