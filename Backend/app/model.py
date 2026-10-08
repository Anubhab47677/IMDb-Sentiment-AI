import time
import numpy as np
import tensorflow as tf

from pathlib import Path

from .preprocessing import preprocess_review


# --------------------------------------------------
# Model path
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "best_sentiment_model.keras"


# --------------------------------------------------
# Load model once
# --------------------------------------------------

print("Loading sentiment model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Sentiment model loaded successfully.")


# --------------------------------------------------
# Prediction
# --------------------------------------------------

def predict_sentiment(review: str):

    start_time = time.perf_counter()

    # Preprocess
    model_input = preprocess_review(review)

    # Predict
    probability = float(
        model.predict(model_input, verbose=0)[0][0]
    )

    # Convert probability to sentiment
    if probability >= 0.5:
        sentiment = "Positive"
    else:
        sentiment = "Negative"

    positive_probability = probability
    negative_probability = 1.0 - probability

    inference_time = (
        time.perf_counter() - start_time
    ) * 1000

    return {
        "sentiment": sentiment,
        "probability": round(probability, 6),
        "positive_probability": round(
            positive_probability, 6
        ),
        "negative_probability": round(
            negative_probability, 6
        ),
        "inference_time_ms": round(
            inference_time, 2
        )
    }