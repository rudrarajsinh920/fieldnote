import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, config.host, () => {
  console.log(`🌿 FIELDNOTE Server running on http://${config.host}:${config.port}`);
  console.log(`🤖 AI Provider Target: ${config.ollama.baseUrl} (Model: ${config.ollama.modelName})`);
});
