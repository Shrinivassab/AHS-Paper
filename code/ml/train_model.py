import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# Create directories if they don't exist
os.makedirs('ml/models', exist_ok=True)
os.makedirs('ml/data', exist_ok=True)

def generate_training_data():
    """Generate synthetic training data with n, k, entropy features"""
    np.random.seed(42)
    data = []
    
    for _ in range(10_000):
        n = np.random.randint(100, 1_000_000)
        k = np.random.randint(10, 1_000_000)
        arr = np.random.randint(0, k, n)
        hist = np.histogram(arr, bins=100)[0]
        hist = hist[hist > 0] / n
        entropy = -np.sum(hist * np.log2(hist))
        
        # Strategy selection logic
        if n <= 20:
            strategy = 'insertion'
        elif k <= 1000:
            strategy = 'counting'
        elif k > 1_000_000 and entropy < 8.0:
            strategy = 'radix'
        else:
            strategy = 'quick'
            
        data.append([n, k, entropy, strategy])
    
    return pd.DataFrame(data, columns=['n', 'k', 'entropy', 'strategy'])

def train_and_save_model():
    print("Generating training data...")
    df = generate_training_data()
    df.to_csv('ml/data/training_data.csv', index=False)
    
    # Encode string labels to numbers
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(df['strategy'])
    
    X = df[['n', 'k', 'entropy']]
    y = y_encoded  # Use encoded labels
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print("Training XGBoost model...")
    model = XGBClassifier(
        objective='multi:softmax',
        num_class=len(label_encoder.classes_),
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1
    )
    
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    preds = model.predict(X_test)
    accuracy = accuracy_score(y_test, preds)
    print(f"Model accuracy: {accuracy:.2%}")
    
    # Save both model and label encoder
    joblib.dump({
        'model': model,
        'label_encoder': label_encoder
    }, 'ml/models/ahs_model.pkl')
    print("Model saved to ml/models/ahs_model.pkl")

if __name__ == "__main__":
    train_and_save_model()