# 🌾 KrishiBhai AI — Autonomous Agronomic AI Agent


---

## 🌟 5 Autonomous Agent Tools

1. 🌿 **Crop Disease Diagnosis Tool (`diagnose_crop_disease`):**
   - Multimodal leaf image & symptom inspection (Wheat Yellow Rust, Paddy Sheath Blight, Potato Late Blight, Cotton Whitefly, Mustard Aphids, Tomato Blight).
   - Certified chemical remedies (Nativo 75 WG @ 120g/acre, Tilt 25 EC @ 200ml/acre, Ulala @ 80g/acre, Curzate M-8 @ 700g/acre) with exact water volume (200L/acre) and organic alternatives.

2. 🌦️ **Real-Time Weather & Spray Safety Advisory (`get_weather_and_spray_advisory`):**
   - Checks temperature, rain probability, humidity, and wind speed.
   - Computes **Spray Suitability**: Warns farmer if rain within 6 hours will wash off expensive chemicals or if wind > 15 km/h will cause spray drift.

3. 📊 **APMC Mandi Bhav & Market Advisory (`get_mandi_prices`):**
   - Real-time/benchmark APMC mandi rates across key grain & vegetable markets.
   - Compares current market price with Government MSP (Minimum Support Price) and provides commercial advisory (Sell vs Hold).

4. 🧪 **Precision Fertilizer NPK Calculator (`calculate_fertilizer_npk`):**
   - Computes exact bags of **Urea (46% N)**, **DAP (18:46:0)**, **MOP (60% K₂O)**, and Zinc Sulphate tailored to crop and field acreage.
   - Gives stage-wise split application schedules (Basal, 1st Irrigation, 2nd Irrigation).

5. 🏛️ **Government Kisan Schemes & Subsidy Guide (`get_kisan_schemes`):**
   - Instant guidance on **PM-Kisan** (₹6,000 yearly benefit), **PM Fasal Bima Yojana (PMFBY)** crop insurance claims within 72 hours, **PM-KUSUM** solar pump 60% subsidy, and **KCC** 4% interest loans.

---

## 🗣️ Vernacular Voice & Multi-Language Support

- **Supported Languages:**
  - 🇮🇳 **हिंदी (Hindi)** — Default
  - 🌾 **Hinglish**
  - ☬ **ਪੰਜਾਬੀ (Punjabi)**
  - 🇧🇩 **বাংলা (Bengali)**
  - 🇬🇧 **English**
- **Speech-to-Text (Voice Mic):** One-tap microphone input in native dialect via Web SpeechRecognition.
- **Text-to-Speech (Voice Prescription):** One-tap "सुनें (Listen)" speaker button to read advice aloud.

---

## 🚀 How to Run KrishiBhai AI Agent

### 1. Open Terminal in the Project Directory:
```bash
cd C:\Users\hp\.gemini\antigravity\scratch\krishibhai-django-chat
```

### 2. Install Python Dependencies:
```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations:
```bash
python manage.py migrate
```

### 4. (Optional) Run Agent Test Suite:
```bash
python test_agent.py
```

### 5. Start the Server:
```bash
python manage.py runserver
```

### 6. Open in Browser:
Visit: `http://127.0.0.1:8000/`

---

## 🔌 Dedicated Agent REST API Endpoints

- **Chat & Multi-Tool Agent:** `POST /api/send-message/`
  - Parameters: `prompt`, `image`, `conversation_id`, `language`, `location`, `api_key`
  - Returns: `content`, `agent_thoughts` (step-by-step reasoning), `tools_called`, `audio_script`
- **Mandi Rates:** `GET /api/agent/mandi/?crop=wheat&state=Punjab`
- **Agro-Weather:** `GET /api/agent/weather/?location=Ludhiana`
- **Fertilizer Calculator:** `POST /api/agent/fertilizer/` (Body: `crop=wheat&acreage=2.0&unit=acre`)
