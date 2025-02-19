const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');


exports.getIndex = (req, res) => {
  res.render("index");
};

exports.converter = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-web-security"],
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    await page.waitForFunction(
      () => document.querySelectorAll("main, body, div").length > 0,
      { timeout: 10000 }
    );

    const pdfPath = path.join(__dirname, "output.pdf");
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();

    res.download(pdfPath, "website.pdf", (err) => {
      if (err) {
        console.error(err);
      }
      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    console.error("Error converting URL to PDF:", error);
    res.status(500).send("Failed to convert URL to PDF");
  }
};
