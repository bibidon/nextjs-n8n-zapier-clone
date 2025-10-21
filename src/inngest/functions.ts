import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    console.warn("Executing AI function");
    console.error("The error I want to track");
    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' });

    const { steps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return steps;
  },
);
