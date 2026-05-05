import Redis from "ioredis";
import { config } from "../config.js";
const redis = new Redis(config.redisUrl)

const SESSION_TTL_SECONDS = 60 * 60 * 24;

function getSessionKey(sessionId){
    return `chat:session:${sessionId}`;
}

export async function getMessages(sessionId){
    const key = getSessionKey(sessionId);

    const data = await redis.get(key);

    if(!data){
        return [];
    }
    return JSON.parse(data)
    
}

export async function saveMessages(sessionId,message){

    const key = getSessionKey(sessionId)

    await redis.set(
        key,
        JSON.stringify(message),
        "EX",
        SESSION_TTL_SECONDS,
    )

    return message;

}



export async function clearMessages(sessionId) {
    const key = getSessionKey(sessionId)

    await redis.del(key)

    return true;

}