import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  Award,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Cpu,
  Gauge,
  GitCompareArrows,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { getModelComparison } from "../services/api"

const MODEL_ORDER = ["RNN", "LSTM", "Bi-LSTM", "GRU"]

function ModelComparison() {
  const [models, setModels] = useState([])
  const [leftModel, setLeftModel] = useState("LSTM")
  const [rightModel, setRightModel] = useState("GRU")
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
      console.error("Comparison error:", err)

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

  const left = useMemo(
    () => models.find((model) => model.Model === leftModel),
    [models, leftModel]
  )

  const right = useMemo(
    () => models.find((model) => model.Model === rightModel),
    [models, rightModel]
  )

  const comparisonMetrics = useMemo(() => {
    if (!left || !right) return []

    return [
      {
        key: "Accuracy",
        label: "Accuracy",
        left: left.Accuracy,
        right: right.Accuracy,
        percentage: true,
        higherBetter: true,
      },
      {
        key: "Precision",
        label: "Precision",
        left: left.Precision,
        right: right.Precision,
        percentage: true,
        higherBetter: true,
      },
      {
        key: "Recall",
        label: "Recall",
        left: left.Recall,
        right: right.Recall,
        percentage: true,
        higherBetter: true,
      },
      {
        key: "F1-score",
        label: "F1 Score",
        left: left["F1-score"],
        right: right["F1-score"],
        percentage: true,
        higherBetter: true,
      },
      {
        key: "Specificity",
        label: "Specificity",
        left: left.Specificity,
        right: right.Specificity,
        percentage: true,
        higherBetter: true,
      },
      {
        key: "MCC",
        label: "MCC",
        left: left.MCC,
        right: right.MCC,
        percentage: false,
        higherBetter: true,
      },
      {
        key: "ROC-AUC",
        label: "ROC-AUC",
        left: left["ROC-AUC"],
        right: right["ROC-AUC"],
        percentage: false,
        higherBetter: true,
      },
      {
        key: "PR-AUC",
        label: "PR-AUC",
        left: left["PR-AUC"],
        right: right["PR-AUC"],
        percentage: false,
        higherBetter: true,
      },
      {
        key: "Log Loss",
        label: "Log Loss",
        left: left["Log Loss"],
        right: right["Log Loss"],
        percentage: false,
        higherBetter: false,
      },
      {
        key: "Brier Score",
        label: "Brier Score",
        left: left["Brier Score"],
        right: right["Brier Score"],
        percentage: false,
        higherBetter: false,
      },
    ]
  }, [left, right])

  const performanceChart = comparisonMetrics
    .filter(
      (metric) =>
        metric.key !== "MCC" &&
        metric.key !== "Log Loss" &&
        metric.key !== "Brier Score"
    )
    .map((metric) => ({
      metric: metric.label,
      [leftModel]: Number((metric.left * 100).toFixed(2)),
      [rightModel]: Number((metric.right * 100).toFixed(2)),
    }))

  const wins = useMemo(() => {
    if (!left || !right) return { left: 0, right: 0 }

    let leftWins = 0
    let rightWins = 0

    comparisonMetrics.forEach((metric) => {
      if (metric.higherBetter) {
        if (metric.left > metric.right) leftWins++
        if (metric.right > metric.left) rightWins++
      } else {
        if (metric.left < metric.right) leftWins++
        if (metric.right < metric.left) rightWins++
      }
    })

    return {
      left: leftWins,
      right: rightWins,
    }
  }, [comparisonMetrics, left, right])

  const winner = useMemo(() => {
    if (!left || !right) return null

    if (wins.left > wins.right) return leftModel
    if (wins.right > wins.left) return rightModel

    return "Tie"
  }, [wins, leftModel, rightModel, left, right])

  const swapModels = () => {
    setLeftModel(rightModel)
    setRightModel(leftModel)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-24 pt-32 text-white lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Page header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-xs font-medium text-violet-400">
              <GitCompareArrows size={14} />
              ARCHITECTURE COMPARISON
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Compare the models.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Compare two recurrent architectures across classification,
              probabilistic and computational metrics using the actual
              experiment results.
            </p>

          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white lg:self-auto"
          >
            <Activity
              size={15}
              className={loading ? "animate-pulse" : ""}
            />
            Refresh data
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

              <BrainCircuit
                size={32}
                className="mx-auto animate-pulse text-blue-400"
              />

              <p className="mt-5 text-sm font-medium">
                Loading model experiments...
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Fetching comparison data from FastAPI
              </p>

            </div>

          </div>
        )}

        {!loading && left && right && (
          <>

            {/* Selectors */}
            <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end">

                <ModelSelector
                  label="Model A"
                  value={leftModel}
                  models={models}
                  onChange={setLeftModel}
                  accent="blue"
                />

                <button
                  onClick={swapModels}
                  className="mx-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400 lg:mb-0"
                  title="Swap models"
                >
                  <GitCompareArrows size={18} />
                </button>

                <ModelSelector
                  label="Model B"
                  value={rightModel}
                  models={models}
                  onChange={setRightModel}
                  accent="violet"
                />

              </div>

            </section>

            {/* Model cards */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">

              <ModelCard
                model={left}
                side="A"
                accent="blue"
              />

              <ModelCard
                model={right}
                side="B"
                accent="violet"
              />

            </section>

            {/* Winner */}
            <section className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.025] p-6 sm:p-8">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                    <Award size={23} />
                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                      Overall comparison
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {winner === "Tie"
                        ? "The comparison is balanced."
                        : `${winner} leads this comparison.`}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {winner === "Tie"
                        ? "Both architectures win the same number of evaluated metrics."
                        : `${winner} wins ${winner === leftModel ? wins.left : wins.right} of ${comparisonMetrics.length} evaluated metrics.`}
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <WinBadge
                    model={leftModel}
                    wins={wins.left}
                    active={winner === leftModel}
                    accent="blue"
                  />

                  <WinBadge
                    model={rightModel}
                    wins={wins.right}
                    active={winner === rightModel}
                    accent="violet"
                  />

                </div>

              </div>

            </section>

            {/* Performance chart */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

              <SectionHeading
                icon={BarChart3}
                eyebrow="Metric Comparison"
                title="Classification performance"
                description="Higher values indicate stronger classification performance."
              />

              <div className="mt-8 h-[390px]">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart
                    data={performanceChart}
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
                      dataKey="metric"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#64748b",
                        fontSize: 11,
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
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                      formatter={(value) => `${value}%`}
                    />

                    <Legend />

                    <Bar
                      dataKey={leftModel}
                      fill="#3b82f6"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey={rightModel}
                      fill="#8b5cf6"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </section>

            {/* Detailed metric comparison */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

              <SectionHeading
                icon={Gauge}
                eyebrow="Detailed Metrics"
                title="Metric-by-metric comparison"
                description="Every metric is evaluated according to whether higher or lower values are preferable."
              />

              <div className="mt-8 space-y-3">

                {comparisonMetrics.map((metric) => {

                  const leftWins = metric.higherBetter
                    ? metric.left > metric.right
                    : metric.left < metric.right

                  const rightWins = metric.higherBetter
                    ? metric.right > metric.left
                    : metric.right < metric.left

                  return (
                    <MetricComparisonRow
                      key={metric.key}
                      metric={metric}
                      leftModel={leftModel}
                      rightModel={rightModel}
                      leftWins={leftWins}
                      rightWins={rightWins}
                    />
                  )
                })}

              </div>

            </section>

            {/* Computational comparison */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3">

              <ComparisonStat
                icon={Layers3}
                label="Parameters"
                leftLabel={leftModel}
                rightLabel={rightModel}
                leftValue={`${(
                  left.Parameters / 1000000
                ).toFixed(3)}M`}
                rightValue={`${(
                  right.Parameters / 1000000
                ).toFixed(3)}M`}
                lowerBetter
              />

              <ComparisonStat
                icon={Clock3}
                label="Training Time"
                leftLabel={leftModel}
                rightLabel={rightModel}
                leftValue={`${left[
                  "Training Time (sec)"
                ].toFixed(2)}s`}
                rightValue={`${right[
                  "Training Time (sec)"
                ].toFixed(2)}s`}
                lowerBetter
              />

              <ComparisonStat
                icon={Zap}
                label="Inference Time"
                leftLabel={leftModel}
                rightLabel={rightModel}
                leftValue={`${left[
                  "Inference Time (sec)"
                ].toFixed(2)}s`}
                rightValue={`${right[
                  "Inference Time (sec)"
                ].toFixed(2)}s`}
                lowerBetter
              />

            </section>

            {/* Automated insights */}
            <section className="mt-6 rounded-3xl border border-blue-400/15 bg-blue-400/[0.025] p-6 sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                  <Sparkles size={20} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Model Insights
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    What the experiment tells us
                  </h2>

                </div>

              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">

                <Insight
                  icon={Target}
                  title="Accuracy"
                  text={getAccuracyInsight(left, right)}
                />

                <Insight
                  icon={Activity}
                  title="F1 Score"
                  text={getF1Insight(left, right)}
                />

                <Insight
                  icon={ShieldCheck}
                  title="Ranking quality"
                  text={getRocInsight(left, right)}
                />

                <Insight
                  icon={Cpu}
                  title="Computational cost"
                  text={getComputeInsight(left, right)}
                />

              </div>

            </section>

            {/* Deployment decision */}
            <section className="mt-6 rounded-3xl border border-amber-400/15 bg-amber-400/[0.025] p-6 sm:p-8">

              <div className="flex flex-col gap-6 md:flex-row md:items-center">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                  <CheckCircle2 size={27} />
                </div>

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                    Deployment Decision
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    LSTM selected for deployment
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                    The LSTM model achieved the highest classification
                    accuracy at <strong className="text-slate-300">78.80%</strong>.
                    GRU provides slightly stronger F1 and ROC-AUC scores
                    and trains faster, but the deployed model is LSTM based
                    on the experiment's selected best-model configuration.
                  </p>

                </div>

              </div>

            </section>

          </>
        )}

      </div>

    </main>
  )
}

/* ----------------------------------------
   Model selector
----------------------------------------- */

function ModelSelector({
  label,
  value,
  models,
  onChange,
  accent,
}) {
  const accentClass =
    accent === "blue"
      ? "focus:border-blue-400/50"
      : "focus:border-violet-400/50"

  return (
    <div className="w-full">

      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium text-white outline-none transition ${accentClass}`}
      >
        {MODEL_ORDER.filter((name) =>
          models.some((model) => model.Model === name)
        ).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

    </div>
  )
}

/* ----------------------------------------
   Model card
----------------------------------------- */

function ModelCard({ model, side, accent }) {
  const blue = accent === "blue"

  const borderClass = blue
    ? "border-blue-400/15"
    : "border-violet-400/15"

  const iconClass = blue
    ? "bg-blue-400/10 text-blue-400"
    : "bg-violet-400/10 text-violet-400"

  return (
    <div
      className={`rounded-3xl border ${borderClass} bg-white/[0.025] p-6 sm:p-8`}
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
            <BrainCircuit size={20} />
          </div>

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Model {side}
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {model.Model}
            </h2>

          </div>

        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          RNN Architecture
        </span>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">

        <SmallMetric
          label="Accuracy"
          value={`${(model.Accuracy * 100).toFixed(2)}%`}
        />

        <SmallMetric
          label="F1 Score"
          value={`${(model["F1-score"] * 100).toFixed(2)}%`}
        />

        <SmallMetric
          label="ROC-AUC"
          value={model["ROC-AUC"].toFixed(4)}
        />

        <SmallMetric
          label="Parameters"
          value={`${(
            model.Parameters / 1000000
          ).toFixed(3)}M`}
        />

      </div>

    </div>
  )
}

/* ----------------------------------------
   Metric comparison row
----------------------------------------- */

function MetricComparisonRow({
  metric,
  leftModel,
  rightModel,
  leftWins,
  rightWins,
}) {
  const formatValue = (value) => {
    if (metric.percentage) {
      return `${(value * 100).toFixed(2)}%`
    }

    return value.toFixed(4)
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-black/10 p-4">

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">

        <div className="text-right">

          <span
            className={`text-sm font-semibold ${
              leftWins
                ? "text-blue-400"
                : "text-slate-300"
            }`}
          >
            {formatValue(metric.left)}
          </span>

          {leftWins && (
            <span className="ml-2 text-[9px] uppercase tracking-wider text-blue-400">
              best
            </span>
          )}

        </div>

        <div className="min-w-[100px] text-center">

          <p className="text-xs font-semibold text-white">
            {metric.label}
          </p>

          <p className="mt-1 text-[9px] text-slate-600">
            {metric.higherBetter
              ? "Higher is better"
              : "Lower is better"}
          </p>

        </div>

        <div>

          <span
            className={`text-sm font-semibold ${
              rightWins
                ? "text-violet-400"
                : "text-slate-300"
            }`}
          >
            {formatValue(metric.right)}
          </span>

          {rightWins && (
            <span className="ml-2 text-[9px] uppercase tracking-wider text-violet-400">
              best
            </span>
          )}

        </div>

      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] text-[9px] text-slate-600">

        <span className="text-right">
          {leftModel}
        </span>

        <span />

        <span>
          {rightModel}
        </span>

      </div>

    </div>
  )
}

/* ----------------------------------------
   Computational stat
----------------------------------------- */

function ComparisonStat({
  icon: Icon,
  label,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          <Icon size={18} />
        </div>

        <div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Computational
          </p>

          <h3 className="mt-1 font-semibold">
            {label}
          </h3>

        </div>

      </div>

      <div className="mt-7 grid grid-cols-2 gap-4">

        <div>

          <p className="text-[10px] uppercase tracking-wider text-blue-400">
            {leftLabel}
          </p>

          <p className="mt-2 text-xl font-bold">
            {leftValue}
          </p>

        </div>

        <div>

          <p className="text-[10px] uppercase tracking-wider text-violet-400">
            {rightLabel}
          </p>

          <p className="mt-2 text-xl font-bold">
            {rightValue}
          </p>

        </div>

      </div>

    </div>
  )
}

/* ----------------------------------------
   Small metric
----------------------------------------- */

function SmallMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/10 p-4">

      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-white">
        {value}
      </p>

    </div>
  )
}

/* ----------------------------------------
   Win badge
----------------------------------------- */

function WinBadge({
  model,
  wins,
  active,
  accent,
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        active
          ? accent === "blue"
            ? "border-blue-400/20 bg-blue-400/5"
            : "border-violet-400/20 bg-violet-400/5"
          : "border-white/5 bg-black/10"
      }`}
    >

      <p className="text-[9px] uppercase tracking-wider text-slate-500">
        {model}
      </p>

      <p className="mt-1 text-lg font-bold">
        {wins}
      </p>

    </div>
  )
}

/* ----------------------------------------
   Section heading
----------------------------------------- */

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

        <h2 className="mt-1 text-xl font-bold">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  )
}

/* ----------------------------------------
   Insight
----------------------------------------- */

function Insight({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/10 p-5">

      <div className="flex items-center gap-3">

        <Icon
          size={17}
          className="text-blue-400"
        />

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

      </div>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        {text}
      </p>

    </div>
  )
}

/* ----------------------------------------
   Insight generators
----------------------------------------- */

function getAccuracyInsight(left, right) {
  const difference = Math.abs(
    left.Accuracy - right.Accuracy
  )

  const winner =
    left.Accuracy >= right.Accuracy
      ? left.Model
      : right.Model

  return `${winner} has the higher accuracy by ${(difference * 100).toFixed(2)} percentage points.`
}

function getF1Insight(left, right) {
  const difference = Math.abs(
    left["F1-score"] - right["F1-score"]
  )

  const winner =
    left["F1-score"] >= right["F1-score"]
      ? left.Model
      : right.Model

  return `${winner} has the stronger F1-score by ${(difference * 100).toFixed(2)} percentage points, indicating better balance between precision and recall.`
}

function getRocInsight(left, right) {
  const difference = Math.abs(
    left["ROC-AUC"] - right["ROC-AUC"]
  )

  const winner =
    left["ROC-AUC"] >= right["ROC-AUC"]
      ? left.Model
      : right.Model

  return `${winner} has the stronger ROC-AUC by ${difference.toFixed(4)}, indicating better ranking discrimination between the two classes.`
}

function getComputeInsight(left, right) {
  const leftTime = left["Training Time (sec)"]
  const rightTime = right["Training Time (sec)"]

  const winner =
    leftTime <= rightTime
      ? left.Model
      : right.Model

  const difference = Math.abs(
    leftTime - rightTime
  )

  return `${winner} trains faster by ${difference.toFixed(2)} seconds in the reported experiment.`
}

export default ModelComparison