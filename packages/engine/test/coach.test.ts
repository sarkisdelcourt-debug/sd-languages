import { describe, expect, it } from "vitest";
import { CONVERSATION_SCENARIOS } from "../../shared/src/scenarios.js";
import { COACH_PHRASES, LocalCoachProvider } from "../src/modules/coach.js";

const coach = new LocalCoachProvider();
const projectUpdate = CONVERSATION_SCENARIOS.find((scenario) => scenario.id === "en-work-project-update")!;

describe("coach local", () => {
  it("corrige « I have finish the report yesterday » tout en faisant avancer le point projet", () => {
    const reply = coach.reply("en", "I have finish the report yesterday.", { scenario: projectUpdate, scenarioStepIndex: 0 });
    expect(reply.learnerMessage.correction).toBe("I finished the report yesterday.");
    expect(reply.learnerMessage.explanation).toContain("prétérit");
    expect(reply.scenarioAdvanced).toBe(true);
    expect(reply.coachMessage.text).toContain("Is anything currently blocking you?");
  });

  it("demande une phrase complète quand la réponse est trop courte, avec un indice et la question", () => {
    const reply = coach.reply("en", "Yes.", { scenario: projectUpdate, scenarioStepIndex: 0 });
    expect(reply.scenarioAdvanced).toBe(false);
    expect(reply.coachMessage.text).toContain("full sentence");
    expect(reply.coachMessage.text).toContain("“completed” or “finished”");
    expect(reply.coachMessage.text).toContain(projectUpdate.openingPrompt);
  });

  it("recentre en reformulant la question courante quand on sort du sujet", () => {
    const reply = coach.reply("en", "The weather is lovely in Marseille today.", { scenario: projectUpdate, scenarioStepIndex: 1 });
    expect(reply.scenarioAdvanced).toBe(false);
    expect(reply.coachMessage.text).toContain("Good progress. Is anything currently blocking you?");
    expect(reply.coachMessage.text).toMatch(/blocked|waiting/);
  });

  it("n'empile pas deux formules d'accord", () => {
    const reply = coach.reply("en", "We are waiting for the new camera.", { scenario: projectUpdate, scenarioStepIndex: 1 });
    expect(reply.coachMessage.text).toBe("I understand. What support would help you move forward?");
  });

  it("suit le thème abordé en conversation libre", () => {
    const reply = coach.reply("en", "I spent the whole day at the hospital with difficult patients.");
    expect(reply.coachMessage.text).toContain("You mentioned “hospital”");
    expect(reply.coachMessage.text).toMatch(/work|job|day/);
  });

  it("ne signale rien quand la phrase est correcte", () => {
    const reply = coach.reply("en", "I finished the report yesterday, and I sent it to the team.", { scenario: projectUpdate, scenarioStepIndex: 0 });
    expect(reply.learnerMessage.correction).toBeUndefined();
    expect(reply.scenarioAdvanced).toBe(true);
  });
});

describe("coach allemand (21/10/2026)", () => {
  it("tutoie partout : aucune forme de politesse « Sie » ne subsiste", () => {
    const messages = Object.values(COACH_PHRASES.de).flatMap((value) => typeof value === "function" ? [value(["Beispiel"])] : [value].flat());
    expect(messages.length).toBeGreaterThan(5);
    for (const message of messages) expect(message, message).not.toMatch(/\b(Sie|Ihnen|Ihre?|Wählen Sie)\b/u);
  });
});
