import fastify from "fastify";
import { chatRoutes } from "./routes/chat.js";
import { config } from "./config.js";
import { usageRoutes } from "./routes/usage.js";
import { checkRedisHealth } from "./memory/conversation.js";

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
app.get("/api/health", async (request, reply) => {
  const redisHealth = await checkRedisHealth();

  const isHealthy = redisHealth.status === "connected";

  return reply.status(isHealthy ? 200 : 503).send({
    status: isHealthy ? "healthy" : "unhealthy",
    service: "Build 1 Streaming LLM API",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    dependencies: {
      redis: redisHealth,
    },
  });
});

await app.register(chatRoutes);
await app.register(usageRoutes);

const start = async () => {
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    app.log.info("Server started on port 3000");
  } catch (err) {
    app.log.error("Error starting server", err);
    process.exit(1);
  }
};

start();
