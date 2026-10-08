import { useEffect, useMemo, useState } from "react"

import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileWarning,
  RefreshCw,
  Search,
  ShieldAlert,
  Target,
  XCircle,
} from "lucide-react"

const API_URL = "http://127.0.0.1:8000"


/* =========================================================
   Utility Functions
   ========================================================= */

function getField(item, ...keys) {
  if (!item || typeof item !== "object") return undefined

  for (const key of keys) {
    if (
      item[key] !== undefined &&
      item[key] !== null &&
      item[key] !== ""
    ) {
      return item[key]
    }
  }

  return undefined
}


/* ---------------------------------------------------------
   Normalize backend response

   Backend format:

   {
     "errors": [
       {
         "Type": "False Positive",
         "Actual": "Negative",
         "Predicted": "Positive",
         "Probability": 0.9858,
         "Review": "..."
       }
     ]
   }
   --------------------------------------------------------- */

function normalizeErrors(data) {
  const emptyResult = {
    falsePositives: [],
    falseNegatives: [],
  }

  if (!data) {
    return emptyResult
  }

  /*
   * The actual FastAPI response contains:
   *
   * data.errors
   *
   * We also keep support for the older possible formats.
   */

  let allErrors = []

  if (Array.isArray(data.errors)) {
    allErrors = data.errors
  } else if (Array.isArray(data)) {
    allErrors = data
  }

  /*
   * Fallback for separate arrays, in case the backend
   * format changes later.
   */

  if (allErrors.length === 0) {
    const fp =
      data.false_positives ||
      data.falsePositives ||
      data.fp ||
      data.false_positive ||
      []

    const fn =
      data.false_negatives ||
      data.falseNegatives ||
      data.fn ||
      data.false_negative ||
      []

    return {
      falsePositives: Array.isArray(fp) ? fp : [],
      falseNegatives: Array.isArray(fn) ? fn : [],
    }
  }

  /*
   * Split the single errors array using the backend's
   * "Type" field.
   */

  const falsePositives = allErrors.filter((item) => {
    const type = String(
      getField(
        item,
        "Type",
        "type",
        "error_type",
        "errorType",
        "kind"
      ) || ""
    ).toLowerCase()

    return (
      type.includes("false positive") ||
      type === "fp"
    )
  })

  const falseNegatives = allErrors.filter((item) => {
    const type = String(
      getField(
        item,
        "Type",
        "type",
        "error_type",
        "errorType",
        "kind"
      ) || ""
    ).toLowerCase()

    return (
      type.includes("false negative") ||
      type === "fn"
    )
  })

  return {
    falsePositives,
    falseNegatives,
  }
}


/* =========================================================
   Error Data Helpers
   ========================================================= */

function getReview(item) {
  return (
    getField(
      item,
      "Review",
      "review",
      "text",
      "review_text",
      "reviewText",
      "content"
    ) || "Review text unavailable."
  )
}


function getActual(item) {
  const value = getField(
    item,
    "Actual",
    "actual",
    "actual_label",
    "actualLabel",
    "true_label",
    "true",
    "label"
  )

  if (typeof value === "number") {
    return value === 1 ? "Positive" : "Negative"
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()

    if (
      normalized === "1" ||
      normalized === "positive" ||
      normalized === "pos"
    ) {
      return "Positive"
    }

    if (
      normalized === "0" ||
      normalized === "negative" ||
      normalized === "neg"
    ) {
      return "Negative"
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1).toLowerCase()
    )
  }

  return "Unknown"
}


function getPredicted(item) {
  const value = getField(
    item,
    "Predicted",
    "predicted",
    "predicted_label",
    "predictedLabel",
    "prediction",
    "predicted_sentiment",
    "predictedSentiment"
  )

  if (typeof value === "number") {
    return value === 1 ? "Positive" : "Negative"
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()

    if (
      normalized === "1" ||
      normalized === "positive" ||
      normalized === "pos"
    ) {
      return "Positive"
    }

    if (
      normalized === "0" ||
      normalized === "negative" ||
      normalized === "neg"
    ) {
      return "Negative"
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1).toLowerCase()
    )
  }

  return "Unknown"
}


function getProbability(item) {
  const value = getField(
    item,
    "Probability",
    "probability",
    "predicted_probability",
    "predictedProbability",
    "confidence",
    "Confidence",
    "score",
    "prob"
  )

  if (typeof value !== "number") {
    return null
  }

  return value <= 1 ? value * 100 : value
}


function getCategory(item) {
  return (
    getField(
      item,
      "Category",
      "category",
      "error_category",
      "errorCategory",
      "reason"
    ) || "Classification Error"
  )
}


function getExplanation(item, type) {
  const explanation = getField(
    item,
    "Explanation",
    "explanation",
    "analysis",
    "description",
    "reason"
  )

  if (explanation) {
    return explanation
  }

  if (type === "FP") {
    return "The review is actually negative, but the model assigned a positive sentiment."
  }

  return "The review is actually positive, but the model assigned a negative sentiment."
}


/* =========================================================
   Error Card
   ========================================================= */

function ErrorCard({ item, type, index }) {
  const probability = getProbability(item)
  const actual = getActual(item)
  const predicted = getPredicted(item)
  const category = getCategory(item)
  const explanation = getExplanation(item, type)

  const isFP = type === "FP"

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isFP
                ? "bg-amber-500/10 text-amber-400"
                : "bg-purple-500/10 text-purple-400"
            }`}
          >
            {isFP ? (
              <AlertTriangle size={18} />
            ) : (
              <CircleAlert size={18} />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {isFP ? "False Positive" : "False Negative"} #{index + 1}
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {category}
            </p>
          </div>

        </div>


        {probability !== null && (
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-right">

            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-sm font-bold text-blue-400">
              {probability.toFixed(2)}%
            </p>

          </div>
        )}

      </div>


      {/* Review */}
      <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">

        <p className="text-sm leading-7 text-slate-300">
          "{getReview(item)}"
        </p>

      </div>


      {/* Actual / Predicted */}
      <div className="mt-4 grid grid-cols-2 gap-3">

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">

          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Actual
          </p>

          <div className="mt-2 flex items-center gap-2">

            <CheckCircle2
              size={15}
              className="text-emerald-400"
            />

            <span className="text-sm font-semibold text-slate-200">
              {actual}
            </span>

          </div>

        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">

          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Predicted
          </p>

          <div className="mt-2 flex items-center gap-2">

            <XCircle
              size={15}
              className="text-red-400"
            />

            <span className="text-sm font-semibold text-slate-200">
              {predicted}
            </span>

          </div>

        </div>

      </div>


      {/* Interpretation */}
      <div className="mt-4 border-t border-slate-800 pt-4">

        <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
          Error interpretation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {explanation}
        </p>

      </div>

    </div>
  )
}


/* =========================================================
   Main Component
   ========================================================= */

function ErrorAnalysis() {

  const [errors, setErrors] = useState({
    falsePositives: [],
    falseNegatives: [],
  })

  const [activeTab, setActiveTab] = useState("FP")

  const [categoryFilter, setCategoryFilter] = useState("All")

  const [searchTerm, setSearchTerm] = useState("")

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  /* =======================================================
     Fetch Error Analysis
     ======================================================= */

  const fetchErrors = async () => {

    try {

      setLoading(true)
      setError("")

      const response = await fetch(`${API_URL}/errors`)

      if (!response.ok) {
        throw new Error(
          `Unable to load error-analysis data. Server returned ${response.status}.`
        )
      }

      const data = await response.json()

      console.log("Error analysis API response:", data)

      const normalized = normalizeErrors(data)

      console.log("Normalized error analysis:", normalized)

      setErrors(normalized)

    } catch (err) {

      console.error("Error analysis request failed:", err)

      setError(
        err.message ||
          "Could not connect to the FastAPI backend."
      )

    } finally {

      setLoading(false)

    }
  }


  /* =======================================================
     Initial Load
     ======================================================= */

  useEffect(() => {
    fetchErrors()
  }, [])


  /* =======================================================
     Active Error List
     ======================================================= */

  const activeErrors =
    activeTab === "FP"
      ? errors.falsePositives
      : errors.falseNegatives


  /* =======================================================
     Categories
     ======================================================= */

  const categories = useMemo(() => {

    const unique = activeErrors
      .map((item) => getCategory(item))
      .filter(Boolean)

    return ["All", ...new Set(unique)]

  }, [activeErrors])


  /* =======================================================
     Filter Errors
     ======================================================= */

  const filteredErrors = useMemo(() => {

    return activeErrors.filter((item) => {

      const category = getCategory(item)

      const review = getReview(item).toLowerCase()

      const search = searchTerm.toLowerCase().trim()

      const matchesCategory =
        categoryFilter === "All" ||
        category === categoryFilter

      const matchesSearch =
        !search ||
        review.includes(search) ||
        category.toLowerCase().includes(search)

      return matchesCategory && matchesSearch

    })

  }, [
    activeErrors,
    categoryFilter,
    searchTerm,
  ])


  /* =======================================================
     Total Errors
     ======================================================= */

  const totalErrors =
    errors.falsePositives.length +
    errors.falseNegatives.length


  /* =======================================================
     Render
     ======================================================= */

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">

        {/* =================================================
            Header
            ================================================= */}

        <section>

          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-400">

            <ShieldAlert size={14} />

            Model Error Analysis

          </div>


          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">

                Where does the model{" "}

                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  get it wrong?
                </span>

              </h1>


              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">

                Inspect false-positive and false-negative predictions
                from the trained LSTM sentiment classifier and identify
                patterns behind incorrect classifications.

              </p>

            </div>


            <button
              onClick={fetchErrors}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500/50 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />

              Refresh data

            </button>

          </div>

        </section>


        {/* =================================================
            Summary Cards
            ================================================= */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* False Positives */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                False Positives
              </p>

              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                <AlertTriangle size={18} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold">
              {errors.falsePositives.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Negative reviews predicted positive
            </p>

          </div>


          {/* False Negatives */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                False Negatives
              </p>

              <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
                <CircleAlert size={18} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold">
              {errors.falseNegatives.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Positive reviews predicted negative
            </p>

          </div>


          {/* Total Errors */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Total Errors
              </p>

              <div className="rounded-xl bg-red-500/10 p-2 text-red-400">
                <FileWarning size={18} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold">
              {totalErrors}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Available error examples
            </p>

          </div>


          {/* Active Model */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Active Model
              </p>

              <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                <BrainCircuit size={18} />
              </div>

            </div>

            <p className="mt-4 text-3xl font-bold">
              LSTM
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Deployed sentiment classifier
            </p>

          </div>

        </section>


        {/* =================================================
            Loading State
            ================================================= */}

        {loading && (

          <div className="mt-10 flex min-h-72 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">

            <div className="text-center">

              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-blue-400"
              />

              <p className="mt-4 text-sm text-slate-400">
                Loading error-analysis results...
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            Error State
            ================================================= */}

        {!loading && error && (

          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">

            <div className="flex items-start gap-4">

              <CircleAlert
                size={22}
                className="mt-0.5 text-red-400"
              />

              <div>

                <h3 className="font-semibold text-red-300">
                  Unable to load error analysis
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {error}
                </p>

                <button
                  onClick={fetchErrors}
                  className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                >
                  Try again
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            Main Analysis
            ================================================= */}

        {!loading && !error && (

          <>

            {/* =================================================
                Tabs
                ================================================= */}

            <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-2">

              <div className="grid grid-cols-2 gap-2">

                {/* FP */}
                <button
                  onClick={() => {
                    setActiveTab("FP")
                    setCategoryFilter("All")
                    setSearchTerm("")
                  }}
                  className={`rounded-xl px-5 py-4 text-sm font-semibold transition ${
                    activeTab === "FP"
                      ? "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >

                  <span className="flex items-center justify-center gap-2">

                    <AlertTriangle size={17} />

                    False Positives

                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                      {errors.falsePositives.length}
                    </span>

                  </span>

                </button>


                {/* FN */}
                <button
                  onClick={() => {
                    setActiveTab("FN")
                    setCategoryFilter("All")
                    setSearchTerm("")
                  }}
                  className={`rounded-xl px-5 py-4 text-sm font-semibold transition ${
                    activeTab === "FN"
                      ? "bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >

                  <span className="flex items-center justify-center gap-2">

                    <CircleAlert size={17} />

                    False Negatives

                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
                      {errors.falseNegatives.length}
                    </span>

                  </span>

                </button>

              </div>

            </section>


            {/* =================================================
                Filters
                ================================================= */}

            <section className="mt-5 flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reviews or error categories..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50"
                />

              </div>


              <div className="relative">

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 pr-10 text-sm text-slate-300 outline-none focus:border-blue-500/50 md:min-w-56"
                >

                  {categories.map((category) => (

                    <option
                      key={category}
                      value={category}
                      className="bg-slate-900"
                    >
                      {category}
                    </option>

                  ))}

                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

              </div>

            </section>


            {/* =================================================
                Error Cards
                ================================================= */}

            {filteredErrors.length > 0 ? (

              <section className="mt-6 grid gap-5 lg:grid-cols-2">

                {filteredErrors.map((item, index) => (

                  <ErrorCard
                    key={`${activeTab}-${index}`}
                    item={item}
                    type={activeTab}
                    index={index}
                  />

                ))}

              </section>

            ) : (

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 py-20 text-center">

                <Search
                  size={28}
                  className="mx-auto text-slate-600"
                />

                <h3 className="mt-4 font-semibold text-slate-300">
                  No error examples found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing the search or category filter.
                </p>

              </div>

            )}


            {/* =================================================
                Interpretation Framework
                ================================================= */}

            <section className="mt-12 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-slate-900/40 to-purple-500/5 p-7">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Target size={20} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                    Error Analysis Framework
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Understanding classification failures
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">

                    False positives occur when a negative review is
                    classified as positive, while false negatives occur
                    when a positive review is classified as negative.
                    Examining these examples helps reveal limitations
                    in sequential sentiment modelling.

                  </p>

                </div>

              </div>


              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  "Sarcasm",
                  "Negation",
                  "Mixed sentiment",
                  "Ambiguous language",
                  "Quoted text",
                  "Long reviews",
                  "Context-dependent meaning",
                ].map((topic) => (

                  <div
                    key={topic}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
                  >

                    <p className="text-sm font-medium text-slate-300">
                      {topic}
                    </p>

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


export default ErrorAnalysis