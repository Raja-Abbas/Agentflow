const MODEL_MAP: Record<string, { provider: string; model: string }> = {
  "GPT-4": { provider: "openai", model: "gpt-4" },
  "GPT-3.5": { provider: "openai", model: "gpt-3.5-turbo" },
  "Claude": { provider: "anthropic", model: "claude-3-sonnet-20240229" },
  "Gemini": { provider: "gemini", model: "gemini-pro" },
};

function getKeys(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("af_llm_keys") || "{}");
  } catch {
    return {};
  }
}

export async function callLLM(
  model: string,
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const modelInfo = MODEL_MAP[model] || MODEL_MAP["GPT-4"];
  const keys = getKeys();
  const history = messages.map((m) => ({ role: m.role === "bot" ? "assistant" : m.role, content: m.content }));

  switch (modelInfo.provider) {
    case "openai": {
      const key = keys["openai"];
      if (!key) throw new Error("OpenAI API key not configured. Add it in Settings > AI Models.");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: modelInfo.model,
          messages: [{ role: "system", content: systemPrompt }, ...history],
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
      const data = await res.json();
      return data.choices[0].message.content;
    }

    case "anthropic": {
      const key = keys["anthropic"];
      if (!key) throw new Error("Anthropic API key not configured. Add it in Settings > AI Models.");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelInfo.model,
          system: systemPrompt,
          messages: history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
          max_tokens: 1024,
        }),
      });
      if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${await res.text()}`);
      const data = await res.json();
      return data.content[0].text;
    }

    case "gemini": {
      const key = keys["gemini"];
      if (!key) throw new Error("Gemini API key not configured. Add it in Settings > AI Models.");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelInfo.model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n" + history.map((m) => `${m.role}: ${m.content}`).join("\n") }] }],
          }),
        }
      );
      if (!res.ok) throw new Error(`Gemini error: ${res.status} ${await res.text()}`);
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    }

    default:
      throw new Error(`Unknown provider: ${modelInfo.provider}`);
  }
}
