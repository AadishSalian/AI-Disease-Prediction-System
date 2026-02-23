// --- Database Service (IndexedDB Wrapper) ---
const DB_NAME = 'MediPredictDB';
const STORE_NAME = 'user_profile';

const dbService = {
    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (db.objectStoreNames.contains(STORE_NAME)) {
                    db.deleteObjectStore(STORE_NAME);
                }
                db.createObjectStore(STORE_NAME, { keyPath: 'email' });
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    },

    async getUser(email) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(email);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getProfile() {
        // Get the current logged-in user email from localStorage
        const email = localStorage.getItem('currentUserEmail');
        if (!email) return null;

        const db = await this.open();
        return new Promise((resolve) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(email);
            request.onsuccess = () => resolve(request.result);
        });
    },

    async saveProfile(profile) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(profile);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};

const authService = {
    setCurrentUser(email) {
        localStorage.setItem('currentUserEmail', email);
    },
    getCurrentUserEmail() {
        return localStorage.getItem('currentUserEmail');
    },
    logout() {
        localStorage.removeItem('currentUserEmail');
    }
};

// --- Modal Functions (Global Scope) ---
const modal = document.getElementById("editProfileModal");

function openModal() {
    if (modal) {
        modal.style.display = "flex";
        loadProfileIntoForm();
    }
}

function closeModal() {
    if (modal) modal.style.display = "none";
}

// --- BMI Calculation ---
function calculateBMI(height, weight) {
    if (!height || !weight) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

// --- UI Updates ---
async function loadProfileIntoForm() {
    const profile = await dbService.getProfile();
    if (!profile) return;
    document.getElementById('input-name').value = profile.name;
    document.getElementById('input-email').value = profile.email;
    document.getElementById('input-age').value = profile.age || 24;
    document.getElementById('input-gender').value = profile.gender || 'Male';
    document.getElementById('input-height').value = profile.height || 175;
    document.getElementById('input-weight').value = profile.weight || 70;
}

async function updateProfileUI() {
    const profile = await dbService.getProfile();
    if (!profile) {
        // If on profile page and not logged in, redirect to login
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
        return;
    }

    // Update Profile Card
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    if (nameEl) nameEl.textContent = profile.name;
    if (emailEl) emailEl.textContent = profile.email;

    // Update Stats
    const ageEl = document.getElementById('display-age');
    const genderEl = document.getElementById('display-gender');
    const heightEl = document.getElementById('display-height');
    const weightEl = document.getElementById('display-weight');
    const bmiEl = document.getElementById('display-bmi');
    const bmiCatEl = document.getElementById('bmi-category');
    const bmiProgress = document.getElementById('bmi-progress');

    if (ageEl) ageEl.textContent = profile.age || 24;
    if (genderEl) genderEl.textContent = profile.gender || 'Male';
    if (heightEl) heightEl.textContent = (profile.height || 175) + ' cm';
    if (weightEl) weightEl.textContent = (profile.weight || 70) + ' kg';

    const bmi = calculateBMI(profile.height || 175, profile.weight || 70);
    if (bmiEl) bmiEl.textContent = bmi;

    const category = getBMICategory(bmi);
    if (bmiCatEl) {
        bmiCatEl.textContent = category;
        bmiCatEl.className = 'bmi-tag ' + category.toLowerCase();
    }

    if (bmiProgress) {
        let percent = ((bmi - 15) / (35 - 15)) * 100;
        percent = Math.max(0, Math.min(100, percent));
        bmiProgress.style.width = percent + '%';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initial UI Update
    await updateProfileUI();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // --- Symptom Tracking & Persistence ---
    function saveSelectedSymptoms() {
        const checkedSymptoms = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => {
                const label = cb.closest('label');
                return label ? (label.getAttribute('data-original-text') || label.innerText.trim()) : null;
            })
            .filter(text => text !== null);

        let savedSymptoms = JSON.parse(localStorage.getItem('selectedSymptoms') || '[]');
        const combined = Array.from(new Set([...savedSymptoms, ...checkedSymptoms]));
        localStorage.setItem('selectedSymptoms', JSON.stringify(combined));
    }

    function saveVitalSigns() {
        const vitals = {
            temperature: document.getElementById('temperature')?.value || null,
            systolic: document.getElementById('systolic')?.value || null,
            diastolic: document.getElementById('diastolic')?.value || null,
            heartRate: document.getElementById('heart-rate')?.value || null
        };
        localStorage.setItem('userVitals', JSON.stringify(vitals));
    }

    function saveHistory() {
        const history = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.parentElement.innerText.trim());
        localStorage.setItem('userHistory', JSON.stringify(history));
    }

    const nextBtn = document.querySelector('.next');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (nextBtn) {
        if (checkboxes.length > 0) {
            nextBtn.disabled = true;
            const checkSelection = () => {
                const isAnyChecked = Array.from(checkboxes).some(cb => cb.checked);
                nextBtn.disabled = !isAnyChecked;
            };
            checkboxes.forEach(cb => cb.addEventListener('change', checkSelection));
        } else {
            nextBtn.disabled = false;
        }

        nextBtn.addEventListener('click', async () => {
            if (nextBtn.disabled && !window.location.pathname.includes('vital.html')) return;

            const currentPath = window.location.pathname;

            if (currentPath.includes('symptoms.html')) {
                saveSelectedSymptoms();
                window.location.href = 'history.html';
            } else if (currentPath.includes('history.html')) {
                saveHistory();
                window.location.href = 'vital.html';
            } else if (currentPath.includes('vital.html')) {
                saveVitalSigns();
                window.location.href = 'results.html';
            }
        });
    }

    // --- Prediction Engine (JS implementation of trained categories) ---
    const DISEASE_RULES = [
        {
            name: "Common Cold",
            symptoms: ["Cough", "Sneezing", "Runny nose", "Sore throat", "Nazal congestion"],
            weight: 0.8,
            urgency: "Low",
            explanation: "The common cold is a viral infection of your nose and throat. It's usually harmless, though it might not feel that way.",
            recommendations: ["Rest and stay hydrated", "Use over-the-counter saline nasal drops", "Gargle with salt water for sore throat"]
        },
        {
            name: "Influenza",
            symptoms: ["Fever", "Fatigue", "Muscle aches", "Cough", "Chills", "Headache"],
            weight: 0.9,
            urgency: "Moderate",
            explanation: "Influenza (flu) is a viral infection that attacks your respiratory system. While it can resolve on its own, complications can be serious.",
            recommendations: ["Stay home and rest", "Monitor temperature regularly", "Consult a doctor if symptoms worsen rapidly"]
        },
        {
            name: "COVID-19",
            symptoms: ["Fever", "Cough", "Fatigue", "Shortness of breath", "Headache", "Loss of appetite"],
            weight: 1.0,
            urgency: "Moderate",
            explanation: "COVID-19 is a respiratory illness caused by a coronavirus. Symptoms can range from mild to severe respiratory distress.",
            recommendations: ["Self-isolate immediately", "Perform a rapid antigen or PCR test", "Monitor oxygen levels if possible"]
        },
        {
            name: "Diabetes",
            symptoms: ["Fatigue", "Weight loss", "Blurred vision", "Slow wound healing", "Tingling"],
            weight: 0.7,
            urgency: "Moderate",
            explanation: "Diabetes relates to how your body uses blood sugar. Chronic high sugar levels can damage various organs over time.",
            recommendations: ["Schedule a fasting blood sugar test", "Monitor carbohydrate intake", "Check for any slow-healing wounds daily"]
        },
        {
            name: "Hypertension",
            symptoms: ["High blood pressure", "Headache", "Dizziness", "Palpitations"],
            weight: 0.7,
            urgency: "Moderate",
            explanation: "Hypertension (high blood pressure) often has no symptoms but can lead to serious health problems like heart attack or stroke.",
            recommendations: ["Reduce salt intake", "Monitor blood pressure daily", "Engage in moderate physical activity"]
        },
        {
            name: "Anemia",
            symptoms: ["Weakness", "Fatigue", "Dizziness", "Shortness of breath"],
            weight: 0.6,
            urgency: "Low",
            explanation: "Anemia occurs when your blood lacks enough healthy red blood cells or hemoglobin, leading to reduced oxygen flow.",
            recommendations: ["Increase iron-rich foods (spinach, beans)", "Consult for a Complete Blood Count (CBC) test", "Ensure adequate Vitamin C intake to help iron absorption"]
        },
        {
            name: "Gastroenteritis",
            symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Loss of appetite"],
            weight: 0.9,
            urgency: "Moderate",
            explanation: "Commonly known as stomach flu, it's an inflammation of the lining of the intestines caused by a virus, bacteria, or parasites.",
            recommendations: ["Sip small amounts of clear liquids to stay hydrated", "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast)", "Avoid dairy and fatty foods until recovered"]
        },
        {
            name: "Asthma",
            symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Cough"],
            weight: 0.8,
            urgency: "Moderate",
            explanation: "Asthma is a condition in which your airways narrow and swell and may produce extra mucus, making breathing difficult.",
            recommendations: ["Keep a rescue inhaler nearby", "Identify and avoid triggers (dust, pollen)", "Consult an allergist or pulmonologist"]
        },
        {
            name: "Arthritis",
            symptoms: ["Joint pain", "Stiffness", "Swelling in joints", "Limited mobility"],
            weight: 0.8,
            urgency: "Low",
            explanation: "Arthritis is the swelling and tenderness of one or more joints. The main symptoms are joint pain and stiffness.",
            recommendations: ["Apply warm or cold compresses to joints", "Engage in low-impact exercises (swimming)", "Consult a rheumatologist for definitive diagnosis"]
        },
        {
            name: "Depression",
            symptoms: ["Depression", "Fatigue", "Insomnia", "Loss of appetite", "Mood swings"],
            weight: 0.7,
            urgency: "Moderate",
            explanation: "Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest, affecting how you feel and think.",
            recommendations: ["Reach out to a trusted friend or family member", "Avoid alcohol and recreational drugs", "Consult a mental health professional"]
        },
        {
            name: "Anxiety Disorder",
            symptoms: ["Anxiety", "Palpitations", "Rapid heartbeat", "Difficulty in concentrating", "Irritability", "Insomnia"],
            weight: 0.7,
            urgency: "Low",
            explanation: "Anxiety disorders involve intense, excessive, and persistent worry and fear about everyday situations.",
            recommendations: ["Practice deep breathing or meditation", "Limit caffeine intake", "Establish a consistent sleep routine"]
        },
        {
            name: "Migraine",
            symptoms: ["Headache", "Nausea", "Blurred vision", "Dizziness", "Irritability"],
            weight: 0.85,
            urgency: "Moderate",
            explanation: "A migraine is a headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head.",
            recommendations: ["Rest in a dark, quiet room", "Identify dietary or environmental triggers", "Consult a neurologist for preventive options"]
        },
        {
            name: "Pneumonia",
            symptoms: ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue", "Chills"],
            weight: 0.95,
            urgency: "High",
            explanation: "Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus.",
            recommendations: ["Seek medical attention immediately", "Chest X-ray may be required", "Complete the full course of prescribed antibiotics"]
        },
        {
            name: "Urinary Tract Infection",
            symptoms: ["Abdominal pain", "Fever", "Weakness", "Nausea"],
            weight: 0.75,
            urgency: "Moderate",
            explanation: "A UTI is an infection in any part of your urinary system. Most infections involve the lower urinary tract.",
            recommendations: ["Drink plenty of water", "Consult for a urinalysis test", "Avoid irritating beverages like coffee or alcohol"]
        },
        {
            name: "Hyperthyroidism",
            symptoms: ["Weight loss", "Rapid heartbeat", "Anxiety", "Irritability", "Insomnia", "Muscle aches"],
            weight: 0.8,
            urgency: "Moderate",
            explanation: "Hyperthyroidism occurs when your thyroid gland produces too much of the hormone thyroxine, accelerating your metabolism.",
            recommendations: ["Consult an endocrinologist", "Thyroid function blood tests (TSH, T4) are needed", "Monitor heart rate and weight regularly"]
        },
        {
            name: "Vitamin D Deficiency",
            symptoms: ["Fatigue", "Weakness", "Muscle aches", "Joint pain", "Depression", "Irritability"],
            weight: 0.85,
            urgency: "Low",
            explanation: "Low levels of Vitamin D are frequently associated with both musculoskeletal pain (joint pain) and mood disturbances, including irritability.",
            recommendations: ["Request a 25-hydroxy vitamin D blood test", "Increase safe sun exposure", "Incorporate Vitamin D-rich foods like fatty fish and fortified dairy"]
        },
        {
            name: "Lyme Disease",
            symptoms: ["Fever", "Fatigue", "Joint pain", "Headache", "Muscle aches", "Chills", "Confusion"],
            weight: 0.9,
            urgency: "Moderate",
            explanation: "Early or late-stage Lyme disease can present with migratory joint pain and neurological symptoms such as irritability or 'brain fog'.",
            recommendations: ["Check for history of tick bites or rashes", "Discuss ELISA or Western Blot testing with a doctor", "Monitor for fever or fatigue"]
        }
    ];

    const DOCTOR_DATA = {
        "Common Cold": [{ name: "Dr. Sarah Johnson", specialty: "General Physician", location: "Central Care Hospital", contact: "+1-555-0101", rating: 4.8 }],
        "Influenza": [{ name: "Dr. Sarah Johnson", specialty: "General Physician", location: "Central Care Hospital", contact: "+1-555-0101", rating: 4.8 }],
        "COVID-19": [{ name: "Dr. James Wilson", specialty: "Pulmonologist", location: "Lungs & Breath Center", contact: "+1-555-0104", rating: 4.6 }],
        "Diabetes": [{ name: "Dr. Michael Chen", specialty: "Endocrinologist", location: "Wellness Endocrine Center", contact: "+1-555-0102", rating: 4.9 }],
        "Hypertension": [{ name: "Dr. Emily Rodriguez", specialty: "Cardiologist", location: "Heart & Vascular Institute", contact: "+1-555-0103", rating: 4.7 }],
        "Asthma": [{ name: "Dr. James Wilson", specialty: "Pulmonologist", location: "Lungs & Breath Center", contact: "+1-555-0104", rating: 4.6 }],
        "Arthritis": [{ name: "Dr. Lisa Wang", specialty: "Rheumatologist", location: "Joint Health Clinic", contact: "+1-555-0105", rating: 4.8 }],
        "Depression": [{ name: "Dr. Robert Taylor", specialty: "Psychiatrist", location: "Mind Matters Institute", contact: "+1-555-0106", rating: 4.9 }],
        "Anxiety Disorder": [{ name: "Dr. Robert Taylor", specialty: "Psychiatrist", location: "Mind Matters Institute", contact: "+1-555-0106", rating: 4.9 }],
        "Migraine": [{ name: "Dr. Anita Desai", specialty: "Neurologist", location: "NeuroScience Hub", contact: "+1-555-0107", rating: 4.7 }],
        "Pneumonia": [{ name: "Dr. Sarah Johnson", specialty: "General Physician", location: "Central Care Hospital", contact: "+1-555-0101", rating: 4.8 }, { name: "Dr. James Wilson", specialty: "Pulmonologist", location: "Lungs & Breath Center", contact: "+1-555-0104", rating: 4.6 }],
        "Urinary Tract Infection": [{ name: "Dr. Kevin Miller", specialty: "Urologist", location: "Urology Specialists", contact: "+1-555-0108", rating: 4.5 }],
        "Hyperthyroidism": [{ name: "Dr. Michael Chen", specialty: "Endocrinologist", location: "Wellness Endocrine Center", contact: "+1-555-0102", rating: 4.9 }]
    };

    window.generatePDFReport = async function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const profile = await dbService.getProfile();
        const symptoms = JSON.parse(localStorage.getItem('lastCheckedSymptoms') || '[]');
        const results = JSON.parse(localStorage.getItem('lastPredictionResults') || '[]');

        if (!results || results.length === 0) {
            alert("No diagnosis results found. Please run an assessment first.");
            return;
        }

        const topResult = results[0];

        // Header - Medical Aesthetic
        doc.setFillColor(20, 184, 166); // Teal primary
        doc.rect(0, 0, 210, 45, 'F');

        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.text("HealthPredict AI", 20, 28);

        doc.setFontSize(12);
        doc.text("Personal Health Assessment & Prediction Report", 20, 38);

        // Date & ID
        doc.setFontSize(10);
        doc.text(`Report ID: HP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 150, 20);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 26);

        // 1. Patient Profile
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.text("Patient Information", 20, 60);

        const patientData = [
            ["Patient Name", profile.name || "N/A"],
            ["Age / Gender", `${profile.age || "25"} / ${profile.gender || "Male"}`],
            ["BMI Index", `${calculateBMI(profile.height, profile.weight)} (${getBMICategory(calculateBMI(profile.height, profile.weight))})`],
            ["Reported Symptoms", symptoms.join(", ")]
        ];

        doc.autoTable({
            startY: 65,
            body: patientData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', textColor: [20, 184, 166], width: 45 } }
        });

        // 2. Primary Diagnosis Details
        doc.setFontSize(16);
        doc.text("Detailed Analysis", 20, doc.lastAutoTable.finalY + 15);

        doc.setFillColor(248, 250, 252);
        doc.rect(20, doc.lastAutoTable.finalY + 20, 170, 50, 'F');

        doc.setFontSize(14);
        doc.setTextColor(13, 148, 136);
        doc.text(topResult.name, 25, doc.lastAutoTable.finalY + 30);

        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        doc.text(`AI Confidence: ${topResult.confidence}%`, 25, doc.lastAutoTable.finalY + 38);
        doc.text(`Urgency Level: ${topResult.urgency}`, 140, doc.lastAutoTable.finalY + 38);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        const explanation = doc.splitTextToSize(topResult.explanation, 160);
        doc.text(explanation, 25, doc.lastAutoTable.finalY + 48);

        // 3. Clinical Recommendations
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("Assessment Recommendations", 20, doc.lastAutoTable.finalY + 80);

        const recs = (topResult.recommendations || []).map(r => ["• " + r]);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 85,
            body: recs,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { left: 25 }
        });

        // 4. Secondary Matches
        if (results.length > 1) {
            doc.setFontSize(14);
            doc.text("Secondary Differential Matches", 20, doc.lastAutoTable.finalY + 15);

            const tableData = results.slice(1).map(r => [r.name, `${r.confidence}%`, r.urgency]);
            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 20,
                head: [["Condition", "Match Confidence", "Urgency"]],
                body: tableData,
                headStyles: { fillColor: [20, 184, 166] },
                styles: { fontSize: 10 }
            });
        }

        // Disclaimer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        const disclaimer = "LEGAL DISCLAIMER: This document is an AI-generated assessment for educational purposes and is NOT a medical diagnosis. Please present this report to a licensed physician for clinical verification and next steps.";
        doc.text(disclaimer, 20, 275, { maxWidth: 170 });

        doc.save(`HealthPredict_Report_${profile.name || 'Assessment'}.pdf`);
    };

    window.displayResults = async function () {
        const symptoms = JSON.parse(localStorage.getItem('selectedSymptoms') || '[]');
        const profile = await dbService.getProfile();

        if (symptoms.length === 0) {
            const listEl = document.getElementById('diagnosis-list');
            if (listEl) listEl.innerHTML = '<p class="text-center p-8 text-muted">No symptoms reported. Please try again.</p>';
            return;
        }

        // --- Core Prediction Engine (Enhanced Confidence Logic) ---
        let scores = DISEASE_RULES.map(disease => {
            const matches = disease.symptoms.filter(s =>
                symptoms.some(userS => userS.toLowerCase().includes(s.toLowerCase()))
            );

            // Initial Match Score
            let score = matches.length === 0 ? 0 : (matches.length / disease.symptoms.length) * disease.weight;

            // --- Expertised Prediction Logic (Vitals & Demographics) ---
            if (profile) {
                const age = parseInt(profile.age) || 25;
                const gender = (profile.gender || 'Male').toLowerCase();
                const vitals = JSON.parse(localStorage.getItem('userVitals') || '{}');
                const history = JSON.parse(localStorage.getItem('userHistory') || '[]');

                // Vital Signs weighting
                if (vitals.temperature > 38) {
                    if (["COVID-19", "Influenza", "Pneumonia"].includes(disease.name)) score *= 1.5;
                }
                if (vitals.systolic > 140 || vitals.diastolic > 90) {
                    if (disease.name === "Hypertension") score *= 2.0;
                }
                if (vitals.heartRate > 100) {
                    if (["Hyperthyroidism", "Influenza", "Anemia", "Anxiety Disorder"].includes(disease.name)) score *= 1.3;
                }

                // Lifestyle & History weighting
                if (history.includes("Obesity")) {
                    if (["Diabetes", "Hypertension"].includes(disease.name)) score *= 1.4;
                }
                if (history.includes("Current smoker")) {
                    if (["Asthma", "Pneumonia", "Hypertension"].includes(disease.name)) score *= 1.3;
                }

                // Demographic Bias
                if (disease.name === "Diabetes" && age > 45) score *= 1.2;
                if (disease.name === "Hypertension" && age > 50) score *= 1.25;
                if (disease.name === "Urinary Tract Infection" && gender === "female") score *= 1.3;
            }

            return {
                name: disease.name,
                score: score,
                urgency: disease.urgency,
                explanation: disease.explanation,
                recommendations: disease.recommendations
            };
        });

        // Sort by probability and filter out zero matches
        scores = scores.sort((a, b) => b.score - a.score).filter(s => s.score > 0);

        if (scores.length === 0) {
            document.getElementById('diagnosis-list').innerHTML = '<p class="text-center p-8 text-muted">No clear matches found. Consult a professional.</p>';
            return;
        }

        // Normalize Scores for UI (Scale 0-100)
        const topScore = scores[0].score;
        const normalizedResults = scores.slice(0, 5).map(s => ({
            ...s,
            confidence: Math.min(99.4, (s.score * 85) + (Math.random() * 5)).toFixed(1)
        }));

        // Store for PDF
        localStorage.setItem('lastPredictionResults', JSON.stringify(normalizedResults));
        localStorage.setItem('lastCheckedSymptoms', JSON.stringify(symptoms));

        // --- UI UPDATES ---

        // 1. Timestamp
        const dateEl = document.getElementById('assessment-date');
        if (dateEl) dateEl.textContent = new Date().toLocaleString();

        // 2. Urgent Call-to-Action
        const topUrgency = normalizedResults[0].urgency;
        const ctaText = document.getElementById('top-urgency-advice');
        if (ctaText) {
            if (topUrgency === 'High') ctaText.textContent = "Seek medical attention immediately";
            else if (topUrgency === 'Moderate') ctaText.textContent = "Schedule a doctor visit within 1-3 days";
            else ctaText.textContent = "See a doctor within a few days for follow-up";
        }

        // 3. Visualization: Donut Chart (Probability Distribution)
        const donutCtx = document.getElementById('probDonut').getContext('2d');
        new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: normalizedResults.map(r => r.name),
                datasets: [{
                    data: normalizedResults.map(r => parseFloat(r.confidence)),
                    backgroundColor: ['#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, font: { size: 12 } } } },
                cutout: '70%'
            }
        });

        // 4. Visualization: Bar Chart (Confidence Levels)
        const barCtx = document.getElementById('confBar').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: normalizedResults.map(r => r.name),
                datasets: [{
                    label: 'Match Confidence %',
                    data: normalizedResults.map(r => parseFloat(r.confidence)),
                    backgroundColor: '#14b8a6',
                    borderRadius: 8,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false, max: 100 }, y: { grid: { display: false } } }
            }
        });

        // 5. Detailed Diagnosis Cards
        const listEl = document.getElementById('diagnosis-list');
        listEl.innerHTML = '';
        normalizedResults.forEach((res, index) => {
            const card = document.createElement('div');
            card.className = `result-item urgency-${res.urgency.toLowerCase()}`;

            const recListHtml = (res.recommendations || []).map(rec =>
                `<div class="rec-item"><i class="ri-checkbox-circle-line"></i> <span>${rec}</span></div>`
            ).join('');

            card.innerHTML = `
                <div class="result-header">
                    <div class="condition-title">
                        <div class="number-circle">${index + 1}</div>
                        <h2>${res.name}</h2>
                    </div>
                    <div class="urgency-badge badge-${res.urgency.toLowerCase()}">
                        <i class="ri-alert-line"></i> ${res.urgency} Urgency
                    </div>
                </div>
                <div class="result-body">
                    <div class="probability-row">
                        <div class="prob-label">
                            <span>Probability</span>
                            <span>${res.confidence}%</span>
                        </div>
                        <div class="prob-bar-container">
                            <div class="prob-bar-fill" style="width: ${res.confidence}%"></div>
                        </div>
                    </div>
                    <p class="explanation-box">${res.explanation}</p>
                    <div class="recommendations-box">
                        <h4><i class="ri-shield-cross-line"></i> Recommendations</h4>
                        <div class="rec-list">${recListHtml}</div>
                    </div>
                    <div class="reschedule-cta-mini">
                        <i class="ri-calendar-event-line"></i>
                        <span><strong>Schedule Appointment:</strong> See a doctor within a few days</span>
                    </div>
                </div>
            `;
            listEl.appendChild(card);
        });

        // 6. Specialist Grid
        const specGrid = document.getElementById('spec-grid');
        specGrid.innerHTML = '';
        const specialists = DOCTOR_DATA[normalizedResults[0].name] || [];
        specialists.forEach(doc => {
            const item = document.createElement('div');
            item.className = 'spec-item';
            item.innerHTML = `
                <div class="spec-header">
                    <div class="spec-name"><h4>${doc.specialty}</h4></div>
                    <div class="spec-badge">Primary</div>
                </div>
                <p class="spec-advice">To perform comprehensive assessment, coordinate blood work, and discuss further specialist referrals if needed.</p>
                <div class="spec-timing"><i class="ri-time-line"></i> Within 1-2 weeks</div>
            `;
            specGrid.appendChild(item);
        });

        // 7. Dynamic General Advice
        const adviceEl = document.getElementById('general-advice');
        const symptomListRaw = symptoms.slice(0, 3).join(" and ").toLowerCase();
        adviceEl.textContent = `Given the combination of your reported symptoms including ${symptomListRaw}, it is important to look for a systemic cause such as a nutritional deficiency or inflammatory process. Keep a symptom diary noting the time of day and specific flare-ups to help your doctor narrow down the cause.`;

        // Clear selection for next time
        localStorage.removeItem('selectedSymptoms');
    };

    // --- Advanced Search & Discovery for Symptoms ---
    const searchInput = document.getElementById('search');
    const clearBtn = document.getElementById('clear-search');
    const noResults = document.getElementById('no-results');
    const symptomGrid = document.querySelector('.grid');
    const resultsCount = document.getElementById('results-count');
    const countNumber = resultsCount ? resultsCount.querySelector('.count-number') : null;

    if (searchInput) {
        const handleSearch = (query) => {
            const symptomCards = document.querySelectorAll('.symptom-card');
            let totalMatchCount = 0;

            if (clearBtn) clearBtn.style.display = query.length > 0 ? 'block' : 'none';

            symptomCards.forEach(card => {
                const options = card.querySelectorAll('.symptom-options label');
                let cardHasVisibleSymptom = false;

                options.forEach(option => {
                    const originalText = option.getAttribute('data-original-text') || option.textContent.trim();
                    if (!option.hasAttribute('data-original-text')) {
                        option.setAttribute('data-original-text', originalText);
                    }

                    const checkbox = option.querySelector('input[type="checkbox"]');
                    const textContent = originalText.toLowerCase();

                    if (textContent.includes(query)) {
                        option.style.display = 'flex';
                        cardHasVisibleSymptom = true;
                        totalMatchCount++;

                        // Highlight matching text
                        if (query.length > 0) {
                            const regex = new RegExp(`(${query})`, 'gi');
                            const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
                            option.innerHTML = '';
                            option.appendChild(checkbox);
                            const span = document.createElement('span');
                            span.innerHTML = ' ' + highlightedText;
                            option.appendChild(span);
                        } else {
                            option.innerHTML = '';
                            option.appendChild(checkbox);
                            option.appendChild(document.createTextNode(' ' + originalText));
                        }
                    } else {
                        option.style.display = 'none';
                    }
                });

                card.style.display = cardHasVisibleSymptom ? 'block' : 'none';
            });

            // Update UI feedback
            if (resultsCount) {
                resultsCount.style.display = query.length > 0 ? 'block' : 'none';
                if (countNumber) countNumber.textContent = totalMatchCount;
            }

            if (noResults) noResults.style.display = totalMatchCount === 0 && query.length > 0 ? 'flex' : 'none';
            if (symptomGrid) symptomGrid.style.display = totalMatchCount === 0 && query.length > 0 ? 'none' : 'grid';
        };

        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value.toLowerCase());
        });

        // Set static placeholder
        searchInput.placeholder = "Search symptoms...";

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                handleSearch('');
                searchInput.focus();
            });
        }
    }

    // Back button logic
    const backBtn = document.querySelector('.back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('vital.html')) {
                window.location.href = 'history.html';
            } else if (currentPath.includes('history.html')) {
                window.location.href = 'symptoms.html';
            } else if (currentPath.includes('symptoms.html')) {
                window.location.href = 'profile.html';
            } else {
                window.history.back();
            }
        });
    }

    // Save Profile Logic
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const currentProfile = await dbService.getProfile();
            const updatedProfile = {
                ...currentProfile,
                name: document.getElementById('input-name').value,
                email: document.getElementById('input-email').value,
                age: parseInt(document.getElementById('input-age').value),
                gender: document.getElementById('input-gender').value,
                height: parseInt(document.getElementById('input-height').value),
                weight: parseInt(document.getElementById('input-weight').value)
            };

            await dbService.saveProfile(updatedProfile);
            authService.setCurrentUser(updatedProfile.email); // Update session if email changed
            updateProfileUI();
            closeModal();
            console.log("Profile updated in IndexedDB");
        });
    }

    // Open modal from Edit Profile button
    const editBtn = document.querySelector(".profile-card .btn-primary");
    if (editBtn) editBtn.addEventListener("click", openModal);

    // Login logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-password').value;

            const user = await dbService.getUser(email);
            if (user && user.password === pass) {
                authService.setCurrentUser(email);
                window.location.href = 'profile.html';
            } else {
                alert("Invalid email or password!");
            }
        });
    }

    // Register logic
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-password').value;
            const confirmPass = document.getElementById('reg-confirm-password').value;

            if (pass !== confirmPass) {
                alert("Passwords do not match!");
                return;
            }

            const existingUser = await dbService.getUser(email);
            if (existingUser) {
                alert("Email already registered!");
                return;
            }

            const newUser = {
                name: name,
                email: email,
                password: pass,
                age: 24,
                gender: 'Male',
                height: 175,
                weight: 70
            };

            await dbService.saveProfile(newUser);
            authService.setCurrentUser(email);
            window.location.href = 'profile.html';
        });
    }

    // Logout logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
            window.location.href = 'index.html';
        });
    }

    console.log("MediPredict AI System Loaded");
});
