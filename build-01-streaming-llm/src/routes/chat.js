import { z } from "zod";
import { getDefaultModel, getProvider } from "../providers/index.js";
import { config } from "../config.js";

const chatRequestSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  message: z.string().min(1, "message is required"),
  provider: z.enum(["groq", "openai", "anthropic"]).optional(),
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
});

export async function chatRoutes(app) {
  app.post("/api/chat", async (request, reply) => {
    const validationResult = chatRequestSchema.safeParse(request.body);

    if (!validationResult.success) {
      return reply.status(400).send({
        error: "Invalid request body",
        details: validationResult.error.flatten(),
      });
    }

    const body = validationResult.data;

    const providerName = body.provider || config.defaultProvider;
    const model = body.model || getDefaultModel(providerName);
    const provider = getProvider(providerName);

    return reply.send({
      status: "ok",
      message: "Chat route validation is working",
      provider: provider.providerName,
      model,
      sessionId: body.sessionId,
      userMessage: body.message,
    });
  });
}