import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from "react-icons/fa";

export function ContactApp() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `From: ${form.name} <${form.email}>%0D%0A%0D%0A${encodeURIComponent(form.message)}`;
    window.location.href = `mailto:azharisworking@gmail.com?subject=${encodeURIComponent(form.subject || "Hello Azhar")}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
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
        <Field label="Subject">
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls} placeholder="Project idea" />
        </Field>
        <Field label="Message">
          <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputCls} resize-none`} placeholder="Tell me about your project…" />
        </Field>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_0_#c56e17] transition hover:-translate-y-0.5"
        >
          Send Message
        </motion.button>
        {sent && (
          <div className="rounded-md border border-green-500/40 bg-green-500/10 p-2 text-center text-xs text-green-700">
            Opening your mail client…
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
