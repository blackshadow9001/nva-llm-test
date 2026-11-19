/**
 * The companion chat itself: checks a conversation, asks Claude, and streams
 * the reply back as plain text. Shared by both hosts:
 *   - worker/src/index.ts           (Cloudflare Worker, used by GitHub Pages)
 *   - netlify/functions/chat.mts    (Netlify Function, used by the Netlify site)
 */
import Anthropic from "@anthropic-ai/sdk"
import { COMPANION_BRIEF } from "./companion"

// Guard rails so a public link can't run up a large bill.
export const MAX_TURNS = 20 // messages per conversation
const MAX_CHARS = 1500 // per message
const MAX_REPLY_TOKENS = 1200

export const DEFAULT_MODEL = "claude-opus-5-5"

export type Turn = { role: "user" | "assistant"; content: string }

/** Accept only a short, well-formed conversation that ends with the user. */
export async function readMessages(request: Request): Promise<Turn[] | null> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return null
  }
  const list = (body as { messages?: unknown })?.messages
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_TURNS) return null

  const turns: Turn[] = []
  for (const [i, m] of list.entries()) {
    const role = (m as Turn)?.role
    const content = (m as Turn)?.content
    const expected = i % 2 === 0 ? "user" : "assistant"
    if (role !== expected || typeof content !== "string") return null
    const text = content.trim().slice(0, MAX_CHARS)
    if (!text) return null
    turns.push({ role, content: text })
  }
  return turns.at(-1)?.role === "user" ? turns : null
}

/** Ask Claude and stream the text of its reply. */
export function claudeReply(apiKey: string, model: string, messages: Turn[]): ReadableStream<Uint8Array> {
  const client = new Anthropic({ apiKey })
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = client.beta.messages.stream({
          model,
          max_tokens: MAX_REPLY_TOKENS,
          // Chat: short, friendly replies, so low effort keeps it quick.
          output_config: { effort: "low" },
          // If a safety check declines, let the API retry on a fallback model.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system: [{ type: "text", text: COMPANION_BRIEF, cache_control: { type: "ephemeral" } }],
          messages,
        })

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }

        const final = await stream.finalMessage()
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nI can't help with that one here. For anything about Waffles' health, Dr. Ruiz's team is the best people to ask."))
        }
      } catch (err) {
        const status = err instanceof Anthropic.APIError ? err.status : "network"
        console.error("Claude request failed", status, err)
        controller.enqueue(encoder.encode("Sorry, I couldn't answer just now. Please try again in a moment."))
      } finally {
        controller.close()
      }
    },
  })
}

/** Canned reply, streamed word by word, used when no AI key is set. */
export function demoReply(messages: Turn[]): ReadableStream<Uint8Array> {
  const question = messages.at(-1)!.content
  const reply = `Demo mode (no AI key set yet). You asked: "${question}". Once the key is added, I'll answer this properly, knowing Waffles is a 12-week Golden Retriever with her second puppy shots on Tuesday.`
  const words = reply.split(/(?<= )/)
  const encoder = new TextEncoder()
  return new ReadableStream({
    async pull(controller) {
      const next = words.shift()
      if (next === undefined) return controller.close()
      await new Promise((r) => setTimeout(r, 35))
      controller.enqueue(encoder.encode(next))
    },
  })
}
