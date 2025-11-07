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

app.get("/", (_, res) => {
  res.sendFile(require("path").join(__dirname, "public", "index.html"));
});

app.get("/:code", (req, res) => {
  const encodedUrl = req.params.code;
  try {
    const originalUrl = decodeFromBase2(encodedUrl);
    if (
      originalUrl.startsWith("http://") ||
      originalUrl.startsWith("https://")
    ) {
      res.redirect(originalUrl);
    } else {
      res.sendFile(require("path").join(__dirname, "public", "error.html"));
    }
  } catch (e) {
    res.sendFile(require("path").join(__dirname, "public", "error.html"));
  }
});

app.listen(port, () => {
  console.log(`长链接服务运行在 http://localhost:${port}/`);
});

function decodeFromBase2(encodedStr) {
  const binaryString = encodedStr.replace(/i/g, "0").replace(/I/g, "1");
  if (binaryString.length % 8 !== 0) {
    throw new Error("无效的Base2编码字符串长度");
  }
  const bytes = [];
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = parseInt(binaryString.substring(i, i + 8), 2);
    bytes.push(byte);
  }
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(new Uint8Array(bytes));
}

module.exports = app;
