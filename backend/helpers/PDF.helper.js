const puppeteer = require("puppeteer"),
  hbs = require("handlebars"),
  fs = require("fs-extra"),
  path = require("path");

async function generatePdf(template, pdf, data) {
  try {
    const browser = await puppeteer.launch({ headless: "new" }),
      page = await browser.newPage(),
      html = await fs.readFile(
        path.join(process.cwd(), "/assets/", `${template}.hbs`),
        "utf-8"
      ),
      pageContent = hbs.compile(html)(data);

    pdf = path.join(process.cwd(), `/${pdf}.pdf`);

    await page.setContent(pageContent);

    const generatedPdf = await page.pdf({
      path: pdf,
      format: "A4",
      printBackground: true,
      margin: {
        top: "50px",
        bottom: "50px",
        right: "0",
        left: "0",
      },
    });

    await browser.close();

    const buffer = Buffer.from(generatedPdf),
      base64 = buffer.toString("base64"),
      base64Url = buffer.toString("base64url");

    return {
      pdf,
      buffer: generatedPdf,
      base64,
      base64Url,
    };
  } catch (e) {
    return false;
  }
}

// generatePdf("purchase/rfq/template_1", "storage/rfq/final_test_17_07_2023", {
//   date: "07/09/1909",
//   ref: "RFQ12345",
//   rfq: "RFQ2307170001",
//   tac: "Hello Tesms and condetailn",
//   vendor: {
//     name: "Mr. Tiwari",
//     orgName: "Inevitable Group",
//     contact: "8318400344",
//     address: "Abhay Mishra Indra nagar",
//     email: "abhaymishra@gmail.com",
//   },
//   items: [
//     {
//       sr: 1,
//       ipn: "IPN123",
//       description: "Orca Board",
//       manufacture: "Inevitable Group",
//       mpn: "IG/OB/123400",
//       quantity: 20,
//     },
//   ],
// }).then((res) => console.log(res));

const generateRFQpdf = async (pdf, data) => {
  const res = await generatePdf(
    "/purchase/rfq/template_1",
    `storage/rfq/${pdf}`,
    data
  );

  const pdfUrl =
    (process.env.APP_URL ?? "http://localhost:5000/") + `files/rfq/${pdf}.pdf`;

  if (res) {
    return {
      pdfUrl,
      base64: res.base64,
    };
  } else {
    return false;
  }
};

module.exports = { generatePdf, generateRFQpdf };
