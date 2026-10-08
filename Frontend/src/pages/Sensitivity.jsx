import { useEffect, useMemo, useState } from "react"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Target,
  Layers3,
  AlertCircle,
} from "lucide-react"

import { getSensitivityAnalysis } from "../services/api"

function Sensitivity() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const fetchSensitivityData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError("")

      const response = await getSensitivityAnalysis()
      setData(response)
    } catch (err) {
      console.error("Sensitivity analysis error:", err)

      setError(
        err?.response?.data?.detail ||
          "Unable to load sensitivity analysis data.",
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSensitivityData()
  }, [])

  const dropoutData = data?.dropout || []

  const bestExperiment = useMemo(() => {
    if (!dropoutData.length) return null

    return [...dropoutData].sort(
      (a, b) => b.Accuracy - a.Accuracy,
    )[0]
  }, [dropoutData])

  const bestValidationExperiment = useMemo(() => {
    if (!dropoutData.length) return null

    return [...dropoutData].sort(
      (a, b) =>
        b["Validation Accuracy"] - a["Validation Accuracy"],
    )[0]
  }, [dropoutData])

  const fastestExperiment = useMemo(() => {
    if (!dropoutData.length) return null

    return [...dropoutData].sort(
      (a, b) => a["Training Time"] - b["Training Time"],
    )[0]
  }, [dropoutData])

  const averageAccuracy = useMemo(() => {
    if (!dropoutData.length) return 0

    return (
      dropoutData.reduce(
        (sum, item) => sum + item.Accuracy,
        0,
      ) / dropoutData.length
    )
  }, [dropoutData])

  const formatPercent = (value) => {
    if (value === undefined || value === null) return "—"

    return `${(value * 100).toFixed(2)}%`
  }

  const formatSeconds = (value) => {
    if (value === undefined || value === null) return "—"

    return `${value.toFixed(2)}s`
  }

  const formatParameters = (value) => {
    if (value === undefined || value === null) return "—"

    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(3)}M`
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    }

    return value.toString()
  }

  const tooltipStyle = {
    backgroundColor: "#0b1124",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    color: "#ffffff",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-28 text-white">
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
              </div>

              <h2 className="text-xl font-semibold">
                Loading sensitivity analysis
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fetching experimental results from the model API...
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] pt-28 text-white">
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h2 className="text-xl font-semibold">
              Unable to load sensitivity data
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <button
              onClick={() => fetchSensitivityData(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-28 text-white">
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-12">

        {/* HEADER */}
        <section className="mb-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-blue-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Robustness & Sensitivity
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                How sensitive is the model?
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Analyze how changes in model configuration affect
                classification performance and computational behavior.
                These results are taken directly from the trained
                experiment pipeline.
              </p>
            </div>

            <button
              onClick={() => fetchSensitivityData(true)}
              disabled={refreshing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-5 text-sm font-medium text-slate-300 transition hover:border-blue-500/30 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              {refreshing ? "Refreshing..." : "Refresh data"}
            </button>
          </div>
        </section>

        {/* SUMMARY CARDS */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Best Accuracy */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                Best accuracy
              </span>

              <div className="rounded-xl bg-blue-500/10 p-2">
                <Target className="h-4 w-4 text-blue-400" />
              </div>
            </div>

            <div className="text-2xl font-bold">
              {bestExperiment
                ? formatPercent(bestExperiment.Accuracy)
                : "—"}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {bestExperiment
                ? `Dropout = ${bestExperiment.Dropout}`
                : "No experiment data"}
            </p>
          </div>

          {/* Best Validation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                Best validation
              </span>

              <div className="rounded-xl bg-purple-500/10 p-2">
                <Activity className="h-4 w-4 text-purple-400" />
              </div>
            </div>

            <div className="text-2xl font-bold">
              {bestValidationExperiment
                ? formatPercent(
                    bestValidationExperiment["Validation Accuracy"],
                  )
                : "—"}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {bestValidationExperiment
                ? `Dropout = ${bestValidationExperiment.Dropout}`
                : "No experiment data"}
            </p>
          </div>

          {/* Fastest Training */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                Fastest training
              </span>

              <div className="rounded-xl bg-cyan-500/10 p-2">
                <Clock3 className="h-4 w-4 text-cyan-400" />
              </div>
            </div>

            <div className="text-2xl font-bold">
              {fastestExperiment
                ? formatSeconds(fastestExperiment["Training Time"])
                : "—"}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {fastestExperiment
                ? `Dropout = ${fastestExperiment.Dropout}`
                : "No experiment data"}
            </p>
          </div>

          {/* Experiment Count */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                Experiments
              </span>

              <div className="rounded-xl bg-emerald-500/10 p-2">
                <Database className="h-4 w-4 text-emerald-400" />
              </div>
            </div>

            <div className="text-2xl font-bold">
              {dropoutData.length}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Dropout configurations evaluated
            </p>
          </div>
        </section>

        {/* DROPOUT SECTION */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                <Sparkles className="h-4 w-4" />
                Dropout sensitivity
              </div>

              <h2 className="text-2xl font-bold">
                Effect of dropout regularization
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                The experiment evaluates dropout values of 0.0, 0.3,
                and 0.5 while observing classification accuracy,
                validation accuracy, and training time.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Mean accuracy
              </div>

              <div className="mt-1 text-lg font-semibold">
                {formatPercent(averageAccuracy)}
              </div>
            </div>
          </div>

          {dropoutData.length > 0 ? (
            <>
              {/* ACCURACY CHART */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 sm:p-6">
                <div className="mb-5">
                  <h3 className="font-semibold">
                    Accuracy response
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Training and validation accuracy across dropout
                    configurations.
                  </p>
                </div>

                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dropoutData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        stroke="#1e293b"
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="Dropout"
                        stroke="#64748b"
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 12,
                        }}
                        label={{
                          value: "Dropout rate",
                          position: "insideBottom",
                          offset: -5,
                          fill: "#64748b",
                        }}
                      />

                      <YAxis
                        domain={[0.7, 0.85]}
                        tickFormatter={(value) =>
                          `${(value * 100).toFixed(0)}%`
                        }
                        stroke="#64748b"
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 12,
                        }}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value, name) => [
                          `${(value * 100).toFixed(2)}%`,
                          name,
                        ]}
                        labelFormatter={(value) =>
                          `Dropout: ${value}`
                        }
                      />

                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="Accuracy"
                        name="Test Accuracy"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#3b82f6",
                        }}
                        activeDot={{
                          r: 7,
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="Validation Accuracy"
                        name="Validation Accuracy"
                        stroke="#a855f7"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#a855f7",
                        }}
                        activeDot={{
                          r: 7,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TRAINING TIME */}
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-5 sm:p-6">
                <div className="mb-5">
                  <h3 className="font-semibold">
                    Computational sensitivity
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Measured training time for each dropout
                    configuration.
                  </p>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dropoutData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        stroke="#1e293b"
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="Dropout"
                        stroke="#64748b"
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 12,
                        }}
                      />

                      <YAxis
                        stroke="#64748b"
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 12,
                        }}
                        tickFormatter={(value) =>
                          `${value}s`
                        }
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value) => [
                          `${value.toFixed(2)}s`,
                          "Training Time",
                        ]}
                        labelFormatter={(value) =>
                          `Dropout: ${value}`
                        }
                      />

                      <Bar
                        dataKey="Training Time"
                        name="Training Time"
                        fill="#06b6d4"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <EmptyState message="No dropout sensitivity experiments are available." />
          )}
        </section>

        {/* EXPERIMENT TABLE */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">

          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Experimental results
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Exact values returned by the sensitivity analysis API.
              </p>
            </div>
          </div>

          {dropoutData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="px-4 py-4">Experiment</th>
                    <th className="px-4 py-4">Dropout</th>
                    <th className="px-4 py-4">Accuracy</th>
                    <th className="px-4 py-4">Validation</th>
                    <th className="px-4 py-4">Training</th>
                    <th className="px-4 py-4">Parameters</th>
                  </tr>
                </thead>

                <tbody>
                  {dropoutData.map((experiment, index) => {
                    const isBest =
                      bestExperiment?.Dropout ===
                      experiment.Dropout

                    return (
                      <tr
                        key={`${experiment.Dropout}-${index}`}
                        className="border-b border-slate-800/70 transition hover:bg-slate-800/20"
                      >
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            {isBest && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            )}

                            <span className="font-medium text-slate-200">
                              {experiment.Experiment}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-5 font-medium">
                          {experiment.Dropout.toFixed(1)}
                        </td>

                        <td className="px-4 py-5 font-semibold text-blue-400">
                          {formatPercent(experiment.Accuracy)}
                        </td>

                        <td className="px-4 py-5 font-semibold text-purple-400">
                          {formatPercent(
                            experiment["Validation Accuracy"],
                          )}
                        </td>

                        <td className="px-4 py-5 text-slate-300">
                          {formatSeconds(
                            experiment["Training Time"],
                          )}
                        </td>

                        <td className="px-4 py-5 text-slate-300">
                          {formatParameters(
                            experiment.Parameters,
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No experimental results available." />
          )}
        </section>

        {/* FINDINGS */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">

          {/* Best Configuration */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                  Best configuration
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Dropout ={" "}
                  {bestExperiment
                    ? bestExperiment.Dropout
                    : "—"}
                </h2>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-400">
              {bestExperiment
                ? `The dropout value of ${bestExperiment.Dropout} produced the highest test accuracy of ${formatPercent(
                    bestExperiment.Accuracy,
                  )} among the evaluated configurations.`
                : "No dropout configuration is currently available."}
            </p>
          </div>

          {/* Model Interpretation */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Layers3 className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                  Model interpretation
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Regularization effect
                </h2>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-400">
              The evaluated dropout configurations show that
              moderate regularization performed best in this
              experiment. The results should be interpreted as
              empirical observations from the tested configurations,
              rather than a general rule for all datasets.
            </p>
          </div>
        </section>

        {/* UNAVAILABLE EXPERIMENTS */}
        <section className="grid gap-6 lg:grid-cols-2">

          <EmptyExperimentCard
            title="Sequence length sensitivity"
            description="No sequence-length sensitivity experiments are currently available through the API."
            icon={
              <Activity className="h-5 w-5 text-slate-500" />
            }
          />

          <EmptyExperimentCard
            title="Embedding dimension sensitivity"
            description="No embedding-dimension sensitivity experiments are currently available through the API."
            icon={
              <Layers3 className="h-5 w-5 text-slate-500" />
            }
          />

        </section>
      </main>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30">
      <div className="text-center">
        <AlertCircle className="mx-auto h-6 w-6 text-slate-600" />

        <p className="mt-3 text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  )
}

function EmptyExperimentCard({
  title,
  description,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
          {icon}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-600">
            Experiment unavailable
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-300">
            {title}
          </h3>
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  )
}

export default Sensitivity