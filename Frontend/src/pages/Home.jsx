import { useEffect, useState } from "react"
import {
  Activity,
  BrainCircuit,
  Gauge,
  Layers3,
  ShieldCheck,
} from "lucide-react"

import Hero from "../components/Hero"
import MetricCard from "../components/MetricCard"
import { getModelComparison } from "../services/api"

function Home() {
  const [model, setModel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadModelData = async () => {
      try {
        const data = await getModelComparison()

        const models =
          data?.results ||
          data?.models ||
          data?.comparison ||
          data

        if (Array.isArray(models)) {
          const lstm = models.find(
            (item) =>
              String(item.model || item.model_name || "")
                .toLowerCase()
                .includes("lstm") &&
              !String(item.model || item.model_name || "")
                .toLowerCase()
                .includes("bi")
          )

          if (lstm) {
            setModel(lstm)
          }
        }
      } catch (error) {
        console.error("Unable to load model comparison:", error)
      } finally {
        setLoading(false)
      }
    }

    loadModelData()
  }, [])

  const accuracy =
    model?.accuracy !== undefined
      ? `${(Number(model.accuracy) * 100).toFixed(2)}%`
      : "78.80%"

  const f1 =
    model?.f1 !== undefined
      ? `${(Number(model.f1) * 100).toFixed(2)}%`
      : model?.f1_score !== undefined
        ? `${(Number(model.f1_score) * 100).toFixed(2)}%`
        : "78.46%"

  const rocAuc =
    model?.roc_auc !== undefined
      ? Number(model.roc_auc).toFixed(4)
      : "0.8479"

  const parameters =
    model?.parameters !== undefined
      ? `${(Number(model.parameters) / 1000000).toFixed(2)}M`
      : "1.33M"

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Hero */}
      <Hero />

      {/* Model statistics */}
      <section className="relative border-y border-white/5 bg-white/[0.015] py-16">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-8">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Model Intelligence
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              LSTM performance at a glance
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Key evaluation metrics from the recurrent neural network
              experiments performed on the IMDb movie-review dataset.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              label="Accuracy"
              value={loading ? "—" : accuracy}
              description="Classification accuracy"
              icon={Gauge}
            />

            <MetricCard
              label="F1 Score"
              value={loading ? "—" : f1}
              description="Balanced classification metric"
              icon={Activity}
            />

            <MetricCard
              label="ROC-AUC"
              value={loading ? "—" : rocAuc}
              description="Ranking discrimination"
              icon={ShieldCheck}
            />

            <MetricCard
              label="Parameters"
              value={loading ? "—" : parameters}
              description="Trainable model parameters"
              icon={Layers3}
            />

          </div>

        </div>

      </section>

      {/* Pipeline */}
      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-400">
              <BrainCircuit size={23} />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Inference Pipeline
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              From review to sentiment
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              The deployed application follows the same preprocessing
              pipeline used during model development.
            </p>

          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-5">

            {[
              ["01", "Review", "Raw movie review"],
              ["02", "Tokenization", "Integer sequence"],
              ["03", "Embedding", "Dense representation"],
              ["04", "LSTM", "Sequence modelling"],
              ["05", "Prediction", "Positive / Negative"],
            ].map(([number, title, description], index) => (

              <div
                key={title}
                className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.045]"
              >

                <span className="text-xs font-semibold text-blue-400">
                  {number}
                </span>

                <h3 className="mt-3 font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {description}
                </p>

                {index < 4 && (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-blue-500/30 md:block" />
                )}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/5 py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Ready to analyze?
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Put the model to the test.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            Enter any movie review and let the trained LSTM model
            estimate its sentiment and prediction confidence.
          </p>

          <a
            href="/analyzer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-blue-400"
          >
            <BrainCircuit size={17} />
            Open Sentiment Analyzer
          </a>

        </div>

      </section>

    </main>
  )
}

export default Home