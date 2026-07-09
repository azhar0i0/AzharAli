import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import avatar from "@/assets/avatar.jpg";
import { useWindowStore } from "@/lib/desktop/store";

const ROLES = [
  "React Developer",
  "Next.js Developer",
  "Full Stack Developer",
  "Frontend Engineer",
  "UI Developer",
];

function useTyping(words: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i];
    const speed = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setI((v) => (v + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, words]);
  return text;
}

export function HomeApp() {
  const typed = useTyping(ROLES);
  const open = useWindowStore((s) => s.open);
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-8 scrollbar-thin">
      <div className="flex items-start gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative shrink-0"
        >
          <div className="absolute -inset-1 rounded-full bg-orange/30 blur-md" />
          <img
            src={avatar}
            alt="Azhar Ali"
            width={112}
            height={112}
            className="relative h-28 w-28 rounded-full border-2 border-olive-dark object-cover"
          />
          <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-paper bg-green-500" />
        </motion.div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            &gt; whoami
          </div>
          <h1 className="mt-1 font-sans text-4xl font-bold tracking-tight text-olive-dark">
            Azhar Ali
          </h1>
          <div className="mt-2 h-7 font-mono text-lg text-orange">
            {typed}
            <span className="ml-0.5 inline-block h-5 w-2 translate-y-0.5 animate-pulse bg-orange" />
          </div>
        </div>
      </div>

      <p className="max-w-prose leading-relaxed text-ink">
        I create beautiful, functional, and user-centered digital experiences.
        Over 2+ years of building web and mobile products — transforming ideas
        into elegant, scalable applications with modern tech and thoughtful
        design.
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-paper-line bg-card p-3">
          <div className="flex items-center gap-2 text-ink-soft">
            <FaMapMarkerAlt /> Location
          </div>
          <div className="mt-1 font-medium">Bahawalpur, Pakistan</div>
        </div>
        <div className="rounded-md border border-paper-line bg-card p-3">
          <div className="flex items-center gap-2 text-ink-soft">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Status
          </div>
          <div className="mt-1 font-medium">Available for freelance</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => open("contact")}
          className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_0_#c56e17] transition hover:-translate-y-0.5 hover:shadow-[0_4px_0_#c56e17]"
        >
          Hire Me
        </button>
        <button
          onClick={() => open("resume")}
          className="rounded-md border border-olive-dark bg-paper px-4 py-2 text-sm font-semibold text-olive-dark transition hover:bg-olive-dark hover:text-paper"
        >
          View Resume
        </button>
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-paper-line pt-4 text-lg text-ink-soft">
        <a
          className="transition hover:-translate-y-0.5 hover:text-olive-dark"
          href="https://github.com/azhar0i0"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </a>
        <a
          className="transition hover:-translate-y-0.5 hover:text-blue"
          href="https://www.linkedin.com/in/skibidi-azhar"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          className="transition hover:-translate-y-0.5 hover:text-orange"
          href="mailto:azharisworking@gmail.com"
        >
          <FaEnvelope />
        </a>
      </div>
    </div>
  );
}
