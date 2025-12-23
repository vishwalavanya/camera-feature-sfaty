import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY;
const STREAM_ID = process.env.LIVEPEER_STREAM_ID;

// Health check
app.get("/", (req, res) => {
  res.send("Livepeer backend running");
});

// STEP 1: Create WebRTC broadcast session
app.post("/webrtc/start", async (req, res) => {
  try {
    const response = await fetch(
      "https://livepeer.studio/api/webrtc/broadcast",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LIVEPEER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          streamId: STREAM_ID
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json(data);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STEP 2: Send SDP offer → get SDP answer
app.post("/webrtc/sdp", async (req, res) => {
  try {
    const { sdp, sessionId } = req.body;

    const response = await fetch(
      `https://livepeer.studio/api/webrtc/broadcast/${sessionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LIVEPEER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sdp })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json(data);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
