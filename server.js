import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Server OK ✅");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port", PORT);
});




