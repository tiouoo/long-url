const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(require("path").join(__dirname, "public", "index.html"));
});

app.get("/:code", (req, res) => {
  try {
    return res.redirect(url);
  } catch (err) {
    return res.sendFile(
      require("path").join(__dirname, "public", "error.html")
    );
  }
});

app.listen(port, () => {
  console.log(`长链接服务运行在 http://localhost:${port}/`);
});

module.exports = app;
