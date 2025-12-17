// src/components/Footer.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="footer relative z-50 bg-[#0d0d0d] text-white border-t border-white/10" id="footer">
      <div className="footer-container  max-w-6xl mx-auto px-6 py-10">
        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="footer-logo">AzharAli</div>

          <ul className="footer-links hidden md:flex">
  <li><a href="#home">Home</a></li>
  <li><a href="#about">About</a></li>
  <li><a href="#project">Projects</a></li>
  <li><a href="#services">Services</a></li>
  <li><a href="#contact">Contact</a></li>
</ul>



          <div className="footer-social">
            <a href="https://github.com/azhar0i0" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/skibidi-azhar/" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://wa.me/923298892016" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p>&copy; 2025 AzharAli. All Rights Reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
