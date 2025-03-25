import pandas as pd
from predict import StrategyPredictor

def verify_predictions():
    # Load test data
    test_cases = [
        [20, 100, 1.5, 'insertion'],
        [1000, 500, 2.0, 'counting'],
        [100000, 1000000, 7.5, 'radix'],
        [50000, 50000, 5.0, 'quick']
    ]
    
    predictor = StrategyPredictor()
    correct = 0
    
    for n, k, entropy, expected in test_cases:
        pred = predictor.predict(n, k, entropy)
        print(f"n={n}, k={k}, H={entropy}")
        print(f"Expected: {expected}, Predicted: {pred}")
        if pred == expected:
            correct += 1
        print("---")
    
    print(f"Accuracy: {correct/len(test_cases)*100:.1f}%")

if __name__ == "__main__":
    verify_predictions()