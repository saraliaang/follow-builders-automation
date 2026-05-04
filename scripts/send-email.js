import { Resend } from "resend";
import fs from "fs/promises";
import { marked } from "marked";

const resend = new Resend(process.env.RESEND_API_KEY);

const digestPath = process.argv[2] || "weekly-ai-builder-digest.md";
const toEmail = process.env.TO_EMAIL;

async function main() {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("Missing RESEND_API_KEY");
    }

    if (!toEmail) {
        throw new Error("Missing TO_EMAIL");
    }

    const digest = await fs.readFile(digestPath, "utf8");

    const html = `
    <main style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 720px; margin: 0 auto; padding: 24px;">
        ${marked(digest)}
    </main>
    `;

    const result = await resend.emails.send({
        from: "AI Builder Digest <onboarding@resend.dev>",
        to: [toEmail],
        subject: "Weekly AI Builder Digest",
        text: digest,
        html: html,
    });

    console.log("Email sent:");
    console.log(result);
}

main().catch((error) => {
    console.error("Failed to send email:");
    console.error(error);
    process.exit(1);
});