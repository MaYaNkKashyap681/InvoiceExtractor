const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
}

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision"});
    const input_prompt = "You are an expert in understanding invoices. We will upload an a image as invoice and you will have to answer any questions based on the uploaded invoice image";
    const user_input_prompt = "Give the names of all the items purchased along with their quantity";
    const imageParts = [
      fileToGenerativePart("./assets/invoice.png", "image/png")
    ];
    const result = await model.generateContent([input_prompt,...imageParts, user_input_prompt]);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
