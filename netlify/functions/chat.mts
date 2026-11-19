/**
 * Companion chat on Netlify: the same job as the Cloudflare Worker in worker/,
 * running as a Netlify Function on the same site, so the page calls /api/chat
 * with no extra setup.
 *
 * Reads the key from the ANTHROPIC_API_KEY environment variable (Netlify UI →
 * Site configuration → Environment variables, scope must include Functions).
 * Optional: COMPANION_MODEL to use a different Claude model.
 * Without a key it answers in demo mode.
 */
import { DEFAULT_MODEL, claudeReply, demoReply, readMessages } from "../../worker/src/chat"

declare const Netlify: { env: { get(name: string): string | undefined } }

const env = (name: string) => Netlify.env.get(name)?.trim() || undefined

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response("Not found", { status: 404 })
  }

  // Only this site (production, branch and preview deploys) may call it.
  const origin = request.headers.get("Origin")
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return new Response("This site isn't allowed to use the companion.", { status: 403 })
  }

  const messages = await readMessages(request)
  if (!messages) return new Response("Bad request", { status: 400 })

  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
  const apiKey = env("ANTHROPIC_API_KEY")
  if (!apiKey) return new Response(demoReply(messages), { headers })

  return new Response(claudeReply(apiKey, env("COMPANION_MODEL") ?? DEFAULT_MODEL, messages), { headers })
}

export const config = { path: "/api/chat" }
