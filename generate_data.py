import pandas as pd
import numpy as np
import random

# List of symptoms from symptoms.html
SYMPTOMS = [
    "Fever", "Weakness", "Fatigue", "Weight loss", "Weight gain", "night sweats", "Chills", "Loss of appetite",
    "Headache", "Confusion", "Fainting", "Tingling", "Dizziness", "Numbness", "Memory problems", "Blurred vision",
    "Cough", "Wheezing", "Sore throat", "Nazal congestion", "Shortness of breath", "Chest tightness", "Runny nose", "Sneezing",
    "Chest pain", "Rapid heartbeat", "Swelling in legs", "Palpitations", "Slow heartbeat", "High blood pressure",
    "Nausea", "Diarrhea", "Vomiting", "Abdominal pain", "Constipation", "Bloating", "Heartburn", "Blood in stool",
    "Joint pain", "Muscle aches", "Stiffness", "Swelling in joints", "Limited mobility", "Cramping", "Neck pain",
    "Rash", "Hives", "Dry skin", "Slow wound healing", "Itching", "Skin decoloration", "Bruising Easily",
    "Anxiety", "Depression", "Insomnia", "Mood swings", "Difficulty in concentrating", "Irritability",
    "Jaundice", "Dark urine", "Pale stool", "Skin scaling", "Joint redness", "Cold intolerance",
    "Frequent urination", "Excessive thirst", "Chronic cough", "Swollen lymph nodes", "Pain behind eyes"
]

DISEASES = [
    "Common Cold", "Influenza", "COVID-19", "Diabetes", "Hypertension", 
    "Anemia", "Gastroenteritis", "Asthma", "Arthritis", "Depression", "Anxiety Disorder",
    "Migraine", "Pneumonia", "Urinary Tract Infection", "Hyperthyroidism",
    "Vitamin D Deficiency", "Lyme Disease", "Tuberculosis", "Dengue", "Malaria",
    "Typhoid", "Hepatitis", "Chronic Kidney Disease", "GERD", "Psoriasis",
    "Gout", "Hypothyroidism"
]

def generate_sample(disease):
    sample = {s: 0 for s in SYMPTOMS}
    
    # --- Expertised Features Initialization ---
    age = random.randint(5, 85)
    gender = random.choice(["Male", "Female"])
    
    # Baselines (Normal ranges)
    temp = round(random.uniform(36.1, 37.2), 1)
    systolic = random.randint(110, 125)
    diastolic = random.randint(70, 85)
    heart_rate = random.randint(60, 90)
    
    smoking = 1 if random.random() > 0.8 else 0
    alcohol = 1 if random.random() > 0.7 else 0
    exercise = random.choice([0, 1, 2, 3]) # 0=None, 3=Frequent
    obesity = 1 if random.random() > 0.8 else 0

    # --- Expertised Disease Correlations ---
    if disease == "Diabetes":
        age = random.randint(45, 85)
        obesity = 1 if random.random() > 0.4 else 0
        exercise = random.choice([0, 1])
        if random.random() > 0.3: sample["Weight gain"] = 1
    
    elif disease == "Hypertension":
        age = random.randint(50, 85)
        systolic = random.randint(140, 180)
        diastolic = random.randint(90, 110)
        heart_rate = random.randint(85, 110)
        obesity = 1 if random.random() > 0.5 else 0
        smoking = 1 if random.random() > 0.4 else 0
    
    elif disease == "COVID-19" or disease == "Pneumonia" or disease == "Influenza":
        temp = round(random.uniform(38.0, 40.5), 1)
        heart_rate = random.randint(95, 125)
        if disease == "COVID-19": age = random.randint(20, 85)
    
    elif disease == "Anemia":
        gender = "Female" if random.random() > 0.15 else "Male"
        heart_rate = random.randint(90, 115) # Compensatory tachycardia
        temp = round(random.uniform(35.8, 36.5), 1) # Often feel cold
    
    elif disease == "Hyperthyroidism":
        gender = "Female" if random.random() > 0.15 else "Male"
        heart_rate = random.randint(100, 140)
        temp = round(random.uniform(37.3, 37.8), 1) # Mildly elevated
    
    elif disease == "Urinary Tract Infection":
        gender = "Female" if random.random() > 0.1 else "Male"
        if random.random() > 0.4: temp = round(random.uniform(37.5, 38.5), 1)

    elif disease == "Asthma":
        heart_rate = random.randint(85, 110)
        if smoking: # Smoking worsens asthma probability/patterns
            heart_rate = random.randint(95, 120)

    elif disease == "Tuberculosis":
        temp = round(random.uniform(37.5, 39.0), 1)
        if random.random() > 0.4: sample["Weight loss"] = 1
    
    elif disease == "Dengue":
        temp = round(random.uniform(39.5, 41.0), 1)
        heart_rate = random.randint(100, 130)
    
    elif disease == "Malaria":
        temp = round(random.uniform(38.5, 40.5), 1)
        heart_rate = random.randint(100, 120)
    
    elif disease == "Typhoid":
        temp = round(random.uniform(39.0, 40.5), 1)
        heart_rate = random.randint(80, 100) # Relatively slow pulse for fever height
    
    elif disease == "Chronic Kidney Disease":
        systolic = random.randint(140, 170)
        diastolic = random.randint(90, 105)
    
    elif disease == "Hypothyroidism":
        temp = round(random.uniform(35.5, 36.4), 1)
        heart_rate = random.randint(50, 65)

    # Assign values
    sample['Age'] = age
    sample['Gender'] = gender
    sample['Temperature'] = temp
    sample['Systolic_BP'] = systolic
    sample['Diastolic_BP'] = diastolic
    sample['Heart_Rate'] = heart_rate
    sample['Smoking_History'] = smoking
    sample['Alcohol_Consumption'] = alcohol
    sample['Exercise_Frequency'] = exercise
    sample['Obesity_Status'] = obesity

    # Symptom patterns
    if disease == "Common Cold":
        for s in ["Cough", "Sneezing", "Runny nose", "Sore throat", "Nazal congestion"]:
            sample[s] = 1 if random.random() > 0.2 else 0
    elif disease == "Influenza":
        for s in ["Fever", "Fatigue", "Muscle aches", "Cough", "Chills", "Headache"]:
            sample[s] = 1 if random.random() > 0.2 else 0
    elif disease == "COVID-19":
        for s in ["Fever", "Cough", "Fatigue", "Shortness of breath", "Headache", "Loss of appetite"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Diabetes":
        for s in ["Fatigue", "Weight loss", "Blurred vision", "Slow wound healing", "Tingling"]:
            sample[s] = 1 if random.random() > 0.4 else 0
    elif disease == "Hypertension":
        for s in ["High blood pressure", "Headache", "Dizziness", "Palpitations"]:
            sample[s] = 1 if random.random() > 0.4 else 0
    elif disease == "Anemia":
        for s in ["Weakness", "Fatigue", "Dizziness", "Shortness of breath"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Gastroenteritis":
        for s in ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Loss of appetite"]:
            sample[s] = 1 if random.random() > 0.2 else 0
    elif disease == "Asthma":
        for s in ["Wheezing", "Shortness of breath", "Chest tightness", "Cough"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Arthritis":
        for s in ["Joint pain", "Stiffness", "Swelling in joints", "Limited mobility"]:
            sample[s] = 1 if random.random() > 0.2 else 0
    elif disease == "Depression":
        for s in ["Depression", "Fatigue", "Insomnia", "Loss of appetite", "Mood swings"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Anxiety Disorder":
        for s in ["Anxiety", "Palpitations", "Rapid heartbeat", "Difficulty in concentrating", "Irritability", "Insomnia"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Migraine":
        for s in ["Headache", "Nausea", "Blurred vision", "Dizziness", "Irritability"]:
            sample[s] = 1 if random.random() > 0.2 else 0
            if s == "Headache": sample[s] = 1
    elif disease == "Pneumonia":
        for s in ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue", "Chills"]:
            sample[s] = 1 if random.random() > 0.2 else 0
    elif disease == "Urinary Tract Infection":
        for s in ["Abdominal pain", "Fever", "Weakness", "Nausea"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Hyperthyroidism":
        for s in ["Weight loss", "Rapid heartbeat", "Anxiety", "Irritability", "Insomnia", "Muscle aches"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Vitamin D Deficiency":
        for s in ["Fatigue", "Weakness", "Muscle aches", "Joint pain", "Depression", "Irritability"]:
            sample[s] = 1 if random.random() > 0.3 else 0
    elif disease == "Lyme Disease":
        for s in ["Fever", "Fatigue", "Joint pain", "Headache", "Muscle aches", "Chills"]:
            sample[s] = 1 if random.random() > 0.3 else 0
            if random.random() > 0.5: sample["Confusion"] = 1 # Brain fog
            
    elif disease == "Tuberculosis":
        for s in ["Chronic cough", "Weight loss", "night sweats", "Fatigue", "Fever", "Chest pain"]:
            sample[s] = 1 if random.random() > 0.2 else 0
        if random.random() > 0.6: sample["Cough"] = 1

    elif disease == "Dengue":
        for s in ["Fever", "Rash", "Joint pain", "Muscle aches", "Headache", "Nausea"]:
            sample[s] = 1 if random.random() > 0.2 else 0
        if random.random() > 0.5: sample["Pain behind eyes"] = 1 # Needs addition to symptoms if used, but I'll stick to current

    elif disease == "Malaria":
        for s in ["Fever", "Chills", "Headache", "Vomiting", "Jaundice", "Muscle aches"]:
            sample[s] = 1 if random.random() > 0.2 else 0
        if random.random() > 0.5: sample["night sweats"] = 1

    elif disease == "Typhoid":
        for s in ["Fever", "Headache", "Abdominal pain", "Weakness", "Loss of appetite", "Rash"]:
            sample[s] = 1 if random.random() > 0.2 else 0
        if random.random() > 0.4: sample["Confusion"] = 1

    elif disease == "Hepatitis":
        for s in ["Jaundice", "Dark urine", "Pale stool", "Nausea", "Fatigue", "Abdominal pain"]:
            sample[s] = 1 if random.random() > 0.2 else 0

    elif disease == "Chronic Kidney Disease":
        for s in ["Swelling in legs", "Fatigue", "Shortness of breath", "Itching", "Confusion", "Nausea"]:
            sample[s] = 1 if random.random() > 0.3 else 0

    elif disease == "GERD":
        for s in ["Heartburn", "Bloating", "Nausea", "Chest pain", "Sore throat"]:
            sample[s] = 1 if random.random() > 0.2 else 0
            if s == "Heartburn": sample[s] = 1

    elif disease == "Psoriasis":
        for s in ["Skin scaling", "Itching", "Dry skin", "Joint pain"]:
            sample[s] = 1 if random.random() > 0.2 else 0
            if s == "Skin scaling": sample[s] = 1

    elif disease == "Gout":
        for s in ["Joint redness", "Swelling in joints", "Stiffness", "Joint pain"]:
            sample[s] = 1 if random.random() > 0.2 else 0
            if s == "Joint redness": sample[s] = 1

    elif disease == "Hypothyroidism":
        for s in ["Weight gain", "Fatigue", "Cold intolerance", "Depression", "Memory problems", "Muscle aches"]:
            sample[s] = 1 if random.random() > 0.2 else 0
            
    # Add noise
    for _ in range(3):
        s = random.choice(SYMPTOMS)
        if random.random() > 0.85:
            sample[s] = 1
            
    return sample

def main():
    data = []
    samples_per_disease = 1500 # Increased for better complexity
    for _ in range(samples_per_disease):
        for disease in DISEASES:
            sample = generate_sample(disease)
            sample['Disease'] = disease
            data.append(sample)
            
    df = pd.DataFrame(data)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    df.to_csv('disease_data.csv', index=False)
    print(f"Generated {len(df)} samples with demographics in disease_data.csv")

if __name__ == "__main__":
    main()
