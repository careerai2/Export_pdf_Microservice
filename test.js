// scripts/test-pdf.js
import { generateResumePdf } from "../src/pdf.js";

const resume = {
  title: "SDE Internship Resume",
  name: "Keshav Raj",
  email: "keshav@example.co m",
  phone_number: "+91-9876543210",
  external_links: ["https://github.com/keshav", "https://linkedin.com/in/keshav"],
  summary: "Second-year Chemical Engineering student with strong backend and full-stack experience...",
  cgpa: 8.473,
  education_entries: [
    {
      college: "IIT Delhi",
      degree: "B.Tech in Chemical Engineering",
      cgpa: 8.473,
      start_year: 2023,
      end_year: null,
    },
  ],
};

// ...fill rest according to your template structure
(async () => {
  const pdf = await generateResumePdf(resume, "out-resume.pdf");
  console.log("PDF generated: out-resume.pdf, size:", pdf.length, "bytes");
})();
