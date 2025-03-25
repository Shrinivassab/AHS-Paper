import joblib
import numpy as np
import sys

class StrategyPredictor:
    def __init__(self, model_path='ml/models/ahs_model.pkl'):
        data = joblib.load(model_path)
        self.model = data['model']
        self.label_encoder = data['label_encoder']
    
    def predict(self, n: int, k: int, entropy: float) -> str:
        """Predict optimal sorting strategy"""
        features = np.array([[n, k, entropy]])
        pred = self.model.predict(features)
        return self.label_encoder.inverse_transform(pred)[0]

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("quick", end="")
        sys.exit(1)
        
    try:
        n = int(sys.argv[1])
        k = int(sys.argv[2])
        entropy = float(sys.argv[3])
        
        predictor = StrategyPredictor()
        print(predictor.predict(n, k, entropy), end="")
    except Exception as e:
        print("quick", end="")