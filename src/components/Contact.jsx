import React, { useState } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "bd4a3a0a-b47b-4984-be76-81f284a36b84",
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setToast({ message: "✔  Message sent successfully!", type: "success" });
        setForm({ name: "", email: "", message: "" });
      } else {
        setToast({ message: "✘  Failed to send message. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "!  An error occurred. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <section className="contact" id="contact">
      {/* Toast Notification */}
      {toast && (
        <motion.div
          className={`custom-toast ${toast.type}`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
        >
          {toast.message}
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.p className="text-primary fw-bold mb-1" variants={item}>
          CONTACT
        </motion.p>
        <motion.h1 variants={item}>Get in Touch with Us</motion.h1>
        <motion.hr variants={item} />

        <motion.div className="contact-content" variants={container}>
          {/* Info Section */}
          <motion.div className="contact-info" variants={item}>
            <motion.p variants={item}>
              I'm always open to discuss exciting projects and new opportunities.
              Let's collaborate!
            </motion.p>

            <motion.div className="contact-details" variants={item}>
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>azharisworking@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>+92 329 8892016</span>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Bahawalpur, Pakistan</span>
              </div>
            </motion.div>

            <motion.div className="social-links" variants={item}>
              <a
                className="social-link"
                href="https://github.com/azhar0i0"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a
                className="social-link"
                href="https://www.linkedin.com/in/skibidi-azhar/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a
                className="social-link"
                href="https://api.whatsapp.com/send?phone=923298892016&text=Hi%2C%20their%20I%27m%20here%20from%20your%20portfolio%20website%20%0A"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </motion.div>
          </motion.div>

          {/* Form Section */}
          <motion.div className="contact-form" variants={item}>
            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button type="submit" className="btn-send" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
