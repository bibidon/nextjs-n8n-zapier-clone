import { inngest } from "./client";
import prisma from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching", "5s");

    await step.sleep("transcribing", "5s");

    await step.sleep("sending-to-ai", "5s");

    await step.run("create-workflow", async () => {
      await prisma.workflow.create({
        data: {
          name: "Workflow From Inngest",
        },
      });
    });
  },
);
