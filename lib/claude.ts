import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateInterviewQuestions(
  role: string,
  level: string
): Promise<string[]> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Generate exactly 5 interview questions for a ${level} level ${role} candidate. Mix technical and behavioral questions. Return ONLY a valid JSON array of strings, no preamble, no markdown, no explanation. Example format: ["Question 1?", "Question 2?"]`,
      },
    ],
    system: `You are an expert technical interviewer specializing in ${role} positions. Your questions should be practical, relevant, and appropriately challenging for a ${level} level candidate. Always return ONLY valid JSON with no additional text.`,
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const parsed = JSON.parse(content.text.trim());
  if (!Array.isArray(parsed) || parsed.length !== 5) {
    throw new Error("Invalid questions format from AI");
  }
  return parsed;
}

export interface FeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  overallComment: string;
}

export async function evaluateAnswer(
  role: string,
  level: string,
  question: string,
  answer: string
): Promise<FeedbackResult> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Evaluate this candidate answer:\n\nAnswer: "${answer}"`,
      },
    ],
    system: `You are an expert interviewer evaluating a ${level} ${role} candidate.
Question being answered: "${question}"

Return ONLY valid JSON in this exact format, no markdown, no preamble:
{
  "score": <number 1-10>,
  "strengths": [<2-3 specific strength points as strings>],
  "improvements": [<2-3 specific improvement points as strings>],
  "overallComment": "<1-2 sentence overall assessment>"
}`,
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return JSON.parse(content.text.trim()) as FeedbackResult;
}

export interface SessionSummary {
  summary: string;
  topStrength: string;
  topImprovement: string;
  recommendation: "ready" | "needs_practice" | "not_ready";
}

export async function generateSessionSummary(
  role: string,
  level: string,
  scores: number[]
): Promise<SessionSummary> {
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Provide a final assessment for this interview session.`,
      },
    ],
    system: `You are evaluating a completed mock interview.
Role: ${role}, Level: ${level}
Individual scores: ${scores.join(", ")} (Average: ${average.toFixed(1)}/10)

Return ONLY valid JSON in this exact format:
{
  "summary": "<2-3 sentence overall performance summary>",
  "topStrength": "<the candidate's biggest demonstrated strength>",
  "topImprovement": "<the most important area to work on>",
  "recommendation": "<one of: ready|needs_practice|not_ready>"
}`,
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return JSON.parse(content.text.trim()) as SessionSummary;
}
