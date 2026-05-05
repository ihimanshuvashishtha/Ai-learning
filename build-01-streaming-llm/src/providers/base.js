export class LLMProvider {
  constructor(providerName) {
    this.providerName = providerName;
  }
  async *streamChat() {
    throw new Error("streamChat is not implemented by provider");
  }
}