import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { chatRoute, WokflowStreamToAISDKTransformer } from "@mastra/ai-sdk";
import { DefaultStorage } from "@mastra/libsql";

// @ts-ignore
globalThis.___MASTRA_TELEMETRY___ = true;

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  storage: new DefaultStorage({
    url: "file:./mastra.db",
  }),
  server: {
    apiRoutes: [chatRoute({ agent: "weatherAgent", path: "/chat" })],
  },
});
