import { createWriteStream, rmSync } from "node:fs";
import { mastra } from "./mastra/index";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(dirname(import.meta.url));

const outputFile = join(__dirname, "agent.txt");
try {
  rmSync(outputFile);
} catch {}
const agent = mastra.getAgent("weatherAgent");
const response = await agent.streamVNext("What is the weather in Tokyo?", {
  format: "aisdk",
});

const [_originalStream, textStream] = response.textStream.tee();

const writer = createWriteStream(outputFile);
for await (const chunk of textStream) {
  await writer.write(
    "======================== CHUNK =======================\n"
  );
  await writer.write(chunk);
  await writer.write("\n");
}

writer.write(
  "\n\n\n======================== FULL STREAM =======================\n\n\n"
);

for await (const chunk of response.fullStream) {
  await writer.write(
    "======================== CHUNK =======================\n"
  );
  await writer.write(JSON.stringify(chunk, null, 2));
  await writer.write("\n");

  if (chunk.type === "tool-call-suspended") {
    const resumedResponse = await agent.resumeStreamVNext(
      {},
      { runId: response.runId }
    );
    for await (const chunk of resumedResponse.fullStream) {
      writer.write(
        "======================== RESUMED CHUNK =======================\n"
      );
      writer.write(JSON.stringify(chunk, null, 2));
      writer.write("\n");
    }
  }
}

await writer.end();

const outputWorkflowFile = join(__dirname, "workflow.txt");
try {
  rmSync(outputWorkflowFile);
} catch {}

const workflow = mastra.getWorkflow("weatherWorkflow");
const run = await workflow.createRunAsync();

const workflowResponse = await run.streamVNext({
  inputData: {
    city: "Tokyo",
  },
});

const writerWorkflow = createWriteStream(outputWorkflowFile);

for await (const chunk of workflowResponse) {
  await writerWorkflow.write(JSON.stringify(chunk, null, 2));
  await writerWorkflow.write("\n");
}
