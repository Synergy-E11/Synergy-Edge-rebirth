import { createServer } from "node:http";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const APP_ORIGIN = process.env.APP_ORIGIN || "http://127.0.0.1:5500";

const providers = [
  { id: "chatgpt", name: "ChatGPT", env: "OPENAI_API_KEY", role: "Strategy, architecture and project control", url: "https://platform.openai.com/" },
  { id: "claude", name: "Claude", env: "ANTHROPIC_API_KEY", role: "Software engineering and implementation", url: "https://console.anthropic.com/" },
  { id: "gemini", name: "Gemini", env: "GEMINI_API_KEY", role: "Visual research and design intelligence", url: "https://aistudio.google.com/" },
  { id: "perplexity", name: "Perplexity", env: "PERPLEXITY_API_KEY", role: "Web research and source verification", url: "https://www.perplexity.ai/" },
  { id: "deepseek", name: "DeepSeek", env: "DEEPSEEK_API_KEY", role: "Technical review and code analysis", url: "https://platform.deepseek.com/" },
  { id: "grok", name: "Grok", env: "XAI_API_KEY", role: "Trends and innovation research", url: "https://console.x.ai/" },
  { id: "mistral", name: "Mistral", env: "MISTRAL_API_KEY", role: "Operations and documentation", url: "https://console.mistral.ai/" }
];

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
  const origin = req.headers.origin;
  if (origin && origin !== APP_ORIGIN) {
    return send(res, 403, { error: "Origin not allowed." });
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", APP_ORIGIN);
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": APP_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    });
    return res.end();
  }

  const path = new URL(req.url || "/", `http://${HOST}:${PORT}`).pathname;
  if (req.method === "GET" && path === "/api/health") {
    return send(res, 200, { ok: true, service: "synergy-edge-ai-command-centre", mode: "provider-readiness-only" });
  }
  if (req.method === "GET" && path === "/api/providers") {
    // Only report whether a key exists. Never return secret values or key fragments.
    const safeProviders = providers.map(({ env, ...provider }) => ({
      ...provider,
      configured: Boolean(process.env[env]),
      connection: "not-tested"
    }));
    return send(res, 200, { providers: safeProviders });
  }
  return send(res, 404, { error: "Route not found." });
});

server.listen(PORT, HOST, () => {
  console.log(`Synergy Edge AI API listening on http://${HOST}:${PORT}`);
  console.log("Provider endpoint reports key presence only; it does not test or call provider APIs.");
});
