const express = require("express");
import axios from "axios";
import { db } from "./firebaseConfig.js";
const admin = require("firebase-admin");
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const app = express();
app.use(express.json());

app.post("/updateRiskLevel", async (req, res) => {
  const { riskLevel, tideData, weatherSummary } = req.body;

  try {
    // add the entry to database
    await addDoc(collection(db, "risk_logs"), {
      riskLevel,
      tideData,
      weatherSummary,
      timestamp: serverTimestamp(),
    });
    res.status(200).send("Data saved");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/reportIncident", async (req, res) => {
  const { coordinates, confidence, imageUrl } = req.body;

  try {
    // 1. Save to Database
    await addDoc(collection(db, "incidents"), {
      coordinates,
      confidence,
      imageUrl,
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

// Function to send Telegram Alert
async function alertGroup(data) {
  const botToken = process.env.BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const chatId = "-5057552051";

  // contruct the message to send
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

app.listen(3000);
