import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  Award,
  BarChart3,
  BrainCircuit,
  Clock3,
  Cpu,
  Gauge,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Timer,
  TrendingUp,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { getModelComparison } from "../services/api"

function Dashboard() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await getModelComparison()

      if (!Array.isArray(data?.models)) {
        throw new Error("Invalid comparison response")
      }

      setModels(data.models)
    } catch (err) {
      console.error("Dashboard data error:", err)
      setError(
        "Unable to load model comparison data. Make sure the FastAPI backend is running."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const bestAccuracy = useMemo(() => {
    if (!models.length) return null

    return models.reduce((best, current) =>
      current.Accuracy > best.Accuracy ? current : best
    )
  }, [models])

  const bestF1 = useMemo(() => {
    if (!models.length) return null

    return models.reduce((best, current) =>
      current["F1-score"] > best["F1-score"] ? current : best
    )
  }, [models])

  const bestRoc = useMemo(() => {
    if (!models.length) return null

    return models.reduce((best, current) =>
      current["ROC-AUC"] > best["ROC-AUC"] ? current : best
    )
  }, [models])

  const fastestTraining = useMemo(() => {
    if (!models.length) return null

    return models.reduce((best, current) =>
      current["Training Time (sec)"] <
      best["Training Time (sec)"]
        ? current
        : best
    )
  }, [models])

  const accuracyData = models.map((model) => ({
    model: model.Model,
    Accuracy: Number((model.Accuracy * 100).toFixed(2)),
    F1: Number((model["F1-score"] * 100).toFixed(2)),
    "ROC-AUC": Number((model["ROC-AUC"] * 100).toFixed(2)),
  }))

  const computationalData = models.map((model) => ({
    model: model.Model,
    Parameters: Number((model.Parameters / 1000000).toFixed(2)),
    Training: Number(model["Training Time (sec)"].toFixed(2)),
    Inference: Number(model["Inference Time (sec)"].toFixed(2)),
  }))

  const tooltipStyle = {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
  }

  const formatPercent = (value) =>
    `${(value * 100).toFixed(2)}%`

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-24 pt-32 text-white lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-xs font-medium text-blue-400">
              <BarChart3 size={14} />
              MODEL INTELLIGENCE
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Model Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Compare the experimental performance and computational
              characteristics of the four recurrent neural network
              architectures trained on the IMDb sentiment dataset.
            </p>

          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50 md:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-12 flex min-h-[400px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025]">
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <BrainCircuit
                  size={26}
                  className="animate-pulse"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-white">
                Loading model experiments...
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Fetching results from FastAPI
              </p>

            </div>
          </div>
        )}

        {!loading && models.length > 0 && (
          <>
            {/* Summary cards */}
            <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <SummaryCard
                icon={Award}
                label="Best Accuracy"
                value={formatPercent(bestAccuracy.Accuracy)}
                detail={bestAccuracy.Model}
                iconClass="text-blue-400"
              />

              <SummaryCard
                icon={Activity}
                label="Best F1 Score"
                value={formatPercent(bestF1["F1-score"])}
                detail={bestF1.Model}
                iconClass="text-violet-400"
              />

              <SummaryCard
                icon={ShieldCheck}
                label="Best ROC-AUC"
                value={bestRoc["ROC-AUC"].toFixed(4)}
                detail={bestRoc.Model}
                iconClass="text-emerald-400"
              />

              <SummaryCard
                icon={Timer}
                label="Fastest Training"
                value={`${fastestTraining["Training Time (sec)"].toFixed(2)}s`}
                detail={fastestTraining.Model}
                iconClass="text-cyan-400"
              />

            </section>

            {/* Main comparison chart */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

              <SectionHeading
                icon={TrendingUp}
                eyebrow="Performance Comparison"
                title="Classification performance"
                description="Accuracy, F1-score and ROC-AUC across all four architectures."
              />

              <div className="mt-8 h-[360px] w-full">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart
                    data={accuracyData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="model"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#64748b",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#64748b",
                        fontSize: 11,
                      }}
                      tickFormatter={(value) => `${value}%`}
                    />

                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => `${value}%`}
                    />

                    <Legend />

                    <Bar
                      dataKey="Accuracy"
                      fill="#3b82f6"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="F1"
                      fill="#8b5cf6"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="ROC-AUC"
                      fill="#10b981"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* Two charts */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* Computational */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

                <SectionHeading
                  icon={Cpu}
                  eyebrow="Computational Analysis"
                  title="Model complexity"
                  description="Parameter count and training cost."
                />

                <div className="mt-8 h-[300px]">

                  <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                      data={computationalData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 10,
                      }}
                    >

                      <CartesianGrid
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="model"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                      />

                      <Legend />

                      <Bar
                        dataKey="Parameters"
                        name="Parameters (M)"
                        fill="#6366f1"
                        radius={[5, 5, 0, 0]}
                      />

                      <Bar
                        dataKey="Training"
                        name="Training Time (s)"
                        fill="#06b6d4"
                        radius={[5, 5, 0, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* Inference */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

                <SectionHeading
                  icon={Clock3}
                  eyebrow="Runtime Analysis"
                  title="Inference performance"
                  description="Measured inference time reported by the experiment."
                />

                <div className="mt-8 h-[300px]">

                  <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                      data={computationalData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 10,
                      }}
                    >

                      <CartesianGrid
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="model"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => `${value}s`}
                      />

                      <Line
                        type="monotone"
                        dataKey="Inference"
                        name="Inference Time (s)"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#22d3ee",
                        }}
                        activeDot={{
                          r: 7,
                        }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </section>

            {/* Detailed table */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

              <SectionHeading
                icon={Gauge}
                eyebrow="Detailed Evaluation"
                title="Complete model metrics"
                description="Classification, probabilistic and robustness-related evaluation metrics."
              />

              <div className="mt-8 overflow-x-auto">

                <table className="w-full min-w-[1100px] border-collapse text-left">

                  <thead>
                    <tr className="border-b border-white/10">

                      {[
                        "Model",
                        "Accuracy",
                        "Precision",
                        "Recall",
                        "F1",
                        "Specificity",
                        "MCC",
                        "ROC-AUC",
                        "PR-AUC",
                        "Log Loss",
                        "Brier",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 first:pl-0"
                        >
                          {heading}
                        </th>
                      ))}

                    </tr>
                  </thead>

                  <tbody>

                    {models.map((model) => (

                      <tr
                        key={model.Model}
                        className="border-b border-white/5 transition hover:bg-white/[0.025]"
                      >

                        <td className="whitespace-nowrap px-4 py-4 pl-0">

                          <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                              <BrainCircuit size={15} />
                            </div>

                            <span className="font-semibold text-white">
                              {model.Model}
                            </span>

                          </div>

                        </td>

                        <MetricCell value={model.Accuracy} />

                        <MetricCell value={model.Precision} />

                        <MetricCell value={model.Recall} />

                        <MetricCell value={model["F1-score"]} />

                        <MetricCell value={model.Specificity} />

                        <MetricCell
                        value={model.MCC}
                        decimals={3}
                        percentage={false}
                        />

                        <MetricCell
                        value={model["ROC-AUC"]}
                        decimals={4}
                        percentage={false}
                        />

                        <MetricCell
                        value={model["PR-AUC"]}
                        decimals={4}
                        percentage={false}
                        />

                        <MetricCell
                          value={model["Log Loss"]}
                          decimals={4}
                          percentage={false}
                        />

                        <MetricCell
                          value={model["Brier Score"]}
                          decimals={4}
                          percentage={false}
                        />

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>

            {/* Computational table */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

              <SectionHeading
                icon={Layers3}
                eyebrow="Computational Profile"
                title="Architecture cost"
                description="Parameter count and measured training/inference characteristics."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                {models.map((model) => (

                  <div
                    key={model.Model}
                    className="rounded-2xl border border-white/5 bg-black/20 p-5"
                  >

                    <div className="flex items-center justify-between">

                      <h3 className="font-semibold text-white">
                        {model.Model}
                      </h3>

                      <Cpu
                        size={17}
                        className="text-blue-400"
                      />

                    </div>

                    <div className="mt-5 space-y-4">

                      <InfoRow
                        label="Parameters"
                        value={`${(
                          model.Parameters / 1000000
                        ).toFixed(3)}M`}
                      />

                      <InfoRow
                        label="Training"
                        value={`${model[
                          "Training Time (sec)"
                        ].toFixed(2)}s`}
                      />

                      <InfoRow
                        label="Avg Epoch"
                        value={`${model[
                          "Avg Epoch Time (sec)"
                        ].toFixed(2)}s`}
                      />

                      <InfoRow
                        label="Inference"
                        value={`${model[
                          "Inference Time (sec)"
                        ].toFixed(2)}s`}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </section>
          </>
        )}

      </div>
    </main>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {detail}
          </p>
        </div>

        <div className={`rounded-xl bg-white/[0.04] p-2.5 ${iconClass}`}>
          <Icon size={19} />
        </div>

      </div>

    </div>
  )
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/5 text-blue-400">
        <Icon size={18} />
      </div>

      <div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  )
}

function MetricCell({
  value,
  decimals = 2,
  percentage = true,
}) {
  return (
    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
      {percentage
        ? `${(value * 100).toFixed(decimals)}%`
        : Number(value).toFixed(decimals)}
    </td>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-white">
        {value}
      </span>

    </div>
  )
}

export default Dashboard