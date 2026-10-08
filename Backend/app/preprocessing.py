import pickle
import json
import re
import numpy as np

from pathlib import Path
from tensorflow.keras.preprocessing.sequence import pad_sequences


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

WORD_INDEX_PATH = BASE_DIR / "data" / "imdb_word_index.pkl"
CONFIG_PATH = BASE_DIR / "data" / "deployment_config.json"


# --------------------------------------------------
# Load IMDb vocabulary
# --------------------------------------------------

with open(WORD_INDEX_PATH, "rb") as f:
    WORD_INDEX = pickle.load(f)


# --------------------------------------------------
# Load deployment configuration
# --------------------------------------------------

with open(CONFIG_PATH, "r") as f:
    CONFIG = json.load(f)


VOCAB_SIZE = CONFIG["vocab_size"]
MAX_SEQUENCE_LENGTH = CONFIG["max_sequence_length"]


# IMDb special tokens
START_INDEX = 1
UNKNOWN_INDEX = 2


# --------------------------------------------------
# Tokenization
# --------------------------------------------------

def tokenize_text(text: str):
    """
    Convert raw review text into simple word tokens.
    """

    text = text.lower()

    # Keep words and basic apostrophes
    tokens = re.findall(r"[a-zA-Z]+(?:'[a-zA-Z]+)?", text)

    return tokens


# --------------------------------------------------
# Encode review
# --------------------------------------------------

def encode_review(text: str):
    """
    Convert a raw movie review into the same
    integer representation expected by the model.
    """

    tokens = tokenize_text(text)

    sequence = [START_INDEX]

    for token in tokens:

        word_id = WORD_INDEX.get(token)

        if word_id is None:

            # Unknown word
            sequence.append(UNKNOWN_INDEX)

        elif word_id + 3 >= VOCAB_SIZE:

            # Outside the selected vocabulary
            sequence.append(UNKNOWN_INDEX)

        else:

            # IMDb uses an offset of +3
            sequence.append(word_id + 3)

    return sequence


# --------------------------------------------------
# Prepare model input
# --------------------------------------------------

def preprocess_review(text: str):

    sequence = encode_review(text)

    padded_sequence = pad_sequences(
        [sequence],
        maxlen=MAX_SEQUENCE_LENGTH,
        padding="post",
        truncating="post"
    )

    return padded_sequence.astype(np.int32)