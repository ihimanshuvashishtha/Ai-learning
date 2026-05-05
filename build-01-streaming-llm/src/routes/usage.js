import { getUsageSummary } from "../middleware/usage-tracker.js"


export async function usageRoutes(app){
    app.get('/api/usage',async()=>{
        return getUsageSummary();
    })


}
