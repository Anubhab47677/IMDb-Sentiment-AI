import json
import pandas as pd

from pathlib import Path


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
RESULTS_DIR = BASE_DIR / "results"


# --------------------------------------------------
# Configuration
# --------------------------------------------------

def load_config():

    with open(DATA_DIR / "deployment_config.json", "r") as f:
        return json.load(f)


# --------------------------------------------------
# Model comparison
# --------------------------------------------------

def load_model_comparison():

    path = RESULTS_DIR / "final_model_comparison.csv"

    if not path.exists():
        return []

    df = pd.read_csv(path)

    return df.replace(
        {float("nan"): None}
    ).to_dict(orient="records")


# --------------------------------------------------
# Model ranking
# --------------------------------------------------

def load_model_ranking():

    path = RESULTS_DIR / "model_ranking.csv"

    if not path.exists():
        return []

    df = pd.read_csv(path)

    return df.replace(
        {float("nan"): None}
    ).to_dict(orient="records")


# --------------------------------------------------
# Training results
# --------------------------------------------------

def load_training_results():

    path = RESULTS_DIR / "training_results.csv"

    if not path.exists():
        return []

    df = pd.read_csv(path)

    return df.replace(
        {float("nan"): None}
    ).to_dict(orient="records")


# --------------------------------------------------
# Error analysis
# --------------------------------------------------

def load_error_analysis():

    path = RESULTS_DIR / "error_analysis.csv"

    if not path.exists():
        return []

    df = pd.read_csv(path)

    return df.replace(
        {float("nan"): None}
    ).to_dict(orient="records")


# --------------------------------------------------
# Sensitivity analysis
# --------------------------------------------------

def load_sensitivity():

    files = {
        "sequence_length": "sequence_sensitivity.csv",
        "embedding_dimension": "embedding_sensitivity.csv",
        "dropout": "dropout_sensitivity.csv"
    }

    results = {}

    for key, filename in files.items():

        path = RESULTS_DIR / filename

        if path.exists():

            df = pd.read_csv(path)

            results[key] = df.replace(
                {float("nan"): None}
            ).to_dict(orient="records")

        else:

            results[key] = []

    return results