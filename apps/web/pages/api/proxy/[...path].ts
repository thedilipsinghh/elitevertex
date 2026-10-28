// Next.js API route that proxies requests to the private backend API
// This keeps the actual API URL (API_URL) private – it is never exposed to the client.
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

/**
 * Proxy handler: forwards the incoming request to the backend defined by API_URL.
 * The backend URL is taken from a private environment variable (no NEXT_PUBLIC_ prefix).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query as { path: string[] };
  const backendBase = process.env.API_URL?.replace(/\/+$/, ""); // strip trailing slash
  if (!backendBase) {
    res.status(500).json({ message: "Backend API URL not configured (API_URL)." });
    return;
  }

  // Construct the target URL
  const targetUrl = `${backendBase}/${path.join('/')}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        // Forward most headers, but let the backend decide on auth cookies etc.
        ...req.headers,
        // Remove host header which can cause issues
        host: undefined,
      },
      // For GET/HEAD we don't send a body
      body: req.method && req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const data = await response.buffer();
    // Forward status and headers (excluding hop‑by‑hop headers)
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });
    res.send(data);
  } catch (error: any) {
    console.error("Proxy error", error);
    res.status(502).json({ message: "Proxy request failed", error: error.message });
  }
}
