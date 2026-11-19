/**
 * The claude.ai Artifact runtime. When this page is published as an Artifact,
 * claude.ai gives it `window.claude.use(name)`, which hands back built-in
 * features (asking Claude, dictation) with no API key. Anywhere else it's
 * missing, and every feature resolves to null.
 */

export type SampleError = { code: string; message: string; text?: string }
type Turn = { role: "user" | "assistant"; content: string }

export type Sample = (
  input: string | Turn[],
  options?: {
    onText?: (u: { text: string; delta: string }) => void
    signal?: AbortSignal
    modelTier?: "quick" | "default" | "complex"
    cache?: boolean
  },
) => Promise<{ text: string; truncated: boolean }>

export type Dictation = {
  start(options?: { language?: string }): Promise<void>
  stop(): Promise<void>
  onPartial(fn: (e: { text: string }) => void): () => void
  onFinal(fn: (e: { text: string }) => void): () => void
  onState(fn: (e: { state: "idle" | "starting" | "listening" | "finishing"; reason?: string }) => void): () => void
}

type Runtime = { use(name: string): Promise<unknown> }

function capability<T>(name: string): Promise<T | null> {
  const runtime = (window as unknown as { claude?: Runtime }).claude
  if (!runtime?.use) return Promise.resolve(null)
  return runtime.use(name).then((x) => (x ?? null) as T | null, () => null)
}

export const sampleReady = capability<Sample>("sample")
export const dictationReady = capability<Dictation>("dictation")
