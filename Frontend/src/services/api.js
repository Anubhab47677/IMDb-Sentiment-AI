import axios from "axios"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

export const predictSentiment = async (review) => {
  const response = await API.post("/predict", {
    review,
  })

  return response.data
}

export const getModelInfo = async () => {
  const response = await API.get("/model")
  return response.data
}

export const getModelComparison = async () => {
  const response = await API.get("/comparison")
  return response.data
}

export const getModelRanking = async () => {
  const response = await API.get("/ranking")
  return response.data
}

export const getTrainingResults = async () => {
  const response = await API.get("/training")
  return response.data
}

export const getErrorAnalysis = async () => {
  const response = await API.get("/errors")
  return response.data
}

export const getSensitivityAnalysis = async () => {
  const response = await API.get("/sensitivity")
  return response.data
}

export const checkBackendHealth = async () => {
  const response = await API.get("/health")
  return response.data
}