// src/components/Projects.jsx
import React from "react";
import { motion } from "framer-motion";
import zarvean from "../assets/images/zarvean.png";
import portfolio from "../assets/images/portfolio.png";
import ManagementSystem from "../assets/images/ManagementSystem.png";
import { Link } from "react-router-dom";

const grid = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Website",
      desc: "Modern online store with product filtering, cart, and payment system.",
      img: zarvean,
      link: "https://zarvean.vercel.app",
    },
    {
      title: "Portfolio Website",
      desc: "Personal portfolio to showcase design and code.",
      img: portfolio,
      link: "https://azharali.vercel.app",
    },
    {
      title: "ManagementSystem",
      desc: "Shop Buddy - Payment Manager App to track expenses and income.",
      img: ManagementSystem,
      link: "https://shop-payment-manager-03.vercel.app/",
    },
  ];

  return (
    <section id="project" className="project py-5 bg-white">
      <div className="container text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.p className="text-primary fw-bold mb-1">PROJECTS</motion.p>
          <motion.h2 className="fw-bold mb-2">Featured Work</motion.h2>
          <motion.hr
            className="mx-auto mb-3"
            style={{ borderColor: "#e6e6e6", width: "60px" }}
          />
          <motion.p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            A showcase of my projects demonstrating expertise in full-stack
            development, modern frameworks, and creative problem-solving.
          </motion.p>
        </motion.div>

        <motion.div
          className="projects-container row g-4 mt-4"
          variants={grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((p, i) => (
            <motion.div key={i} className="col-md-6 col-lg-4" variants={card}>
              <motion.div
                className="project-card"
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ cursor: p.link ? "pointer" : "default" }}
                onClick={() => p.link && window.open(p.link, "_blank")}
              >
                <img src={p.img} alt={p.title} className="project-img" />
                <div className="project-info">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Projects Button */}
        <div className="mt-5">
          <Link to="/GitProjects" className="btn btn-dark px-4 py-2 rounded-pill fw-semibold">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}