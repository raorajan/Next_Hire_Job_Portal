const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    "[Gemini] WARNING: GOOGLE_GENERATIVE_AI_API_KEY is not set. All AI features will use fallback responses."
  );
}

// Single shared genAI instance — reused across the entire application
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Get a Gemini model configured for plain text generation.
 * @param {string} modelName - e.g. "gemini-2.5-flash"
 */
const getTextModel = (modelName = "gemini-2.5-flash") => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Get a Gemini model configured to return strict JSON output.
 * Eliminates all need for markdown regex cleanup.
 * @param {string} modelName - e.g. "gemini-2.5-flash"
 */
const getJsonModel = (modelName = "gemini-2.5-flash") => {
  if (!genAI) return null;
  return genAI.getGenerativeModel(
    { model: modelName },
    { apiVersion: "v1beta" }
  );
};

/**
 * Generate content from a prompt and return parsed JSON.
 * Uses responseMimeType to guarantee valid JSON from the API.
 * Falls back gracefully if no API key is configured.
 *
 * @param {string} prompt
 * @param {*} fallback - value to return if AI is unavailable or fails
 * @returns {Promise<*>} parsed JSON value
 */
const generateJson = async (prompt, fallback) => {
  if (!genAI) return fallback;

  const model = genAI.getGenerativeModel(
    { model: "gemini-2.5-flash" },
    { apiVersion: "v1beta" }
  );

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  const responseText = result.response.text().trim();
  return JSON.parse(responseText);
};

module.exports = { genAI, getTextModel, getJsonModel, generateJson };
