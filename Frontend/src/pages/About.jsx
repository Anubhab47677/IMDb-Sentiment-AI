import { useEffect, useState } from "react"

import {

  BrainCircuit,

  Database,

  Layers3,

  Cpu,

  Code2,

  GitBranch,

  ArrowRight,

  CheckCircle2,

  Info,

  Zap,

  Target,

  ShieldCheck,

  BarChart3,

  Settings2,

} from "lucide-react"



import { getModelInfo } from "../services/api"



const About = () => {

  const [model, setModel] = useState(null)

  const [loading, setLoading] = useState(true)

  const [apiError, setApiError] = useState(false)



  useEffect(() => {

    const loadModel = async () => {

      try {

        const data = await getModelInfo()

        setModel(data)

      } catch (error) {

        console.error("Failed to load model information:", error)

        setApiError(true)

      } finally {

        setLoading(false)

      }

    }



    loadModel()

  }, [])



  const modelName =

    model?.model_name ||

    model?.name ||

    model?.model ||

    "LSTM"



  const vocabSize =

    model?.vocab_size ??

    model?.configuration?.vocab_size ??

    10000



  const sequenceLength =

    model?.max_sequence_length ??

    model?.sequence_length ??

    model?.configuration?.max_sequence_length ??

    100



  const embeddingDim =

    model?.embedding_dim ??

    model?.configuration?.embedding_dim ??

    128



  const rnnUnits =

    model?.rnn_units ??

    model?.configuration?.rnn_units ??

    64



  const dropout =

    model?.dropout_rate ??

    model?.configuration?.dropout_rate ??

    0.3



  const threshold =

    model?.threshold ??

    model?.configuration?.threshold ??

    0.5



  const learningRate =

    model?.learning_rate ??

    model?.configuration?.learning_rate ??

    0.001



  const architecture = [

    {

      number: "01",

      title: "Input Review",

      description: "Raw movie-review text entered by the user.",

      icon: Database,

    },

    {

      number: "02",

      title: "Tokenization",

      description: "Text is converted into integer word-index sequences.",

      icon: Code2,

    },

    {

      number: "03",

      title: "Padding",

      description: `Sequences are padded or truncated to ${sequenceLength} tokens.`,

      icon: Layers3,

    },

    {

      number: "04",

      title: "Embedding",

      description: `${embeddingDim}-dimensional dense word representations.`,

      icon: BrainCircuit,

    },

    {

      number: "05",

      title: modelName,

      description: `${rnnUnits} recurrent units model sequential context.`,

      icon: GitBranch,

    },

    {

      number: "06",

      title: "Sigmoid Output",

      description: "Produces a probability for binary sentiment classification.",

      icon: Target,

    },

  ]



  const technologies = [

    {

      name: "Python",

      description: "Model development and experimentation",

    },

    {

      name: "TensorFlow / Keras",

      description: "Deep-learning model implementation",

    },

    {

      name: "FastAPI",

      description: "Production inference API",

    },

    {

      name: "React",

      description: "Interactive frontend application",

    },

    {

      name: "Tailwind CSS",

      description: "Modern responsive interface",

    },

    {

      name: "Recharts",

      description: "Interactive experiment visualizations",

    },

  ]



  return (

    <div className="min-h-screen bg-[#020617] text-white">

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 lg:pt-36">



        {/* HERO */}

        <section className="mb-20 relative z-0">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-blue-400">

            <Info size={14} />

            About the Project

          </div>



          <div className="max-w-4xl">

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">

              Understanding sentiment

              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">

                through recurrent networks.

              </span>

            </h1>



            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">

              IMDb Sentiment AI is a deep-learning based binary sentiment

              classification system that analyzes movie reviews and predicts

              whether the expressed sentiment is positive or negative.

            </p>

          </div>

        </section>



        {/* PROJECT OVERVIEW */}

        <section className="mb-20 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">



          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-7 backdrop-blur">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">

                <BrainCircuit className="text-blue-400" size={22} />

              </div>



              <div>

                <p className="text-xs uppercase tracking-widest text-blue-400">

                  Project Overview

                </p>



                <h2 className="mt-1 text-xl font-semibold">

                  IMDb Movie Review Classification

                </h2>

              </div>

            </div>



            <p className="leading-8 text-slate-400">

              The project investigates recurrent neural-network architectures

              for sentiment classification on the IMDb movie-review dataset.

              Multiple architectures are trained and evaluated before selecting

              a deployed model for real-time inference.

            </p>



            <p className="mt-4 leading-8 text-slate-400">

              The deployed application preserves the preprocessing pipeline

              used during model development so that user-provided reviews are

              transformed consistently before inference.

            </p>

          </div>



          <div className="grid grid-cols-2 gap-4">



            <StatBox

              icon={Database}

              label="Vocabulary"

              value={`${Math.round(vocabSize / 1000)}K`}

            />



            <StatBox

              icon={Layers3}

              label="Sequence"

              value={sequenceLength}

            />



            <StatBox

              icon={BrainCircuit}

              label="Embedding"

              value={embeddingDim}

            />



            <StatBox

              icon={Cpu}

              label="RNN Units"

              value={rnnUnits}

            />



          </div>

        </section>



        {/* ARCHITECTURE */}

        <section className="mb-20">

          <SectionHeader

            eyebrow="Model Architecture"

            title="From review to prediction."

            description="The deployed inference pipeline follows the same fundamental processing stages used during model development."

          />



          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">

            {architecture.map((item, index) => {

              const Icon = item.icon



              return (

                <div

                  key={item.number}

                  className="group relative rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900/70"

                >

                  <div className="mb-6 flex items-center justify-between">

                    <span className="text-xs font-semibold text-blue-400">

                      {item.number}

                    </span>



                    <Icon

                      size={18}

                      className="text-slate-500 transition group-hover:text-blue-400"

                    />

                  </div>



                  <h3 className="font-semibold">{item.title}</h3>



                  <p className="mt-2 text-xs leading-6 text-slate-500">

                    {item.description}

                  </p>



                  {index < architecture.length - 1 && (

                    <ArrowRight

                      size={14}

                      className="absolute -right-3 top-1/2 z-10 hidden text-slate-600 lg:block"

                    />

                  )}

                </div>

              )

            })}

          </div>

        </section>



        {/* MODEL CONFIGURATION */}

        <section className="mb-20">

          <SectionHeader

            eyebrow="Deployment Configuration"

            title={`${modelName} configuration.`}

            description="The deployed model configuration is retrieved from the FastAPI backend."

          />



          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40">



            {loading ? (

              <div className="flex items-center justify-center p-16 text-slate-500">

                Loading model configuration...

              </div>

            ) : (

              <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">



                <ConfigItem

                  label="Model"

                  value={modelName}

                />



                <ConfigItem

                  label="Vocabulary"

                  value={vocabSize.toLocaleString()}

                />



                <ConfigItem

                  label="Sequence Length"

                  value={sequenceLength}

                />



                <ConfigItem

                  label="Embedding Dimension"

                  value={embeddingDim}

                />



                <ConfigItem

                  label="Recurrent Units"

                  value={rnnUnits}

                />



                <ConfigItem

                  label="Dropout"

                  value={dropout}

                />



                <ConfigItem

                  label="Learning Rate"

                  value={learningRate}

                />



                <ConfigItem

                  label="Decision Threshold"

                  value={threshold}

                />



              </div>

            )}



          </div>



          {apiError && (

            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">

              Backend model configuration could not be reached. Showing the

              deployment defaults used by the application.

            </div>

          )}

        </section>



        {/* TRAINING / EVALUATION */}

        <section className="mb-20">

          <SectionHeader

            eyebrow="Experimentation"

            title="Four recurrent architectures."

            description="The project evaluates multiple recurrent architectures before deployment."

          />



          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">



            <ModelCard

              name="Simple RNN"

              description="Baseline recurrent architecture."

              icon={GitBranch}

            />



            <ModelCard

              name="LSTM"

              description="Long-term sequence modelling with gated memory."

              icon={BrainCircuit}

              active

            />



            <ModelCard

              name="Bidirectional LSTM"

              description="Processes sequence information in both directions."

              icon={GitBranch}

            />



            <ModelCard

              name="GRU"

              description="Gated recurrent architecture with fewer parameters."

              icon={Zap}

            />



          </div>

        </section>



        {/* EVALUATION */}

        <section className="mb-20">

          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 p-8 sm:p-10">



            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">



              <div className="max-w-2xl">

                <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-blue-400">

                  <BarChart3 size={15} />

                  Evaluation

                </div>



                <h2 className="text-2xl font-bold sm:text-3xl">

                  Performance is evaluated beyond accuracy.

                </h2>



                <p className="mt-4 leading-7 text-slate-400">

                  The experiment compares classification, probabilistic and

                  computational characteristics across the recurrent

                  architectures.

                </p>

              </div>



              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[520px] lg:shrink-0">
                {[
                  ["Accuracy", "78.80%"],
                  ["F1 Score", "78.46%"],
                  ["ROC-AUC", "0.8479"],
                  ["PR-AUC", "0.8244"],
                  ["MCC", "0.576"],
                  ["Brier", "0.1881"],
                  ["Log Loss", "0.9148"],
                  ["Inference", "2.83s"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex h-[88px] min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 px-2.5 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
                  >
                    <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                      {label}
                    </span>
                    <span className="mt-2 whitespace-nowrap text-sm font-semibold text-white sm:text-base">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>



        {/* WHY DEPLOY LSTM */}

        <section className="mb-20">

          <SectionHeader

            eyebrow="Deployment Decision"

            title="Why this model is deployed."

            description="The final deployment choice considers both predictive performance and practical inference requirements."

          />



          <div className="mt-10 grid gap-5 md:grid-cols-3">



            <ReasonCard

              icon={Target}

              title="Strong classification"

              text="The deployed model provides strong binary sentiment classification performance on the evaluated IMDb test data."

            />



            <ReasonCard

              icon={Zap}

              title="Practical inference"

              text="The recurrent architecture provides a practical balance between model complexity and inference performance."

            />



            <ReasonCard

              icon={ShieldCheck}

              title="Consistent pipeline"

              text="The deployment uses the same vocabulary, sequence handling and preprocessing configuration established during development."

            />



          </div>

        </section>



        {/* TECHNOLOGY STACK */}

        <section className="mb-20">

          <SectionHeader

            eyebrow="Technology Stack"

            title="Built as an end-to-end ML application."

            description="The project combines model development, API-based inference and an interactive analytical frontend."

          />



          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">



            {technologies.map((tech) => (

              <div

                key={tech.name}

                className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition hover:border-blue-500/30"

              >

                <div className="flex items-start gap-4">



                  <div className="rounded-lg bg-blue-500/10 p-2">

                    <Code2 size={18} className="text-blue-400" />

                  </div>



                  <div>

                    <h3 className="font-semibold">{tech.name}</h3>



                    <p className="mt-1 text-sm text-slate-500">

                      {tech.description}

                    </p>

                  </div>



                </div>

              </div>

            ))}



          </div>

        </section>



        {/* LIMITATIONS */}

        <section className="mb-20">

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-7">



            <div className="flex gap-4">



              <div className="shrink-0 rounded-xl bg-amber-500/10 p-3">

                <Settings2

                  size={21}

                  className="text-amber-400"

                />

              </div>



              <div>

                <h2 className="text-xl font-semibold">

                  Model limitations

                </h2>



                <p className="mt-3 max-w-4xl leading-7 text-slate-400">

                  Sentiment classification can remain challenging for reviews

                  containing sarcasm, negation, mixed sentiment, ambiguous

                  language, long-range context or context-dependent meaning.

                  These cases are explored through the project's error-analysis

                  interface.

                </p>

              </div>



            </div>

          </div>

        </section>



        {/* FOOTER STATEMENT */}

        <section className="border-t border-white/10 pt-10 text-center">



          <div className="mx-auto flex max-w-2xl flex-col items-center">



            <div className="mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/5 p-3">

              <CheckCircle2

                size={22}

                className="text-emerald-400"

              />

            </div>



            <h2 className="text-2xl font-bold">

              An end-to-end sentiment intelligence system.

            </h2>



            <p className="mt-3 leading-7 text-slate-500">

              From recurrent neural-network experimentation to real-time

              sentiment inference and interactive model analysis.

            </p>



          </div>



        </section>



      </main>

    </div>

  )

}





/* -------------------------------------------------------------------------- */

/* Reusable Components                                                        */

/* -------------------------------------------------------------------------- */



const SectionHeader = ({

  eyebrow,

  title,

  description,

}) => {

  return (

    <div className="max-w-3xl">

      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">

        {eyebrow}

      </p>



      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">

        {title}

      </h2>



      <p className="mt-4 leading-7 text-slate-500">

        {description}

      </p>

    </div>

  )

}





const StatBox = ({

  icon: Icon,

  label,

  value,

}) => {

  return (

    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">

      <Icon

        size={19}

        className="text-blue-400"

      />



      <p className="mt-5 text-xs uppercase tracking-wider text-slate-500">

        {label}

      </p>



      <p className="mt-1 text-2xl font-bold">

        {value}

      </p>

    </div>

  )

}





const ConfigItem = ({

  label,

  value,

}) => {

  return (

    <div className="border-b border-white/10 p-6 last:border-b-0 sm:border-b-0">

      <p className="text-xs uppercase tracking-wider text-slate-500">

        {label}

      </p>



      <p className="mt-2 text-lg font-semibold text-white">

        {value}

      </p>

    </div>

  )

}





const ModelCard = ({

  name,

  description,

  icon: Icon,

  active = false,

}) => {

  return (

    <div

      className={`rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 ${

        active

          ? "border-blue-500/40 bg-blue-500/5"

          : "border-white/10 bg-slate-900/40"

      }`}

    >

      <div className="flex items-center justify-between">



        <div

          className={`rounded-xl p-3 ${

            active

              ? "bg-blue-500/10 text-blue-400"

              : "bg-white/5 text-slate-400"

          }`}

        >

          <Icon size={20} />

        </div>



        {active && (

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald-400">

            Deployed

          </span>

        )}



      </div>



      <h3 className="mt-6 font-semibold">

        {name}

      </h3>



      <p className="mt-2 text-sm leading-6 text-slate-500">

        {description}

      </p>

    </div>

  )

}





const ReasonCard = ({

  icon: Icon,

  title,

  text,

}) => {

  return (

    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">



      <div className="mb-5 inline-flex rounded-xl bg-blue-500/10 p-3">

        <Icon

          size={21}

          className="text-blue-400"

        />

      </div>



      <h3 className="text-lg font-semibold">

        {title}

      </h3>



      <p className="mt-3 text-sm leading-7 text-slate-500">

        {text}

      </p>



    </div>

  )

}





export default About
