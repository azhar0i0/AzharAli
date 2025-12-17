// src/components/About.jsx
import React from "react";
import { motion } from "framer-motion";
import aboutImg from "../assets/images/img.jpg";

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
};
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function About() {
  return (
    <section className="about-section py-5" id="about">
      <motion.div
        className="container"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p
          className="section-tag text-uppercase fw-bold text-primary mb-1"
          variants={item}
        >
          About Me
        </motion.p>

        <motion.div
          className="row align-items-center mt-4 gy-4"
          variants={container}
        >
          {/* Left Side */}
          <motion.div className="col-lg-6" variants={item}>
            <motion.h2 className="display-6 fw-semibold mb-3" variants={item}>
              Building Meaningful <br /> Digital Experiences
            </motion.h2>
            <motion.hr className="custom-hr mb-4" variants={item} />

            <motion.p className="about-text lead" variants={item}>
              I'm a creative full-stack developer passionate about building
              modern and responsive web & app experiences. My journey began with
              a love for design and evolved into a deep curiosity for how the
              web works — combining logic with creativity to bring ideas to
              life.
            </motion.p>

            <motion.p className="about-text" variants={item}>
              When I'm not coding, I enjoy learning new technologies, improving
              my projects, and exploring better ways to make the web faster and
              more engaging.
            </motion.p>

            <motion.h4 className="fw-bold mt-4" variants={item}>
              What Drives Me
            </motion.h4>

            <motion.div
              className="row g-3 mt-3"
              variants={item}
            >
              <motion.div
                className="col-md-6 col-lg-4"
                whileHover={{ scale: 1.03, y: -6 }}
              >
                <div className="info-card h-100">
                  <h5 className="fw-semibold mb-2">
                    <i className="fa-solid fa-code me-2 text-primary"></i>
                    Languages
                  </h5>
                  <p className="mb-0 small text-muted">
                    HTML, CSS, JavaScript, C++, C, React, Vite, Node, React Native
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="col-md-6 col-lg-4"
                whileHover={{ scale: 1.03, y: -6 }}
              >
                <div className="info-card h-100">
                  <h5 className="fw-semibold mb-2">
                    <i className="fa-solid fa-graduation-cap me-2 text-primary"></i>
                    Education
                  </h5>
                  <p className="mb-0 small text-muted">
                    Pursuing CyberSecurity — Batch 2024
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="col-md-6 col-lg-4"
                whileHover={{ scale: 1.03, y: -6 }}
              >
                <div className="info-card h-100">
                  <h5 className="fw-semibold mb-2">
                    <i className="fa-solid fa-folder-open me-2 text-primary"></i>
                    Projects
                  </h5>
                  <p className="mb-0 small text-muted">
                    Built numerous real-world apps across web & mobile
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            className="col-lg-6 text-center"
            variants={item}
          >
            <img
              src={aboutImg}
              alt="About me"
              className="img-fluid about-img shadow rounded"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
