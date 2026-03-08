const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, "dist");
const useReactBuild = fs.existsSync(distPath);

if (useReactBuild) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.use(express.static(__dirname));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  app.use((req, res) => res.status(404).send("Page not found"));
}

app.listen(PORT, () => {
  console.log(`EventRent running at http://localhost:${PORT}${useReactBuild ? " (React build)" : ""}`);
});

