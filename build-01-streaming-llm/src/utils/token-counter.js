export function estimateTokens(text = ""){
    return Math.ceil(text.length/4);
}

export function estimateMessageTokens(messages = []){
    return messages.reduce((total, message)=>{
        return total + estimateTokens(message.content || "");
    },0);
}