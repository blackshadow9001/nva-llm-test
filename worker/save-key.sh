#!/bin/zsh
# Saves an Anthropic API key for the local Worker (worker/.dev.vars, git-ignored).
# The key is read hidden and never printed.
cd "${0:A:h}" || exit 1
read -s "k?Paste ONLY the key (it starts sk-ant-), then press Return: "
echo
if [[ $k == sk-ant-*sk-ant-* ]]; then
  # Pasted more than once: keep the first copy.
  rest=${k#sk-ant-}; k="sk-ant-${rest%%sk-ant-*}"; unset rest
fi
if [[ $k == sk-ant-* && $k != *[[:space:]]* ]]; then
  printf 'ANTHROPIC_API_KEY=%s\n' "$k" > .dev.vars
  chmod 600 .dev.vars
  echo "Saved"
else
  echo "That doesn't look like a key. It should start sk-ant- with no spaces. Nothing saved; run this again."
fi
unset k
