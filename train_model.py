import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train():
    # Load dataset
    if not os.path.exists('disease_data.csv'):
        print("Dataset not found. Please run generate_data.py first.")
        return

    df = pd.read_csv('disease_data.csv')
    
    # Preprocess demographics
    # Convert Gender to numeric (0 for Male, 1 for Female)
    df['Gender'] = df['Gender'].map({'Male': 0, 'Female': 1})
    
    # Identify numerical features to scale
    numerical_features = ['Age', 'Temperature', 'Systolic_BP', 'Diastolic_BP', 'Heart_Rate']
    
    # Split features and target
    X = df.drop('Disease', axis=1)
    y = df['Disease']
    
    # Scaler for numerical features
    scaler = StandardScaler()
    X[numerical_features] = scaler.fit_transform(X[numerical_features])
    
    # Save the scaler
    joblib.dump(scaler, 'scaler.joblib')
    print("Scaler saved as scaler.joblib")
    
    # Feature names
    feature_names = X.columns.tolist()
    joblib.dump(feature_names, 'feature_names.joblib')
    
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Advanced Classifier: Gradient Boosting for complex analysis
    from sklearn.ensemble import GradientBoostingClassifier
    print("Starting Training with Expertised Features (Gradient Boosting)...")
    
    model = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Expertised Model Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    joblib.dump(model, 'disease_model.joblib')
    print("Model saved as disease_model.joblib")

if __name__ == "__main__":
    train()
