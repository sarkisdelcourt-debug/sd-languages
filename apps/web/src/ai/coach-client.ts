import Anthropic from "@anthropic-ai/sdk";
import {
  COACH_MAX_TOKENS, COACH_MODEL, COACH_SCHEMA, addUsage, budgetAllows, buildSystemPrompt, buildUserMessage,
  estimateCostUsd, parseAiReply, type AiCoachContext, type AiCoachReply, type AiUsage
} from "@engine/modules/ai-coach";
import { store } from "../local/device";

import { AI_NOTICE_EVENT, USAGE_KEY, hasUsableKey, loadAiSettings, loadAiUsage, type AiSettings } from "./settings";

/** Appels à Claude Haiku (chargé à la demande : le SDK est volumineux). Réglages et clé : settings.ts. */

/** Message d'erreur en français, sans jamais afficher la clé. */
export function describeAiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "Clé API refusée : vérifiez qu'elle est complète et active (console.anthropic.com → API keys).";
  if (error instanceof Anthropic.PermissionDeniedError) return "Cette clé n'a pas le droit d'utiliser ce modèle.";
  if (error instanceof Anthropic.RateLimitError) return "Trop de requêtes pour l'instant : réessayez dans un instant.";
  if (error instanceof Anthropic.BadRequestError) {
    const message = String((error as { message?: string }).message ?? "");
    return /credit/i.test(message)
      ? "Crédits API épuisés : rechargez votre solde sur console.anthropic.com (Plans & Billing)."
      : `Demande refusée par l'API : ${message.slice(0, 160)}`;
  }
  if (error instanceof Anthropic.APIConnectionError) return "Pas de connexion à l'API Anthropic (réseau coupé ?).";
  if (error instanceof Anthropic.InternalServerError) return "Le service Anthropic est momentanément indisponible.";
  return "Réponse IA inutilisable.";
}

const clientFor = (apiKey: string) => new Anthropic({ apiKey: apiKey.trim(), dangerouslyAllowBrowser: true, maxRetries: 0, timeout: 10_000 });

/** Lecture + écriture du cumul sous verrou : cinq appels simultanés comptent tous, pas un seul (audit du 26/10/2026). */
async function recordUsage(costUsd: number) {
  const write = async () => store.setMeta(USAGE_KEY, addUsage(await loadAiUsage(), costUsd, new Date()));
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  if (locks) await locks.request("sd-languages-ai-usage", write);
  else await write();
}

export interface AiCall {
  reply?: AiCoachReply;
  /** Raison lisible quand l'IA n'a pas répondu et que le coach local prend le relais. */
  fallbackReason?: string;
}

/**
 * Demande une réponse à Haiku. Ne lève jamais : en cas de clé absente, de plafond atteint, de coupure
 * réseau ou de réponse invalide, renvoie la raison et laisse le coach local répondre.
 */
export async function askCoach(context: AiCoachContext, settings?: AiSettings): Promise<AiCall> {
  const current = settings ?? await loadAiSettings();
  if (!hasUsableKey(current)) return {};
  if (!budgetAllows(await loadAiUsage(), current.monthlyCapUsd, new Date())) {
    return { fallbackReason: `Plafond mensuel de ${current.monthlyCapUsd.toFixed(2)} $ atteint : coach local pour le reste du mois.` };
  }
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { fallbackReason: "Hors ligne : coach local." };
  }
  try {
    const response = await clientFor(current.apiKey).messages.create({
      model: COACH_MODEL,
      max_tokens: COACH_MAX_TOKENS,
      system: buildSystemPrompt(context),
      messages: [{ role: "user", content: buildUserMessage(context) }],
      // Conversation courte : effort bas et réflexion désactivée (autorisée jusqu'à l'effort « high »).
      thinking: { type: "disabled" },
      output_config: { effort: "low", format: { type: "json_schema", schema: COACH_SCHEMA as unknown as Record<string, unknown> } }
    });
    await recordUsage(estimateCostUsd(response.usage));
    if (response.stop_reason === "refusal") return { fallbackReason: "L'IA a décliné cette demande : coach local." };
    const text = response.content.find((block) => block.type === "text");
    const reply = parseAiReply(text && text.type === "text" ? text.text : undefined);
    // Une réponse IA réussie efface le bandeau « coach IA non utilisé » laissé par un échec précédent.
    if (reply && typeof window !== "undefined") window.dispatchEvent(new CustomEvent(AI_NOTICE_EVENT, { detail: "" }));
    return reply ? { reply } : { fallbackReason: "Réponse IA inutilisable : coach local." };
  } catch (error) {
    return { fallbackReason: `${describeAiError(error)} Coach local en attendant.` };
  }
}

/** Appel minimal pour le bouton « Tester la connexion » ; renvoie un message prêt à afficher. */
export async function testConnection(apiKey: string): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await clientFor(apiKey).messages.create({
      model: COACH_MODEL,
      max_tokens: 40,
      messages: [{ role: "user", content: "Say hello in one short English sentence." }],
      thinking: { type: "disabled" },
      output_config: { effort: "low" }
    });
    await recordUsage(estimateCostUsd(response.usage));
    const text = response.content.find((block) => block.type === "text");
    return { ok: true, message: `Connexion réussie. Haiku répond : « ${text && text.type === "text" ? text.text.trim().slice(0, 80) : "…"} »` };
  } catch (error) {
    return { ok: false, message: describeAiError(error) };
  }
}

