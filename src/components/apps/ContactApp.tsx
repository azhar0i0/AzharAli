import { useState } from "react";
import {
  PiEnvelopeSimple,
  PiPhone,
  PiMapPin,
  PiGithubLogoFill,
  PiLinkedinLogoFill,
} from "react-icons/pi";

export function ContactApp() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "bd4a3a0a-b47b-4984-be76-81f284a36b84",
          subject: form.subject || `New message from ${form.name}`,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="space-y-3 border-b border-paper-line bg-secondary/60 p-5 text-sm md:border-b-0 md:border-r">
        <h2 className="text-xl font-semibold tracking-tight text-olive-dark">Let's talk</h2>
        <p className="text-ink-soft">Tell me what you're building. I usually reply within a day.</p>
        <ul className="space-y-2 text-ink">
          <li className="flex items-start gap-2">
            <a href="mailto:azharisworking@gmail.com" className="flex min-w-0 items-start gap-2 underline-offset-4 [overflow-wrap:anywhere] hover:underline">
            <PiEnvelopeSimple className="mt-1 text-orange" />
              azharisworking@gmail.com
            </a>
          </li>
          <li className="flex items-start gap-2">
            <PiPhone className="mt-1 text-orange" />
            +92 329 8892016
          </li>
          <li className="flex items-start gap-2">
            <PiMapPin className="mt-1 text-orange" />
            Bahawalpur, Pakistan
          </li>
        </ul>
        <div className="flex gap-3 pt-2 text-lg text-ink-soft">
          <a href="https://github.com/azhar0i0" target="_blank" rel="noreferrer" aria-label="GitHub" className="transition hover:text-olive-dark"><PiGithubLogoFill /></a>
          <a href="https://www.linkedin.com/in/skibidi-azhar" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition hover:text-olive-dark"><PiLinkedinLogoFill /></a>
        </div>
      </aside>
      <form onSubmit={submit} className="w-full max-w-xl space-y-4 overflow-y-auto p-6 scrollbar-thin">
        <Field label="Name">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your name" />
        </Field>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
        </Field>
        <Field label="Message">
          <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} placeholder="Tell me about your project…" />
        </Field>
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary h-10 w-full px-5 text-sm"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "success" && (
          <div role="status" className="rounded-md border border-online/40 bg-online/10 p-2 text-center text-xs text-ink">
            Message sent. I usually reply within a day.
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-center text-xs text-destructive">
            The message didn't send. Try again, or email azharisworking@gmail.com directly.
          </div>
        )}
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-paper-line bg-paper px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
