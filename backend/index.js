import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { db } from "./firebaseConfig.js";
import admin from "firebase-admin";
import cors from "cors";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

// Disable SSL verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
// Allow larger JSON bodies (e.g., base64 frames from detection)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("Hello There");
});

app.post("/api/updateRiskLevel", async (req, res) => {
  const { riskLevel, tideData, weatherSummary, location, risk_factors } =
    req.body;

  try {
    // add the entry to database
    await addDoc(collection(db, "risk_logs"), {
      riskLevel,
      location,
      tideData,
      risk_factors,
      weatherSummary,
      timestamp: serverTimestamp(),
    });
    console.log("Data Saved");
    res.status(200).send("Data saved");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/reportIncident", async (req, res) => {
  const { type, timestamp, confidence, video, frame } = req.body;

  // Send response immediately
  res.status(200).send("Incident received");

  // Save to database asynchronously
  try {
    await addDoc(collection(db, "incidents"), {
      type,
      confidence: confidence,
      frame: frame,
      timestamp: serverTimestamp(),
    });
    console.log("Saved to database");

    // 2. Send Alert
    const messageData = { imageBase64: frame, type, confidence };
    await alertGroup(messageData);
  } catch (err) {
    console.error("Error while sending:", err);
  }
});

app.get("/api/getAlerts", async (req, res) => {
  try {
    // 1. get the data from database
    const alertsRef = collection(db, "incidents");
    const q = query(alertsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    // 2. send the data
    const alerts = [];
    querySnapshot.forEach((doc) => {
      alerts.push({ id: doc.id, ...doc.data() });
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/getWeather", async (req, res) => {
  try {
    // 1. get the most recent weather entry
    const weatherRef = collection(db, "risk_logs");
    const q = query(weatherRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    // 2. send the data
    if (querySnapshot.empty) {
      return res.json(null);
    }
    const doc = querySnapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    res.status(500).send(err.message);
  }
});

// Function to send Telegram Alert
async function alertGroup(data) {
  const botToken = process.env.BOT_TOKEN;
  const chatId = "-5057552051";

  if (!botToken) {
    console.error("BOT_TOKEN is not set in environment variables");
    return;
  }

  console.log("Bot token loaded:", botToken.substring(0, 10) + "...");

  try {
    const photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    console.log("Sending to:", photoUrl);

    const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("photo", imageBuffer, { filename: "incident.jpg" });
    formData.append(
      "caption",
      `⚠️ <b>${
        data.type || "Incident"
      } Detected</b> ⚠️\n🎯 <b>Confidence:</b> ${data.confidence || "N/A"}%`,
      { contentType: "text/plain" }
    );
    formData.append("parse_mode", "HTML");

    await axios.post(photoUrl, formData, {
      headers: formData.getHeaders(),
    });

    console.log("Alert sent to Telegram successfully");
  } catch (error) {
    console.error(
      "Telegram Alert Failed:",
      error.response ? error.response.data : error.message
    );
  }
}

app.listen(3001);
