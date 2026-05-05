import { withRetry } from "../utils/retry.js";

let attemptCount = 0;

async function fakeApiCall() {
  attemptCount++;

  console.log(`Attempt number: ${attemptCount}`);

  if (attemptCount < 3) {
    const error = new Error("Fake provider overloaded");
    error.status = 503;
    throw error;
  }

  return {
    status: "success",
    message: "API call succeeded after retry",
  };
}

try {
  const result = await withRetry(fakeApiCall, {
    maxRetries: 3,
    retryableStatusCodes: [429, 503],
  });

  console.log("Final result:", result);
} catch (error) {
  console.error("Final error:", error.message);
}