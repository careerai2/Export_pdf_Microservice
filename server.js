import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


import client from "./redis_config.js";
import { generateResumePdf } from "./pdf.js";
import dotenv from "dotenv";



dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));

app.get("/",(req,res)=>{
    res.send("PDF Service is running 🚀");
})

app.post("/download-resume/:resumeId/:userId", async (req, res, next) => {
  try {
    // const resume = req.body; // assuming client sends resume JSON

    const key = `resume:${req.params.userId}:${req.params.resumeId}`;
    const resume = await client.get(key); 

    // console.log("resume = ",resume);
    if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
    }

    const pdfBuffer = await generateResumePdf(JSON.parse(resume));

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');

    console.info("\nPDF generated, size:", pdfBuffer.length, "bytes",`\nfor resumeId=${req.params.resumeId}, userId=${req.params.userId}`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("\n\nError generating PDF:", err.stack || err);
    return res.status(500).json({ error: err.message });
  }
});



app.listen(9000, () => {
    console.log("🚀 PDF Service running on http://localhost:9000");
});
