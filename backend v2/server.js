import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import connectDB from "./config/nodb.js";
import cookieParser from "cookie-parser";
import signupRouter from "./routes/signUp.js";
import loginRouter from "./routes/login.js";
import logoutRouter from "./routes/logout.js";
import authRouter from "./routes/auth.js";
import votingRouter from "./routes/voting.js";
import chatRouter from "./routes/chat.js";
import { globalLimiter } from "./middleware/rateLimiters.js";

dotenv.config();

const REQUIRED_ENV = [
  "MONGO_URI",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "FRONTEND_URL",
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error("Missing required environment variables:", missing.join(", "));
  process.exit(1);
}

connectDB();
const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend origin
    credentials: true, // allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

async function warmUp() {
  try {
    const ollamaHost = "http://localhost:11434";
    await axios.post(`${ollamaHost}/api/generate`, {
      model: "phi3",
      prompt: "ping",
      stream: false,
    });
    console.log("Ollama warmed up");
  } catch (err) {
    console.log("Ollama not available:", err.message); // don't crash the server
  }
}

warmUp();

app.use("/signup", signupRouter);

app.use("/login", loginRouter);

app.use("/logout", logoutRouter);

app.use("/auth", authRouter);

app.use("/vote", votingRouter);

app.use("/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Twilio OTP Backend is running!");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
