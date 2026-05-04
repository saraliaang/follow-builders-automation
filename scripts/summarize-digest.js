import OpenAI from "openai";
import fs from "fs/promises";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const inputPath = process.argv[2] || "digest-raw.json";
const outputPath = process.argv[3] || "weekly-ai-builder-digest.md";

async function main() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY");
    }

    const raw = await fs.readFile(inputPath, "utf8");
    const feed = JSON.parse(raw);

    const prompt = `
Turn this JSON into a clean weekly AI builder digest.

Make it beginner-friendly and format it like a Notion note.

Include:
- Key takeaway
- Builder updates
- Product/agent trends
- Links to save
- My reflection questions

Style:
- Be selective, not exhaustive.
- Write like a smart friend briefing me.
- Skip low-value posts, personal updates, vague teasers, and “nothing notable” sections.
- Do not summarize every builder.
- Only include builders with useful insights.
- Put useful links only in the "Links to save" section.
- Explain technical ideas simply.
- Prioritize AI agents, coding tools, product thinking, model updates, and career-relevant insights.
- Synthesize themes instead of listing posts one by one.

Raw JSON:
${JSON.stringify(feed)}
`;

    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        input: prompt,
    });

    await fs.writeFile(outputPath, response.output_text, "utf8");
    console.log(`Digest saved to ${outputPath}`);
}

main().catch((error) => {
    console.error("Failed to summarize digest:");
    console.error(error);
    process.exit(1);
});