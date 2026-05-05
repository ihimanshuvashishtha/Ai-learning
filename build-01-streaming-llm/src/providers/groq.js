import OpenAI from "openai";
import { LLMProvider } from "./base.js";
import { config } from "../config.js";
import { withRetry } from "../utils/retry.js";

export class GroqProvider extends LLMProvider {
  constructor() {
    super("groq");

    this.client = new OpenAI({
      apiKey: config.groqApiKey,
      baseURL: config.groqBaseUrl,
    });
  }

  async *streamChat({ messages, model }) {
    const stream = await withRetry(()=>
      this.client.chat.completions.create({
      model,
      messages,
      stream: true,
    })
  );

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;

      if (token) {
        yield token;
      }
    }
  }
}