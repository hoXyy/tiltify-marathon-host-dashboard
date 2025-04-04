const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.FRONTEND_PORT || 5000;

// Serve static files from dist (Vite's build output)
app.use(express.static(path.join(__dirname, "dist")));

// Serve index.html for all other routes (SPA behavior)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
