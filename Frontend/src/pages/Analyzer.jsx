import { useState } from "react"
import {
  BrainCircuit,
  Database,
  Gauge,
  ShieldCheck,
} from "lucide-react"

import ReviewInput from "../components/ReviewInput"
import SentimentResult from "../components/SentimentResult"
import LoadingState from "../components/LoadingState"

import { predictSentiment } from "../services/api"

function Analyzer() {
  const [review, setReview] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!review.trim()) {
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const prediction = await predictSentiment(review.trim())

      setResult(prediction)
    } catch (err) {
      console.error("Prediction error:", err)

      setError(
        "Unable to connect to the prediction server. Make sure the FastAPI backend is running."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-20 pt-32 text-white lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Page heading */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-xs font-medium text-blue-400">

            <BrainCircuit size={14} />

            LSTM SENTIMENT ENGINE

          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Analyze the sentiment of any movie review.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Enter an IMDb-style movie review below. Your text will pass
            through the same preprocessing pipeline used during model
            development and be classified by the trained LSTM network.
          </p>

        </div>

        {/* Main analyzer */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Input */}
          <section>

            <ReviewInput
              review={review}
              setReview={setReview}
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

          </section>

          {/* Result */}
          <section>

            {loading ? (
              <LoadingState />
            ) : (
              <SentimentResult result={result} />
            )}

          </section>

        </div>

        {/* Technical information */}
        <section className="mt-16">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Inference Configuration
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Deployment pipeline
            </h2>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <Database
                size={20}
                className="text-blue-400"
              />

              <p className="mt-4 text-xs text-slate-500">
                Vocabulary
              </p>

              <p className="mt-1 text-xl font-bold">
                10,000
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Most frequent words
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <Gauge
                size={20}
                className="text-violet-400"
              />

              <p className="mt-4 text-xs text-slate-500">
                Sequence Length
              </p>

              <p className="mt-1 text-xl font-bold">
                100
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Padding / truncation
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <BrainCircuit
                size={20}
                className="text-cyan-400"
              />

              <p className="mt-4 text-xs text-slate-500">
                Architecture
              </p>

              <p className="mt-1 text-xl font-bold">
                LSTM
              </p>

              <p className="mt-1 text-xs text-slate-600">
                64 recurrent units
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <ShieldCheck
                size={20}
                className="text-emerald-400"
              />

              <p className="mt-4 text-xs text-slate-500">
                Decision Threshold
              </p>

              <p className="mt-1 text-xl font-bold">
                0.50
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Binary classification
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Analyzer