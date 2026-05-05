const usageLogs = [];

export function addUsageLog(log){
    usageLogs.push({
        ...log,
        timestamp:new Date().toISOString(),
    });
}

export function getUsageSummary(){
    const totalRequests = usageLogs.length;

    const totalInputTokens = usageLogs.reduce((sum,log)=>{
        return sum + log.inputTokens;
    },0)

    const totalOutputTokens = usageLogs.reduce((sum,log)=>{
        return sum  + log.outputTokens;
    },0)

    const totalCost = usageLogs.reduce((sum,log)=>{
        return sum + log.cost;
    },0)

    return {
        totalRequests,
        totalInputTokens,
        totalOutputTokens,
        totalCost,
        logs: usageLogs,
    };

}
