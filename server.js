import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetch } from "undici";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY;
const PORT = process.env.PORT || 10000;

// Health check
app.get("/", (req, res) => {
  res.send("Livepeer backend running ✅");
});

/**
 * STEP 1: Create a Livepeer stream
 * This returns ingestUrl + streamKey
 * Frontend will use Livepeer WebRTC client
 */
app.post("/webrtc/start", async (req, res) => {
  try {
    const response = await fetch("https://livepeer.studio/api/stream", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LIVEPEER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "browser-camera-stream"
      })
    });

    const data = await response.json();

    if (!data.streamKey) {
      return res.status(500).json({ error: "Failed to create stream" });
    }

    // 🔥 This is ALL the frontend needs
    res.json({
      ingestUrl: "https://webrtc.livepeer.studio",
      streamKey: data.streamKey,
      playbackId: data.playbackId
    });

  } catch (err) {
    console.error("STREAM CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});






