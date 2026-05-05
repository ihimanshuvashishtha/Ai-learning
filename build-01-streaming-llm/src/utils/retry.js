function sleep(ms){
    return new Promise((resolve)=>setTimeout(resolve,ms));
}

export async function withRetry(operation, options={}){
    const maxRetries = options.maxRetries || 3;
    const retryableStatusCodes = options.retryableStatusCodes || [429,503];

    let lastError;
    for(let attempt = 0; attempt <=maxRetries; attempt++){
        try{
            return await operation();
        }catch(error){
            lastError = error;

            const statusCode = error.status || error.statusCode;

            const shouldRetry = retryableStatusCodes.includes(statusCode) && attempt < maxRetries;

            if (!shouldRetry){
                throw error;
            }
            const delayMs = Math.pow(2,attempt)*1000;
            await sleep(delayMs);
        }
    }
    throw lastError
}