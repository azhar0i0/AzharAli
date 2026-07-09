import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from "react-icons/fa";

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
    <div className="grid h-full grid-cols-1 md:grid-cols-[230px_1fr]">
      <aside className="space-y-3 border-b border-paper-line bg-secondary/60 p-5 text-sm md:border-b-0 md:border-r">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">Reach out</div>
        <h2 className="text-lg font-bold text-olive-dark">Let's talk</h2>
        <ul className="space-y-2 text-ink">
          <li className="flex items-start gap-2">
            <a href="mailto:azharisworking@gmail.com" className="hover:underline flex items-start gap-2">
            <FaEnvelope className="mt-1 text-orange" />
              azharisworking@gmail.com
            </a>
          </li>
          <li className="flex items-start gap-2">
            <FaPhone className="mt-1 text-orange" />
            +92 329 8892016
          </li>
          <li className="flex items-start gap-2">
            <FaMapMarkerAlt className="mt-1 text-orange" />
            Bahawalpur, Pakistan
          </li>
        </ul>
        <div className="flex gap-3 pt-2 text-lg text-ink-soft">
          <a href="https://github.com/azhar0i0" target="_blank" rel="noreferrer" className="hover:text-olive-dark"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/skibidi-azhar" target="_blank" rel="noreferrer" className="hover:text-blue"><FaLinkedin /></a>
        </div>
      </aside>
      <form onSubmit={submit} className="space-y-3 overflow-y-auto p-5 scrollbar-thin">
        <Field label="Name">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your name" />
        </Field>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="you@example.com" />
        </Field>
        <Field label="Message">
          <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} placeholder="Tell me about your project…" />
        </Field>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_0_#c56e17] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </motion.button>
        {status === "success" && (
          <div className="rounded-md border border-green-500/40 bg-green-500/10 p-2 text-center text-xs text-green-700">
            Message sent — I'll get back to you soon!
          </div>
        )}
        {status === "error" && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-center text-xs text-destructive">
            Something went wrong. Please try again or email me directly.
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
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
