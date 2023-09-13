const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const https = require("https");
const http = require("http");
const validator = require("validator");
const winston = require("winston");
const rateLimit = require("express-rate-limit");



const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error"}),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});


const logRequest = (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    message: "Incoming request",
  });
  next();
};

const logError = (e, req, res, next) => {
  logger.error({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    message: "Error",
    error: e.message,
  });
  next(e);
};

const logWarn = (req, res, msg) => {
  logger.warn({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    message: msg,
  });
};



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30,
  message:
    "You have exceeded rate limit, too many requests from this IP, please try again later...",
  handler: (req, res) => {
    logWarn(req, res, "Rate limit exceeded");

    res
      .status(429)
      .json( {"error": "Rate limit exceeded"} )
  },
});


const app = express();

app.use(express.json());
app.use(logRequest);
app.use(logError);
app.use(limiter);
app.use(express.static("public"));

const options = {
  key: fs.readFileSync("private.key"),
  cert: fs.readFileSync("certificate.crt")
};


app.post("/api/screenshot", async (req, res) => {
  try {
    const { url } = req.body;
    const { FullPage } = req.body;
    const { height } = req.body;
    const { width } = req.body;

    if (typeof url != "string" || typeof FullPage != "boolean" || typeof height != "number" || typeof width != "number") {
      throw new Error("invalid argument types");
    }

    if (height > 1200 || width > 2000) {
      throw new Error("resolution too high");
    }

    if (!validator.isURL(url)) {
      throw new Error("invalid url");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "networkidle2", headless: "new" });
    const screenshot = await page.screenshot({ fullPage: FullPage });
    await browser.close();

    res.contentType("image/png");
    res.send(screenshot);

  } catch (e) {
    logger.error(e.message);

    if (e.message == "resolution too high") {
      res.status(400).send("Resolution too high!");
    } else if (e.message == "invalid url") {
      res.status(400).send("Invalid URL!");
    } else if (e.message == "invalid argument types") {
      res.status(400).send("Invalid argument type(s)!");
    } else {
      res.status(400).send("Invalid URL!");
    }
  }
});


const port = 443;
const httpPort = 80;

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`HTTPS server listening on port ${port}`);
});


const httpServer = http.createServer((req, res) => {
  const httpsUrl = `https://${req.headers.host}${req.url}`;
  res.writeHead(301, { Location: httpsUrl });
  res.end();
});

httpServer.listen(httpPort, () => {
  console.log(`HTTP server listening on port ${httpPort}`);
});
