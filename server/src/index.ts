import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 8787);
createApp().listen(port, () => {
  console.log(`H × K 的小书房 MCP server: http://localhost:${port}/mcp`);
});
