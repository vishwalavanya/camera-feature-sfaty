import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetch } from "undici";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY;
const STREAM_ID = process.env.LIVEPEER_STREAM_ID;

const PORT = process.env.PORT || 10000;

// Health check
app.get("/", (req, res) => {
  res.send("Livepeer backend running ✅");
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
        body: JSON.stringify({ streamId: STREAM_ID })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("START ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// STEP 2: SDP exchange
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
    res.json(data);
  } catch (err) {
    console.error("SDP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





