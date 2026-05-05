import dotenv from "dotenv";

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",

  openaiApiKey: requireEnv("OPENAI_API_KEY"),
  anthropicApiKey: requireEnv("ANTHROPIC_API_KEY"),

  groqApiKey: requireEnv("GROQ_API_KEY"),
  groqBaseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",

  redisUrl: requireEnv("REDIS_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),

  defaultProvider: process.env.DEFAULT_PROVIDER || "groq",

  defaultOpenAIModel: process.env.DEFAULT_OPENAI_MODEL || "gpt-4o-mini",
  defaultAnthropicModel:
    process.env.DEFAULT_ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
  defaultGroqModel: process.env.DEFAULT_GROQ_MODEL || "llama-3.1-8b-instant",
};