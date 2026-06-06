import axios from "axios";

// No dotenv needed here - already loaded in server.js
export async function generateAIResponse(prompt) {
  const ollamaHost = "http://localhost:11434";

  const res = await axios.post(
    `${ollamaHost}/api/generate`,
    {
      model: "phi3",
      prompt,
      stream: false,
    },
    { timeout: 60000 },
  );

  return res.data.response;
}
