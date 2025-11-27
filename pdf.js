// src/pdf.js
import fs from "fs";
import path from "path";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import x from "./views/"
// 1. Configure Nunjucks
const env = nunjucks.configure(path.join(__dirname, "./views"), {
  autoescape: true,
  noCache: true, // disable in prod if you want caching
});

// 2. Optional: filters you used in template (CGPA formatting etc.)
env.addFilter("toFixed", function (num, digits) {
  if (num === undefined || num === null || num === "") return "";
  const d = Number(digits) || 0;
  const n = Number(num);
  if (isNaN(n)) return num;
  return n.toFixed(d);
});

/**
 * Generate resume PDF
 * @param {object} resume - Your resume object
 * @param {string} [outputPath] - Optional: if given, save PDF to this path
 * @returns {Promise<Buffer>} pdfBuffer
 */
export async function generateResumePdf(resume, outputPath) {
  // 1. Render HTML from Nunjucks
  const html = env.render("template.njk", {
    resume,
    hidden_state: resume.hidden_state ?? {}, // if you use it
  });

  // 2. Launch headless browser
  const browser = await puppeteer.launch({
    headless: "new", // or true
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // useful on many servers
  });

  try {
    const page = await browser.newPage();

    // 3. Set HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // 4. Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "18mm",
        bottom: "15mm",
        left: "18mm",
      },
      // prefer CSS @page; these margins match your CSS
    });

    // 5. Optional: save to file
    if (outputPath) {
      await fs.promises.writeFile(outputPath, pdfBuffer);
    }

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
