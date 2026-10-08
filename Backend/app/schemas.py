from pydantic import BaseModel, Field


class ReviewRequest(BaseModel):

    review: str = Field(
        ...,
        min_length=3,
        max_length=5000,
        description="Movie review text"
    )


class PredictionResponse(BaseModel):

    sentiment: str

    probability: float

    positive_probability: float

    negative_probability: float

    inference_time_ms: float