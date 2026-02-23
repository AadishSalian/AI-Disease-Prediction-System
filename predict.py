import joblib
import pandas as pd
import numpy as np
import os
from doctors_db import get_suggestions, get_disease_info

def predict_disease(symptoms_list, age=25, gender='Male', vitals=None, history=None):
    # Load model, feature names, and scaler
    if not os.path.exists('disease_model.joblib') or not os.path.exists('feature_names.joblib') or not os.path.exists('scaler.joblib'):
        return "Required model files not found. Please train the model first."

    model = joblib.load('disease_model.joblib')
    feature_names = joblib.load('feature_names.joblib')
    scaler = joblib.load('scaler.joblib')
    
    # Prepare input data
    input_data = {s: 0 for s in feature_names}
    
    # Set demographics
    input_data['Age'] = age
    input_data['Gender'] = 1 if gender.lower() == 'female' else 0
    
    # Set Vitals (Numerical)
    vitals = vitals or {}
    input_data['Temperature'] = float(vitals.get('temperature', 36.6))
    input_data['Systolic_BP'] = int(vitals.get('systolic', 120))
    input_data['Diastolic_BP'] = int(vitals.get('diastolic', 80))
    input_data['Heart_Rate'] = int(vitals.get('heart_rate', 72))
    
    # Set Lifestyle/History (Categorical/Binary)
    history = history or []
    input_data['Smoking_History'] = 1 if "Current smoker" in history else 0
    input_data['Alcohol_Consumption'] = 1 if any(x in history for x in ["Moderate", "Heavy"]) else 0
    input_data['Exercise_Frequency'] = 3 if "Very Active" in history else (2 if "Moderate" in history else (1 if "Light" in history else 0))
    input_data['Obesity_Status'] = 1 if "Obesity" in history else 0
    
    # Set Symptoms
    for s in symptoms_list:
        if s in input_data:
            input_data[s] = 1
            
    input_df = pd.DataFrame([input_data])[feature_names]
    
    # Scale numerical features
    num_cols = ['Age', 'Temperature', 'Systolic_BP', 'Diastolic_BP', 'Heart_Rate']
    input_df[num_cols] = scaler.transform(input_df[num_cols])
    
    # Make prediction
    probabilities = model.predict_proba(input_df)[0]
    
    # Get top 3 predictions
    classes = model.classes_
    top_indices = np.argsort(probabilities)[-3:][::-1]
    
    results = []
    for i in top_indices:
        disease_name = classes[i]
        results.append({
            "disease": disease_name,
            "confidence": f"{probabilities[i] * 100:.1f}%",
            "doctors": get_suggestions(disease_name),
            "info": get_disease_info(disease_name)
        })
        
    return results

if __name__ == "__main__":
    # Test prediction
    test_symptoms = ["Fever", "Cough", "Fatigue", "Shortness of breath"]
    print(f"Testing with symptoms: {', '.join(test_symptoms)}")
    
    results = predict_disease(test_symptoms, age=30, gender='Male')
    if isinstance(results, str):
        print(results)
    else:
        print("\nTop Predictions:")
        for r in results:
            print(f"- {r['disease']}: {r['confidence']}")
