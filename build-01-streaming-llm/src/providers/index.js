import { GroqProvider } from "./groq.js";
import {config } from "../config.js";
const providers = {
    groq:new GroqProvider(),
};

export function getProvider(providerName = config.defaultProvider){
    const provider = providers[providerName];
    if(!provider){
        throw new Error(`Unsupported Provider: ${providerName}`)
    }
    return provider;
}

export function getDefaultModel(providerName = config.defaultProvider
){
    switch (providerName) {
        case "groq":
            return config.defaultGroqModel;
        case "openai":
            return config.defaultOpenAIModel;
        case "anthropic":
            return config.defaultAnthropicModel;
        default:
            throw new Error(`Unsupported Provider: ${providerName}`)
    }
}