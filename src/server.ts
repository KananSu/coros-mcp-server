import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getAccessToken } from './coros/api/account.js';
import { setupTools } from './tools/index.js';

async function runServer() {
  const accessToken = await getAccessToken();
  const server = new McpServer({
    name: "coros-mcp-server",
    version: '0.0.1',
  });

  setupTools(server, accessToken);

  const transport = new StdioServerTransport();

  await server.connect(transport);
};

runServer();
