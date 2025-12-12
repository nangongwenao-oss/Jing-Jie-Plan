import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Agent, AgentStats, RealmId } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const simulateExperiment = async (
  agent: Agent,
  scenario: string,
  realm: RealmId
): Promise<{ narrative: string; statChanges: Partial<AgentStats> }> => {
  const ai = getClient();
  if (!ai) {
    return {
      narrative: "Simulation failed: API Key missing.",
      statChanges: {}
    };
  }

  const prompt = `
    Roleplay Simulation:
    Agent: ${agent.name} (${agent.historicalContext})
    Current Realm: ${realm}
    Current Stats: Philosophy(${agent.stats.philosophy}), Art(${agent.stats.art}), Science(${agent.stats.science}), Ethics(${agent.stats.ethics}).
    
    Experiment Scenario: "${scenario}"
    
    Task:
    1. Describe how this agent reacts to the scenario within the context of the current realm. Be creative and philosophical. (Max 100 words).
    2. Suggest how their stats might change (increase/decrease) based on this reaction.
    
    Output Format (JSON ONLY):
    {
      "narrative": "...",
      "statChanges": {
        "philosophy": number,
        "art": number,
        "science": number,
        "ethics": number
      }
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return result;

  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return {
      narrative: "The simulation encountered a temporal anomaly (Error calling AI).",
      statChanges: {}
    };
  }
};

export const simulateTraversal = async (
  agent: Agent,
  from: RealmId,
  to: RealmId
): Promise<string> => {
  const ai = getClient();
  if (!ai) return `${agent.name} moved from ${from} to ${to}.`;

  const prompt = `
    Narrate a short mystical or sci-fi transition (1 sentence) for ${agent.name} traveling from the realm of ${from} to ${to}.
    Highlight the clash or fusion of values.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || `${agent.name} has traversed.`;
  } catch (e) {
    return `${agent.name} has traversed safely.`;
  }
};