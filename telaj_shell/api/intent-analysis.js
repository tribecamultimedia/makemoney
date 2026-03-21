const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

function dedupeList(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function normalizeText(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeList(value, fallback = []) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()).slice(0, 4) : fallback;
}

function normalizeAnalysis(raw, fallbackText = "") {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  return {
    heard: normalizeText(raw.heard, fallbackText || "The user described a personal financial motivation."),
    priorityTags: normalizeList(raw.priorityTags),
    cautionTags: normalizeList(raw.cautionTags),
    makesSense: normalizeText(raw.makesSense, "TELAJ sees a usable motivation it can convert into structured guidance."),
    critique: normalizeText(raw.critique, "TELAJ still wants to pressure-test timing, liquidity, and concentration."),
    optimizeFor: normalizeText(raw.optimizeFor, "disciplined long-term allocation"),
    watchout: normalizeText(raw.watchout, "Forcing moves too early"),
  };
}

function analyzeIntentNotes(notes, profiles) {
  const text = typeof notes === "string" ? notes.trim() : "";
  if (!text) {
    return null;
  }

  const normalized = text.toLowerCase();
  const household = profiles?.householdProfile || {};
  const behavior = profiles?.behaviorProfile || {};
  const goals = profiles?.goalProfile || {};

  const priorityTags = [];
  const cautionTags = [];
  const reasons = [];
  const risks = [];
  const optimizeFor = [];

  if (/(child|children|family|daughter|son|wife|husband|spouse|parent)/.test(normalized)) {
    priorityTags.push("Family-first");
    optimizeFor.push("household stability");
  }
  if (/(home|house|property|real estate|rental|rent)/.test(normalized)) {
    priorityTags.push("Real-estate intent");
    optimizeFor.push("property readiness");
  }
  if (/(income|cash flow|monthly|rent|dividend)/.test(normalized)) {
    priorityTags.push("Income focus");
    optimizeFor.push("durable cash flow");
  }
  if (/(legacy|future|generation|children|inherit)/.test(normalized)) {
    priorityTags.push("Legacy orientation");
    optimizeFor.push("long-duration family capital");
  }
  if (/(safe|safety|protect|emergency|reserve|buffer|stability)/.test(normalized)) {
    priorityTags.push("Safety-first");
    optimizeFor.push("reserve strength");
  }
  if (/(grow|growth|compound|long term|long-term|wealth)/.test(normalized)) {
    priorityTags.push("Growth intent");
    optimizeFor.push("measured compounding");
  }

  if (/(crypto|options|meme|gamble|bet|leverage|yolo)/.test(normalized)) {
    cautionTags.push("Speculation risk");
    risks.push("The motivation includes language that sounds closer to speculation than disciplined allocation.");
  }
  if (/(fast|quick|urgent|asap|get rich|rich quick)/.test(normalized)) {
    cautionTags.push("Speed pressure");
    risks.push("The goal may be pushing for speed in a way that can weaken discipline.");
  }
  if (/(fear|afraid|anxious|stress|panic)/.test(normalized)) {
    cautionTags.push("Emotional pressure");
    risks.push("Emotional stress is part of the decision environment, so TELAJ should stay more conservative.");
  }
  if (/(debt|loan|mortgage|owe)/.test(normalized)) {
    cautionTags.push("Debt sensitivity");
    optimizeFor.push("debt pressure control");
  }

  if (goals?.primaryGoal === "safety") {
    reasons.push("Your structured profile already says safety comes first, and the written motivation supports that.");
  } else if (goals?.primaryGoal === "growth") {
    reasons.push("Your notes point toward growth, but TELAJ will still filter growth through liquidity and discipline.");
  } else if (goals?.primaryGoal === "legacy") {
    reasons.push("Your motivation reads like long-duration family planning rather than short-term performance chasing.");
  }

  if (household?.liquidityProfile === "very-low") {
    risks.push("The household profile still shows weak liquidity, so good goals can still be mistimed.");
  }
  if (household?.primaryResidenceStatus === "own-mortgage" && household?.primaryHomeDebtRate === "high") {
    risks.push("A higher-cost primary-home mortgage may deserve attention before optional new risk.");
  }
  if (behavior?.weakness === "fomo") {
    cautionTags.push("FOMO guardrail");
    risks.push("Your behavior profile suggests TELAJ should challenge excitement-driven decisions more aggressively.");
  } else if (behavior?.weakness === "overspending") {
    cautionTags.push("Spending control");
    risks.push("Lifestyle leakage can quietly overpower even good allocation goals.");
  }

  const heard = text.length > 220 ? `${text.slice(0, 217).trim()}...` : text;
  const makesSense =
    reasons[0] ||
    "The motivation is usable and TELAJ can translate it into a calmer allocation posture rather than generic finance advice.";
  const critique =
    risks[0] ||
    "The goal sounds valid, but TELAJ will still pressure-test timing, liquidity, and concentration before endorsing action.";
  const optimize =
    dedupeList(optimizeFor)[0] ||
    (goals?.recommendedPosture === "Reserves first" ? "household resilience" : "disciplined long-term allocation");
  const watchout =
    dedupeList(cautionTags)[0] ||
    (behavior?.riskBehavior === "Fragile under stress" ? "Stress reactions under drawdown" : "Forcing moves too early");

  return {
    heard,
    priorityTags: dedupeList(priorityTags).slice(0, 4),
    cautionTags: dedupeList(cautionTags).slice(0, 4),
    makesSense,
    critique,
    optimizeFor: optimize,
    watchout,
  };
}

function buildPrompt(notes, profiles) {
  return [
    "You are TELAJ, a calm family wealth operating system.",
    "Analyze the user's motivation notes and respond ONLY as JSON.",
    "Do not hype, do not moralize, do not encourage speculation.",
    "Return these keys only: heard, priorityTags, cautionTags, makesSense, critique, optimizeFor, watchout.",
    "priorityTags and cautionTags must be arrays of short strings.",
    "The tone must be pragmatic, structured, and protective of household stability.",
    "",
    `Structured profiles: ${JSON.stringify(profiles)}`,
    `User notes: ${notes}`,
  ].join("\n");
}

async function callOpenAI(notes, profiles) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const model = process.env.OPENAI_MODEL || process.env.TELAJ_INTENT_MODEL || "gpt-4.1-mini";
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are TELAJ, a calm family wealth operating system. Return only valid JSON matching the requested keys.",
        },
        {
          role: "user",
          content: buildPrompt(notes, profiles),
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned no content");
  }

  return normalizeAnalysis(JSON.parse(content), notes);
}

async function callGemini(notes, profiles) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const model = process.env.GEMINI_MODEL || process.env.TELAJ_INTENT_MODEL || "gemini-2.5-flash";
  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${buildPrompt(notes, profiles)}\n\nReturn valid JSON only.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini error ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Gemini returned no content");
  }

  return normalizeAnalysis(JSON.parse(content), notes);
}

async function runModelAnalysis(notes, profiles) {
  const provider = (process.env.TELAJ_MODEL_PROVIDER || "").toLowerCase();

  if (provider === "openai" || (!provider && process.env.OPENAI_API_KEY)) {
    return {
      source: "openai",
      analysis: await callOpenAI(notes, profiles),
    };
  }

  if (provider === "gemini" || (!provider && process.env.GEMINI_API_KEY)) {
    return {
      source: "gemini",
      analysis: await callGemini(notes, profiles),
    };
  }

  return {
    source: "heuristic",
    analysis: analyzeIntentNotes(notes, profiles),
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { notes, profiles } = req.body || {};
  if (typeof notes !== "string" || !notes.trim()) {
    res.status(400).json({ error: "Missing notes" });
    return;
  }

  try {
    const result = await runModelAnalysis(notes, profiles);
    res.status(200).json(result);
  } catch (error) {
    const fallback = analyzeIntentNotes(notes, profiles);
    res.status(200).json({
      source: "heuristic-fallback",
      analysis: fallback,
      error: error instanceof Error ? error.message : "Intent analysis fallback",
    });
  }
};
