import fastify from "fastify";
import { chatRoutes } from "./routes/chat.js";
import { config } from "dotenv";

const app = fastify({
  logger: config.nodeEnv === "development"
  ?{
    transport:{
      target:"pino-pretty",
      options:{
        colorize:true,
        translateTime:"HH:MM:ss",
        ignore:'pid,hostname',
      },
    },
  }
  :true,
});

app.get("/api/health", async () => {
  return {
    status: "ok",
    message: "Build 1 Streaming LLM is running....",
    timestamp: new Date().toISOString(),
  };
});

await app.register(chatRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    app.log.info("Server started on port 3000");
  } catch (err) {
    app.log.error("Error starting server", err);
    process.exit(1);
  }
};

start();
