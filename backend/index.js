import express from "express";
import axios from "axios";
import "dotenv/config";
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
} from "firebase/firestore";

// Disable SSL verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(express.json());
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
  const { coordinates, confidence, imageUrl } = req.body;

  try {
    // 1. Save to Database
    await addDoc(collection(db, "incidents"), {
      coordinates,
      confidence,
      imageUrl,
      timestamp: serverTimestamp(),
    });
    console.log("Saved to database");

    // 2. Send Alert
    const messageData = { coordinates, imageUrl };
    res.status(200).send("Incident reported");
    await alertGroup(messageData);
  } catch (err) {
    console.error("Critical Error:", err);
    if (!res.headersSent) {
      res.status(500).send(err.message);
    }
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
    // 1. get the data from database
    const weatherRef = collection(db, "risk_logs");
    const q = query(weatherRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    // 2. send the data
    if (querySnapshot.empty) {
      return res.json([]);
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
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const chatId = "-5057552051";

  // contructing the message to send
  const text = `
⚠️ <b>Incident Reported</b> ⚠️
📍 <b>Lat:</b> ${data.coordinates.latitude}
📍 <b>Long:</b> ${data.coordinates.longitude}
📷 <b>Image:</b> ${data.imageUrl}`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
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
