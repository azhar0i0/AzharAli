import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import GitProjects from "./components/GitProjects";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";
import Marquee from "./components/Marquee";

function App() {
  const location = useLocation(); // current route

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });

    const navLinks = document.querySelectorAll(".ul-list li a");
    const sections = document.querySelectorAll("section");

    function removeActive() {
      navLinks.forEach((link) => link.parentElement.classList.remove("active"));
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80, // header height offset
            behavior: "smooth",
          });
        }

        removeActive();
        link.parentElement.classList.add("active");
      });
    });

    // Reveal animations for your theme
    const revealElements = document.querySelectorAll(
      ".home-container, .about-container, .projects-container, .services-container, .contact-content"
    );
    revealElements.forEach((el) => el.classList.add("reveal"));

    // Back to top button
    let backToTop = document.getElementById("back-to-top");
    if (!backToTop) {
      backToTop = document.createElement("div");
      backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
      backToTop.id = "back-to-top";
      document.body.appendChild(backToTop);
      backToTop.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 40px;
        background: #1D3269;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: transform 0.3s ease;
      `;

      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      backToTop.addEventListener("mouseover", () => (backToTop.style.transform = "scale(1.2)"));
      backToTop.addEventListener("mouseout", () => (backToTop.style.transform = "scale(1)"));
    }

    // Update active navbar link on scroll
    const updateActiveLink = () => {
      const headerOffset = 80; // height of fixed navbar
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const link = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          removeActive();
          if (link) link.parentElement.classList.add("active");
        }
      });

      // Show/hide back to top
      backToTop.style.display = window.scrollY > 500 ? "flex" : "none";

      // Reveal elements on scroll
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (elementTop < windowHeight - revealPoint) el.classList.add("active-reveal");
      });
    };

    window.addEventListener("scroll", updateActiveLink);

    // Clean up
    return () => {
      window.removeEventListener("scroll", updateActiveLink);
    };
  }, [location.pathname]); // run on route change

  // Show Navbar only if not on GitProjects page
  const showNavbar = location.pathname !== "/GitProjects";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Marquee />
              <About />
              <Projects />
              <Services />
              <Contact />
            </>
          }
        />
        <Route path="/GitProjects" element={<GitProjects />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
