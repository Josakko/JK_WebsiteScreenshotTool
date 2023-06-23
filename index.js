const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/screenshot", async (req, res) => {
  try {
    const { url } = req.body;
    const { FullPage } = req.body;
    const { height } = req.body;
    const { width } = req.body;
    
    if (height > 1200 || width > 2000) {
      throw new Error("resolution to high")
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.setViewport({ width, height });
    await page.goto(url,  { waitUntil: "networkidle2", headless: "new" });
    const screenshot = await page.screenshot({ fullPage: FullPage });
    await browser.close();
  
    res.contentType("image/png");
    res.send(screenshot);
  } catch (e) {
    if (e.message == "resolution to high") {
      res.status(400).send("Resolution to high!");
    } else {
      res.status(500).send("Error generating screenshot!");
    }
  }
});

const port = 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
