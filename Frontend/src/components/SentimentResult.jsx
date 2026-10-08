import {
  CheckCircle2,
  Clock3,
  Cpu,
  Frown,
  Smile,
  XCircle,
} from "lucide-react"

function SentimentResult({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-8 text-center">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500">
          <Cpu size={24} />
        </div>

        <h3 className="mt-5 text-sm font-semibold text-slate-300">
          Prediction will appear here
        </h3>

        <p className="mt-2 max-w-xs text-xs leading-6 text-slate-600">
          Enter a movie review and run the LSTM model to see its predicted
          sentiment and confidence.
        </p>

      </div>
    )
  }

  const sentiment = String(result.sentiment || "").toLowerCase()

  const isPositive = sentiment === "positive"

  const positiveProbability =
    Number(result.positive_probability ?? 0)

  const negativeProbability =
    Number(result.negative_probability ?? 0)

  const selectedProbability = isPositive
    ? positiveProbability
    : negativeProbability

  const confidence = selectedProbability <= 1
    ? selectedProbability * 100
    : selectedProbability

  const positivePercent =
    positiveProbability <= 1
      ? positiveProbability * 100
      : positiveProbability

  const negativePercent =
    negativeProbability <= 1
      ? negativeProbability * 100
      : negativeProbability

  const inferenceTime =
    result.inference_time_ms !== undefined
      ? Number(result.inference_time_ms).toFixed(2)
      : "—"

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

      {/* Result header */}
      <div className="border-b border-white/5 px-6 py-5">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              Prediction Result
            </p>

            <p className="mt-1 text-xs text-slate-500">
              LSTM sentiment classification
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isPositive
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-red-400/10 text-red-400"
            }`}
          >
            {isPositive ? (
              <Smile size={21} />
            ) : (
              <Frown size={21} />
            )}
          </div>

        </div>

      </div>

      {/* Main sentiment */}
      <div className="px-6 py-8 text-center">

        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            isPositive
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-red-400/10 text-red-400"
          }`}
        >
          {isPositive ? (
            <CheckCircle2 size={32} />
          ) : (
            <XCircle size={32} />
          )}
        </div>

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Predicted Sentiment
        </p>

        <h2
          className={`mt-2 text-4xl font-bold ${
            isPositive
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {isPositive ? "Positive" : "Negative"}
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          Confidence
        </p>

        <p className="mt-1 text-3xl font-bold text-white">
          {confidence.toFixed(2)}%
        </p>

      </div>

      {/* Probability bars */}
      <div className="space-y-5 border-t border-white/5 px-6 py-6">

        <div>

          <div className="mb-2 flex items-center justify-between text-xs">

            <span className="flex items-center gap-2 text-slate-400">
              <Smile size={14} className="text-emerald-400" />
              Positive
            </span>

            <span className="font-semibold text-emerald-400">
              {positivePercent.toFixed(2)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.max(0, positivePercent))}%`,
              }}
            />

          </div>

        </div>

        <div>

          <div className="mb-2 flex items-center justify-between text-xs">

            <span className="flex items-center gap-2 text-slate-400">
              <Frown size={14} className="text-red-400" />
              Negative
            </span>

            <span className="font-semibold text-red-400">
              {negativePercent.toFixed(2)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-red-400 transition-all duration-700"
              style={{
                width: `${Math.min(100, Math.max(0, negativePercent))}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 border-t border-white/5">

        <div className="border-r border-white/5 px-6 py-4">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Cpu size={14} />
            Model
          </div>

          <p className="mt-1 text-sm font-semibold text-white">
            {result.model || "LSTM"}
          </p>

        </div>

        <div className="px-6 py-4">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 size={14} />
            Inference
          </div>

          <p className="mt-1 text-sm font-semibold text-white">
            {inferenceTime} ms
          </p>

        </div>

      </div>

    </div>
  )
}

export default SentimentResult