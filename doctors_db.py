DOCTORS = [
    {
        "name": "Dr. Sarah Johnson",
        "specialty": "General Physician",
        "diseases": ["Common Cold", "Influenza", "COVID-19", "Anemia", "Gastroenteritis", "Pneumonia", "Typhoid", "Malaria"],
        "location": "Central Care Hospital, New York",
        "contact": "+1-555-0101",
        "rating": 4.8
    },
    {
        "name": "Dr. Michael Chen",
        "specialty": "Endocrinologist",
        "diseases": ["Diabetes", "Hyperthyroidism", "Hypothyroidism"],
        "location": "Wellness Endocrine Center, Brooklyn",
        "contact": "+1-555-0102",
        "rating": 4.9
    },
    {
        "name": "Dr. Emily Rodriguez",
        "specialty": "Cardiologist",
        "diseases": ["Hypertension"],
        "location": "Heart & Vascular Institute, Manhattan",
        "contact": "+1-555-0103",
        "rating": 4.7
    },
    {
        "name": "Dr. James Wilson",
        "specialty": "Pulmonologist",
        "diseases": ["Asthma", "COVID-19", "Pneumonia", "Tuberculosis"],
        "location": "Lungs & Breath Center, Queens",
        "contact": "+1-555-0104",
        "rating": 4.6
    },
    {
        "name": "Dr. Lisa Wang",
        "specialty": "Rheumatologist",
        "diseases": ["Arthritis", "Gout"],
        "location": "Joint Health Clinic, Bronx",
        "contact": "+1-555-0105",
        "rating": 4.8
    },
    {
        "name": "Dr. Robert Taylor",
        "specialty": "Psychiatrist",
        "diseases": ["Depression", "Anxiety Disorder"],
        "location": "Mind Matters Institute, Manhattan",
        "contact": "+1-555-0106",
        "rating": 4.9
    },
    {
        "name": "Dr. Anita Desai",
        "specialty": "Neurologist",
        "diseases": ["Migraine"],
        "location": "NeuroScience Hub, Jersey City",
        "contact": "+1-555-0107",
        "rating": 4.7
    },
    {
        "name": "Dr. Kevin Miller",
        "specialty": "Urologist",
        "diseases": ["Urinary Tract Infection"],
        "location": "Urology Specialists, Staten Island",
        "contact": "+1-555-0108",
        "rating": 4.5
    },
    {
        "name": "Dr. David Brooks",
        "specialty": "Infectious Disease Specialist",
        "diseases": ["Tuberculosis", "Dengue", "Malaria", "Typhoid", "Hepatitis"],
        "location": "City Infection Control, Queens",
        "contact": "+1-555-0109",
        "rating": 4.9
    },
    {
        "name": "Dr. Sophia Martinez",
        "specialty": "Hepatologist",
        "diseases": ["Hepatitis"],
        "location": "Liver & Digest Clinic, Brooklyn",
        "contact": "+1-555-0110",
        "rating": 4.7
    },
    {
        "name": "Dr. Richard Black",
        "specialty": "Nephrologist",
        "diseases": ["Chronic Kidney Disease"],
        "location": "Renal Care Center, Manhattan",
        "contact": "+1-555-0111",
        "rating": 4.8
    },
    {
        "name": "Dr. Elena Gilbert",
        "specialty": "Gastroenterologist",
        "diseases": ["GERD", "Gastroenteritis"],
        "location": "GI Health Institute, Staten Island",
        "contact": "+1-555-0112",
        "rating": 4.6
    },
    {
        "name": "Dr. Marcus Thorne",
        "specialty": "Dermatologist",
        "diseases": ["Psoriasis"],
        "location": "Skin & Aesthetic Hub, Manhattan",
        "contact": "+1-555-0113",
        "rating": 4.8
    }
]

DISEASE_KNOWLEDGE = {
    "Common Cold": {
        "description": "A viral infection of your nose and throat (upper respiratory tract). It's usually harmless.",
        "actions": ["Rest adequately", "Stay hydrated", "Use saline nasal drops"],
        "precautions": ["Wash hands frequently", "Avoid close contact with others"],
        "urgency": "Low"
    },
    "Influenza": {
        "description": "A viral infection that attacks your respiratory system — your nose, throat and lungs.",
        "actions": ["Rest", "Drink plenty of fluids", "Antiviral drugs if prescribed"],
        "precautions": ["Annual flu vaccine", "Cover coughs and sneezes"],
        "urgency": "Medium"
    },
    "COVID-19": {
        "description": "An infectious disease caused by the SARS-CoV-2 virus.",
        "actions": ["Isolate yourself", "Monitor oxygen levels", "Stay hydrated"],
        "precautions": ["Wear a mask", "Social distancing", "Vaccination"],
        "urgency": "High"
    },
    "Diabetes": {
        "description": "A group of diseases that result in too much sugar in the blood (high blood glucose).",
        "actions": ["Monitor blood sugar levels", "Maintain a healthy diet", "Regular exercise"],
        "precautions": ["Limit sugary foods", "Weight management", "Regular check-ups"],
        "urgency": "Medium"
    },
    "Hypertension": {
        "description": "A condition in which the force of the blood against the artery walls is too high.",
        "actions": ["Reduce salt intake", "Exercise regularly", "Monitor BP at home"],
        "precautions": ["Reduce stress", "Limit alcohol", "Heart-healthy diet"],
        "urgency": "Medium"
    },
    "Anemia": {
        "description": "A condition in which you lack enough healthy red blood cells to carry adequate oxygen to your tissues.",
        "actions": ["Iron-rich diet (spinach, red meat)", "Vitamin C intake", "Iron supplements if recommended"],
        "precautions": ["Regular blood tests", "Consult a doctor for underlying causes"],
        "urgency": "Medium"
    },
    "Gastroenteritis": {
        "description": "An intestinal infection marked by diarrhea, cramps, nausea, vomiting and fever.",
        "actions": ["Stay hydrated (ORS)", "Bland diet (BRAT)", "Rest"],
        "precautions": ["Wash hands after using the bathroom", "Avoid contaminated food/water"],
        "urgency": "Medium"
    },
    "Asthma": {
        "description": "A condition in which your airways narrow and swell and may produce extra mucus.",
        "actions": ["Identify and avoid triggers", "Use inhaler as prescribed", "Breathing exercises"],
        "precautions": ["Carry rescue inhaler always", "Regular pulmonary check-ups"],
        "urgency": "High (during attacks)"
    },
    "Arthritis": {
        "description": "The swelling and tenderness of one or more of your joints.",
        "actions": ["Low-impact exercise", "Hot/cold therapy", "Weight management"],
        "precautions": ["Protect your joints", "Avoid repetitive strain"],
        "urgency": "Low"
    },
    "Depression": {
        "description": "A mood disorder that causes a persistent feeling of sadness and loss of interest.",
        "actions": ["Reach out to friends/family", "Stick to a routine", "Professional counseling"],
        "precautions": ["Avoid alcohol", "Prioritize sleep", "Exercise"],
        "urgency": "Medium to High"
    },
    "Anxiety Disorder": {
        "description": "A mental health disorder characterized by feelings of worry, anxiety or fear that are strong enough to interfere with one's daily activities.",
        "actions": ["Deep breathing techniques", "Mindfulness/Meditation", "Limit caffeine"],
        "precautions": ["Adequate sleep", "Exercise", "Avoid known stressors"],
        "urgency": "Medium"
    },
    "Migraine": {
        "description": "A headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head.",
        "actions": ["Rest in a dark, quiet room", "Apply cold compress", "Identify food triggers"],
        "precautions": ["Regular sleep schedule", "Stay hydrated", "Stress management"],
        "urgency": "Medium"
    },
    "Pneumonia": {
        "description": "An infection that inflames the air sacs in one or both lungs.",
        "actions": ["Take prescribed antibiotics/antivirals", "Control fever", "Rest"],
        "precautions": ["Pneumococcal vaccine", "Avoid smoking", "Hand hygiene"],
        "urgency": "High"
    },
    "Urinary Tract Infection": {
        "description": "An infection in any part of your urinary system — your kidneys, ureters, bladder and urethra.",
        "actions": ["Drink plenty of water", "Cranberry juice (unsweetened)", "Complete antibiotic course"],
        "precautions": ["Wipe front to back", "Urinate after intercourse"],
        "urgency": "Medium"
    },
    "Hyperthyroidism": {
        "description": "A condition in which the thyroid gland is overactive and makes too much thyroid hormone.",
        "actions": ["Follow medication plan", "Monitor weight", "Reduce iodine intake if advised"],
        "precautions": ["Regular thyroid level tests", "Manage stress"],
        "urgency": "Medium"
    },
    "Vitamin D Deficiency": {
        "description": "A common condition where the body has insufficient levels of Vitamin D.",
        "actions": ["Safe sun exposure", "Vitamin D rich foods (fatty fish, eggs)", "Supplements"],
        "precautions": ["Check Vitamin D levels annually"],
        "urgency": "Low"
    },
    "Lyme Disease": {
        "description": "A tick-borne illness caused by the bacterium Borrelia burgdorferi.",
        "actions": ["Antibiotic treatment", "Rest", "Monitor for rash"],
        "precautions": ["Use tick repellent", "Wear long sleeves in wooded areas"],
        "urgency": "Medium"
    },
    "Tuberculosis": {
        "description": "A potentially serious infectious disease that mainly affects your lungs.",
        "actions": ["Complete the full course of therapy", "Isolate during initial phase", "Cough etiquette"],
        "precautions": ["BCG vaccination", "Avoid crowded places if infected", "Proper ventilation"],
        "urgency": "High"
    },
    "Dengue": {
        "description": "A mosquito-borne viral disease that causes sudden high fever and severe joint pain.",
        "actions": ["Hydration (Plenty of fluids)", "Rest", "Acetaminophen for pain (avoid Aspirin/Ibuprofen)"],
        "precautions": ["Use mosquito nets/repellents", "Eliminate stagnant water", "Wear protective clothing"],
        "urgency": "High"
    },
    "Malaria": {
        "description": "A serious and sometimes fatal disease caused by a parasite that commonly infects a certain type of mosquito.",
        "actions": ["Anti-malarial medication", "Monitor for complications", "Rest"],
        "precautions": ["Mosquito control", "Prophylactic medication if traveling"],
        "urgency": "High"
    },
    "Typhoid": {
        "description": "A bacterial infection caused by Salmonella typhi, usually through contaminated food or water.",
        "actions": ["Antibiotic course", "Oral rehydration therapy", "Light, easy-to-digest food"],
        "precautions": ["Drink boiled/bottled water", "Hand hygiene", "Typhoid vaccine"],
        "urgency": "High"
    },
    "Hepatitis": {
        "description": "Inflammation of the liver, often caused by a viral infection.",
        "actions": ["Rest", "Avoid alcohol/liver-toxic drugs", "Follow specific therapy for Type (A, B, C)"],
        "precautions": ["Hepatitis vaccines (A & B)", "Safe food and water", "Sanitary practices"],
        "urgency": "High"
    },
    "Chronic Kidney Disease": {
        "description": "Long-term condition where the kidneys don't work as well as they should.",
        "actions": ["Control blood pressure and sugar", "Reduced salt and protein diet", "Regular screenings"],
        "precautions": ["Avoid NSAIDs (like Ibuprofen)", "Weight management", "Limit alcohol"],
        "urgency": "High/Ongoing"
    },
    "GERD": {
        "description": "Gastroesophageal reflux disease occurs when stomach acid frequently flows back into the tube connecting your mouth and stomach (esophagus).",
        "actions": ["Eat smaller meals", "Avoid lying down after meals", "Identify trigger foods (spicy, acidic)"],
        "precautions": ["Raise head of bed", "Weight loss", "Stop smoking"],
        "urgency": "Low to Medium"
    },
    "Psoriasis": {
        "description": "A skin disease that causes red, itchy scaly patches, most commonly on the knees, elbows, trunk and scalp.",
        "actions": ["Apply prescribed topical creams", "Moisturize regularly", "Brief sun exposure"],
        "precautions": ["Avoid skin injuries", "Manage stress", "Avoid triggers like alcohol"],
        "urgency": "Low"
    },
    "Gout": {
        "description": "A common and complex form of arthritis that can affect anyone, characterized by sudden, severe attacks of pain, swelling, redness and tenderness in one or more joints.",
        "actions": ["Apply ice to the joint", "Drink plenty of water", "Rest and elevate the joint"],
        "precautions": ["Low-purine diet (avoid red meat, seafood)", "Limit alcohol", "Weight management"],
        "urgency": "Medium"
    },
    "Hypothyroidism": {
        "description": "A condition in which your thyroid gland doesn't produce enough of certain crucial hormones.",
        "actions": ["Take daily thyroid hormone replacement", "Optimal iodine intake", "Regular blood tests"],
        "precautions": ["Monitor for dose adjustments", "Healthy diet"],
        "urgency": "Medium"
    }
}

def get_suggestions(disease):
    suggestions = [doc for doc in DOCTORS if disease in doc["diseases"]]
    return sorted(suggestions, key=lambda x: x["rating"], reverse=True)

def get_disease_info(disease):
    return DISEASE_KNOWLEDGE.get(disease, {
        "description": "Information not available.",
        "actions": ["Consult a doctor"],
        "precautions": ["General health maintenance"],
        "urgency": "Unknown"
    })
