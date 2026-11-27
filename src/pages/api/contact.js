import { Resend } from "resend";
import { RESEND_API_KEY, CONTACT_TO_EMAIL } from "astro:env/server";

export const prerender = false;

export async function POST({ request, redirect }) {
    const formData = await request.formData();

    if (formData.get("website")) {
        return redirect("/thanks", 303);
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (
        !name ||
        !emailLooksValid ||
        !message ||
        name.length > 100 ||
        message.length > 2000
    ) {
        return redirect("/error", 303);
    }

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
        console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
        return redirect("/error", 303);
    }

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
        from: "Website Contact <onboarding@resend.dev>",
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: "New website contact message",
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
        console.error(error);
        return redirect("/error", 303);
    }

    return redirect("/thanks", 303);
}
