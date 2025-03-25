# code/ml/generate_data.py
import numpy as np
import pandas as pd
from scipy.stats import entropy

def generate_data(n: int, k: int, dist: str):
    arr = np.random.randint(0, k, n) if dist == "uniform" else np.random.zipf(1.5, n)
    hist = np.histogram(arr, bins=100)[0]
    return {"n": n, "k": k, "entropy": entropy(hist), "strategy": "radix"}  # Simulate labels

pd.DataFrame([generate_data(10**6, 10**6, "uniform") for _ in range(100)]).to_csv("data/synthetic/training_data.csv")