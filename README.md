# 🌊 CoastGuard AI

### Real-Time Beach Safety Monitoring & Drowning Detection System

![CoastGuard AI Dashboard](assets/image.png)

## 🏗️ System Architecture

![Architecture Diagram](assets/image1.png)

## 📋 Overview

CoastGuard AI is a comprehensive beach safety monitoring system that combines real-time marine data analysis, AI-powered drowning detection, and instant alert mechanisms to protect beachgoers.

### System Components

#### 1️⃣ **REST API Service** (`restapi/`)

- **Technology:** FastAPI (Python)
- **Port:** 8000
- **Purpose:** Marine data analysis and risk classification
- **Features:**
  - Fetches live marine data from Open-Meteo API
  - Classifies beach conditions using global safety standards:
    - **Wave Height:** Safe (<0.5m) | Caution (0.5-1.5m) | Danger (≥1.5m)
    - **Wave Period:** Safe (>10s) | Caution (6-10s) | Danger (<6s)
    - **Ocean Current:** Safe (<0.5 km/h) | Caution (0.5-1.0 km/h) | Danger (≥1.0 km/h)
  - Returns safety level with detailed risk factors

#### 2️⃣ **Backend Service** (`backend/`)

- **Technology:** Express.js (Node.js)
- **Port:** 3001
- **Purpose:** Data persistence and alert broadcasting
- **Features:**
  - Firebase/Firestore integration for risk logs and incidents
  - Telegram bot integration for emergency alerts
  - Real-time incident reporting with image capture
  - RESTful API for frontend communication

#### 3️⃣ **Frontend Dashboard** (`frontend/`)

- **Technology:** Next.js (React)
- **Port:** 3000
- **Purpose:** Mission control interface
- **Features:**
  - Live risk level status bar
  - Interactive Google Maps integration
  - Real-time alert list with confidence scores
  - Incident feed with captured frames
  - Auto-refresh every 30 seconds

#### 4️⃣ **Cron Bridge Service** (`python_script/`)

- **Technology:** Python
- **Purpose:** Automated monitoring loop
- **Features:**
  - Polls REST API every 6 minutes
  - Forwards predictions to Backend service
  - Ensures continuous beach condition monitoring

#### 5️⃣ **Drowning Detection** (`drowning_v2/`) _(Optional)_

- **Technology:** Python + YOLOv8 + MediaPipe
- **Purpose:** Computer vision-based drowning detection
- **Features:**
  - Real-time person detection using YOLOv8
  - Pose estimation with MediaPipe
  - Stillness tracking algorithm (>15 frames = alert)
  - Automatic incident reporting with frame capture

## 🔄 Process Flow

### Marine Data Monitoring Flow

```
Cron Job (every 6 min)
  → REST API (with coordinates)
    → Open-Meteo API (fetch marine conditions)
      → Risk Classification Engine
        → Cron Job (safety level + risk factors)
          → Backend Service (POST /api/updateRiskLevel)
            → Firestore (store risk log with timestamp)
              → Frontend Dashboard (display current conditions)
```

### Incident Detection & Alert Flow

```
Video Feed
  → Drowning Detection (YOLOv8 + MediaPipe)
    → Stillness Detection (>15 frames)
      → Backend Service (POST /api/reportIncident)
        → Firestore (store incident)
        → Telegram Bot API (send alert with image)
          → Lifeguard Group Chat (emergency notification)
            → Frontend Dashboard (display in alert list)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **npm** or **Bun**
- **Firebase** project with Firestore
- **Telegram Bot** token
- **Google Maps API** key
  🔐 Environment Variables

### Root `.env` (Required for Docker Compose)

Create a `.env` file in the root directory:

````env
# Firebase Configuration
API_KEY=your_firebase_api_key_or_service_account_api_key

# Telegram Bot
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_chat_id
🐳 Docker Deployment

### Quick Start
```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d

# V🔌 API Endpoints

### REST API Service (Port 8000)
| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| `POST` | `/api/v1/predict` | Get beach safety prediction | `{latitude, longitude}` | Safety level + risk factors |
| `GET` | `/api/v1/predict/{lat}/{lon}` | Alternative GET method | URL params | Safety level + risk factors |
| `GET` | `/api/v1/health` | Health check | - | Service status |

### Backend Service (Port 3001)
| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| `POST` | `/api/updateRiskLevel` | Store safety prediction | Risk level + tide data | Confirmation |
| `POST` | `/api/reportIncident` | Log drowning detection | Type + confidence + frame | Confirmation |
| `GET` | `/api/getAlerts` | Retrieve recent incidents | - | Array of alerts |
| `GET` | `/api/getWeather` | Get current conditions | - | Latest risk log |

## 🗂️ Repository Structure

````

TechSprint/
├── assets/ # Images and diagrams
├── restapi/ # FastAPI prediction service
│ ├── app/
│ │ ├── api/ # Routes and schemas
│ │ ├── models/ # Risk classification logic
│ │ └── services/ # Data ingestion from Open-Meteo
│ ├── config.py # Configuration and thresholds
│ └── main.py # FastAPI application entry
├── backend/ # Express.js backend
│ ├── firebaseConfig.js # Firebase initialization
│ └── index.js # Express server + API routes
├── frontend/ # Next.js dashboard
│ └── app/
│ ├── components/ # React components (Header, Map, Alerts)
│ ├── hooks/ # Custom hooks (useAlerts)
│ └── page.js # Main dashboard page
├── python_script/ # Automated monitoring
│ └── cron_job.py # Polls API every 6 minutes
├── drowning_v2/ # Computer vision detection
│ ├── main.py # YOLOv8 + MediaPipe processing
│ └── api.py # Alert sending logic
├── compose.yml # Docker Compose orchestration
└── README.md # This file

````

## 🎯 Key Features

- ✅ **Real-time Marine Data Analysis** - Live ocean condition monitoring
- ✅ **AI Risk Classification** - Automated safety level determination
- ✅ **Computer Vision Detection** - YOLOv8-powered drowning detection
- ✅ **Instant Alerts** - Telegram bot notifications for emergencies
- ✅ **Interactive Dashboard** - Mission control interface with maps
- ✅ **Historical Logging** - Firebase storage for incident analysis
- ✅ **Automated Monitoring** - Continuous 24/7 beach surveillance
- ✅ **Docker Deployment** - Easy containerized setup

## 🔧 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Express.js, FastAPI |
| **Frontend** | Next.js, React, Tailwind CSS |
| **AI/ML** | YOLOv8, MediaPipe, OpenCV |
| **Database** | Firebase Firestore |
| **Alerts** | Telegram Bot API |
| **APIs** | Open-Meteo Marine API, Google Maps |
| **DevOps** | Docker, Docker Compose |

## 📊 Monitoring Thresholds

### Global Beach Safety Standards
| Parameter | Safe | Caution | Danger |
|-----------|------|---------|--------|
| **Wave Height** | < 0.5m | 0.5 - 1.5m | ≥ 1.5m |
| **Wave Period** | > 10s | 6 - 10s | < 6s |
| **Ocean Current** | < 0.5 km/h | 0.5 - 1.0 km/h | ≥ 1.0 km/h |
| **Stillness** | - | - | > 15 frames |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of a hackathon submission.

## 👥 Team

Built with ❤️ for beach safety and lifeguard operations.

---

**⚠️ Note:** This system is designed to assist lifeguards and beach safety personnel. It should not replace human judgment and professional oversight
### Docker Network
All services communicate via `beach-safety-net` Docker network with internal DNS resolution.

### Service-Specific Environment Files
For local development, you can create service-level `.env` files that mirror the root configuration:
- `backend/.env` - Firebase and Telegram credentials
- `frontend/.env.local` - Next.js public variables
- `python_script/.env` - API endpoints
📍 API Docs: http://localhost:8000/docs

#### 2️⃣ Backend Service (Express + Firebase)
```bash
cd backend
npm install   # or: bun install
npm start     # or: node index.js / bun index.js
````

📍 Serves at: http://localhost:3001

#### 3️⃣ Frontend Dashboard (Next.js)

```bash
cd frontend
npm install   # or: bun install
npm run dev
```

📍 Dashboard: http://localhost:3000

#### 4️⃣ Cron Bridge Script

```bash
cd python_script
python cron_job.py  # polls every 6 minutes
```

#### 5️⃣ Drowning Detection (Optional)

```bash
cd drowning_v2
pip install -r requirements.txt
python main.py
```

## Environment Variables

- Root `.env` (used by docker compose):

```
API_KEY=your_firebase_api_key_or_service_account_api_key
BOT_TOKEN=telegram_bot_token
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_MAPS_API=your_google_maps_key
PREDICT_URL=http://localhost:8000/api/v1/predict
UPDATE_URL=http://localhost:3001/api/updateRiskLevel
```

- Local dev (optional): you can still keep service-level `.env` files if running components manually; they mirror the same keys.

## Docker Compose

```bash
docker compose up --build
```

Services:

- restapi: http://localhost:8000
- backend: http://localhost:3001
- frontend: http://localhost:3000
- cron: polls predictor and posts to backend (uses root `.env`)

## Key Endpoints

- FastAPI: `POST /api/v1/predict` (lat/long → safety classification), `GET /api/v1/predict/{lat}/{long}`
- Express: `POST /api/updateRiskLevel` (store latest safety), `POST /api/reportIncident` (save & alert), `GET /api/getAlerts`, `GET /api/getWeather`

## Typical Flow

1. `restapi` ingests marine data and returns a safety level.
2. `python_script/cron_job.py` polls the predictor and posts the result to `backend`.
3. `backend` saves risk logs and incidents to Firestore and sends Telegram alerts.
4. `frontend` reads from the `backend` APIs to show the live dashboard.

## Repository Map

- `restapi/` — FastAPI predictor and docs.
- `backend/` — Express server for persistence + alerts.
- `frontend/` — Next.js UI.
- `python_script/` — Polling bridge between predictor and backend.
