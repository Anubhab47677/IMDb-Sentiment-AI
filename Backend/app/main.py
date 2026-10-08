from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    ReviewRequest,
    PredictionResponse
)

from .model import predict_sentiment

from .analytics import (
    load_config,
    load_model_comparison,
    load_model_ranking,
    load_training_results,
    load_error_analysis,
    load_sensitivity
)


# ==================================================
# Application
# ==================================================

app = FastAPI(
    title="IMDb Sentiment AI",
    description=(
        "Deep Learning based IMDb movie review "
        "sentiment analysis platform using LSTM."
    ),
    version="1.0.0"
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ==================================================
# Root
# ==================================================

@app.get("/")
def root():

    return {
        "name": "IMDb Sentiment AI",
        "version": "1.0.0",
        "status": "online",
        "model": "LSTM"
    }


# ==================================================
# Health
# ==================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "IMDb Sentiment API"
    }


# ==================================================
# Prediction
# ==================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(request: ReviewRequest):

    try:

        return predict_sentiment(
            request.review
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==================================================
# Model information
# ==================================================

@app.get("/model")
def model_information():

    config = load_config()

    return {
        "model": config["model_name"],
        "vocab_size": config["vocab_size"],
        "max_sequence_length":
            config["max_sequence_length"],
        "embedding_dimension":
            config["embedding_dim"],
        "rnn_units":
            config["rnn_units"],
        "dropout":
            config["dropout_rate"],
        "learning_rate":
            config["learning_rate"],
        "padding":
            config["padding"],
        "truncating":
            config["truncating"],
        "classification_threshold":
            config["threshold"]
    }


# ==================================================
# Model comparison
# ==================================================

@app.get("/comparison")
def model_comparison():

    return {
        "models": load_model_comparison()
    }


# ==================================================
# Model ranking
# ==================================================

@app.get("/ranking")
def model_ranking():

    return {
        "models": load_model_ranking()
    }


# ==================================================
# Training results
# ==================================================

@app.get("/training")
def training_results():

    return {
        "results": load_training_results()
    }


# ==================================================
# Error analysis
# ==================================================

@app.get("/errors")
def error_analysis():

    return {
        "errors": load_error_analysis()
    }


# ==================================================
# Sensitivity analysis
# ==================================================

@app.get("/sensitivity")
def sensitivity_analysis():

    return load_sensitivity()