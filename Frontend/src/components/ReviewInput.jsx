import { Film, RotateCcw, Sparkles } from "lucide-react"

function ReviewInput({
  review,
  setReview,
  onAnalyze,
  loading,
}) {
  const maxLength = 5000

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!review.trim() || loading) {
      return
    }

    onAnalyze()
  }

  const clearReview = () => {
    setReview("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Text area */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 focus-within:border-blue-400/40 focus-within:bg-white/[0.04] focus-within:shadow-lg focus-within:shadow-blue-500/5">

        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Film size={16} />
            </div>

            <span className="text-sm font-medium text-slate-300">
              Movie Review
            </span>

          </div>

          {review.length > 0 && (
            <button
              type="button"
              onClick={clearReview}
              className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-white"
            >
              <RotateCcw size={13} />
              Clear
            </button>
          )}

        </div>

        <textarea
          value={review}
          onChange={(event) => {
            if (event.target.value.length <= maxLength) {
              setReview(event.target.value)
            }
          }}
          placeholder="Write or paste a movie review here..."
          rows={9}
          className="w-full resize-none bg-transparent px-5 py-5 text-sm leading-7 text-white outline-none placeholder:text-slate-600"
        />

        <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">

          <p className="text-xs text-slate-600">
            The model analyzes the semantic sentiment of your review.
          </p>

          <span
            className={`text-xs ${
              review.length >= maxLength
                ? "text-red-400"
                : "text-slate-600"
            }`}
          >
            {review.length.toLocaleString()} / {maxLength.toLocaleString()}
          </span>

        </div>

      </div>

      {/* Analyze button */}
      <button
        type="submit"
        disabled={!review.trim() || loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        <Sparkles
          size={17}
          className={loading ? "animate-pulse" : ""}
        />

        {loading ? "Analyzing Review..." : "Analyze Sentiment"}
      </button>

    </form>
  )
}

export default ReviewInput