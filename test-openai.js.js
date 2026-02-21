import dotenv from "dotenv";
dotenv.config(); // ✅ load .env.local

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Say yes" }],
    });

    console.log("AI Response:", res.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
