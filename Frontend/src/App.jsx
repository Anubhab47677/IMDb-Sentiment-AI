import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Analyzer from "./pages/Analyzer"
import Dashboard from "./pages/Dashboard"
import ModelComparison from "./pages/ModelComparison"
import ErrorAnalysis from "./pages/ErrorAnalysis"
import Sensitivity from "./pages/Sensitivity"
import About from "./pages/About"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/comparison" element={<ModelComparison />} />
          <Route path="/errors" element={<ErrorAnalysis />} />
          <Route path="/sensitivity" element={<Sensitivity />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App