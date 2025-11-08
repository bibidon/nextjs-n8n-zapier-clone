import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {
  // TODO: Publish "loading" state for HTTP request
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request Node: No endpoint configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method!;
    const body = data.body;

    const options: KyOptions = { method, };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      }
    };
  });

  // TODO: Publish "success" state for HTTP request
  return result;
}
