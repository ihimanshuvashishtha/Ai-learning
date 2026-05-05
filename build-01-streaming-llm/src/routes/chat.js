import { z } from "zod";
import { getDefaultModel, getProvider } from "../providers/index.js";
import { config } from "../config.js";
import { getMessages, saveMessages, clearMessages } from "../memory/conversation.js";
import { estimateMessageTokens, estimateTokens } from "../utils/token-counter.js";
import { addUsageLog } from "../middleware/usage-tracker.js";

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
    const oldMesssages = await getMessages(body.sessionId)

    const userMessage = {
      role:'user',
      content:body.message,
      timestamp:new Date().toISOString(),
    }

    const messages = [
      {
        role: "system",
        content: body.systemPrompt || "You are a helpful AI assistant.",
      },
      ...oldMesssages.map((message)=>({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content: userMessage.content,
      },
    ];

    const inputTokens = estimateMessageTokens(messages);
    const startAt = Date.now(); 

    reply.hijack();

    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    let assistantResponse = ""
    try {
      for await (const token of provider.streamChat({ messages, model })) {
        assistantResponse += token;
        reply.raw.write(
          `data: ${JSON.stringify({
            type: "token",
            content: token,
          })}\n\n`
        );
      }

    const assistantMessage = {
      role: "assistant",
      content:assistantResponse,
      timestamp:new Date().toISOString(),
    }

    const outputTokens = estimateTokens(assistantResponse);
    const responseTimeMs = Date.now() - startAt;

    addUsageLog({
      sessionId:body.sessionId,
      provider:provider.providerName,
      model,
      inputTokens,
      outputTokens,
      cost:0,
      responseTimeMs,
    });

    await saveMessages(body.sessionId,[
      ...oldMesssages,
      userMessage,
      assistantMessage,
    ])

      reply.raw.write(
        `data: ${JSON.stringify({
          type: "done",
          provider: provider.providerName,
          model,
        })}\n\n`
      );
    } catch (error) {
      request.log.error(error, "Streaming chat failed");

      reply.raw.write(
        `data: ${JSON.stringify({
          type: "error",
          message: "AI streaming failed",
        })}\n\n`
      );
    } finally {
      reply.raw.end();
    }
  });


  app.get("/api/chat/:sessionId/history",async(request, reply)=>{
    const { sessionId } = request.params;
    const messages = await getMessages(sessionId);

    return reply.send({
      sessionId,
      count:messages.length,
      messages,
    });
  })

  app.delete("/api/chat/:sessionId", async(request,reply)=>{
    const { sessionId } = request.params;
    await clearMessages(sessionId);

    return reply.send({
      status:"ok",
      message:"Converstaion session cleared",
      sessionId,
    })
  })


}