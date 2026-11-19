# ACME prototype · React

Flow 1e (photo-first intake, screens IS00–IS09) from the Claude Design canvas
"Waffles 2.0", built with Vite, React and shadcn/ui.

## Run it

```bash
npm install
npm run dev
```

Screens live at `#/is00` … `#/is09`.

## How it's put together

- `src/styles/tokens.css`: the Syrup Design System tokens, copied unchanged from
  the canvas (`ds/shad/tokens.css`). They are the shadcn theme; `src/index.css`
  only maps them to Tailwind.
- `src/components/ui/`: shadcn components. Button (large size, outline shadow)
  and Switch (large size) are adjusted to match Syrup.
- `src/flow1e/`: the flow. `parts.tsx` holds shared pieces (hero, top bar, sheet,
  profile card), `screens/` holds one file per screen, `flow1e.css` holds the
  surfaces and motion that aren't in the design system yet.

## Companion chat (live AI)

`#/companion` is the desktop companion home with a working chat bar. The page
can't hold an AI key (anyone can read a static site's files), so the chat goes
through a small Cloudflare Worker in `worker/` that holds the key, checks each
request and streams Claude's reply back.

- The companion's brief (tone, boundaries, Waffles' demo data) is in
  `worker/src/companion.ts`.
- Guard rails: only this site may call it, conversations are capped at 20
  messages of 1,500 characters, replies at about 1,200 tokens. Set a monthly
  spending limit on the Anthropic account as well.
- Without a key the Worker answers in demo mode, so it can be tested for free.

Run it locally (two terminals):

```bash
cd worker && npm install && npm run dev
```

```bash
npm run dev
```

For real answers locally, create `worker/.dev.vars` containing
`ANTHROPIC_API_KEY=...` (it's git-ignored). To go live: `cd worker`,
`npx wrangler login`, `npx wrangler secret put ANTHROPIC_API_KEY`,
`npm run deploy`, then add the Worker's address as the repo variable
`COMPANION_URL` and re-run the Pages deploy.

### On Netlify

Netlify runs the same chat as a Netlify Function (`netlify/functions/chat.mts`)
at `/api/chat` on the site itself, so no Worker is needed there:

1. Netlify UI → Site configuration → Environment variables → add
   `ANTHROPIC_API_KEY` with scope **Functions** (or All scopes).
2. Leave `VITE_COMPANION_URL` unset on Netlify.
3. Deploys → Trigger deploy → **Clear cache and deploy site**.

The chat logic shared by the Worker and the function is in `worker/src/chat.ts`.

## Workflow

- Work on a branch, open a pull request. CI type-checks and builds every PR.
- The design canvas is the starting point, not a live source: changes made here
  don't flow back to Claude Design.
- Merging into `main` publishes the prototype to
  https://rich-bas.github.io/nva-react-prototype/ (about a minute).
  `Deploy to GitHub Pages` can also be run by hand from the Actions tab.
