import React from "react";
import pfp from "../assets/images/pfp.jpg";
import { useState, useEffect } from "react";
import CV from '../assets/CV.pdf'

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const words = ["Web & App Developer", "UI/UX Designer", "Web Enthusiast", "React Developer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  
  useEffect(() => {
    const type = () => {
      const currentWord = words[wordIndex];
      let displayedText = currentWord.substring(0, charIndex);
      setTypedText(displayedText + "<span class='cursor'>|</span>");
  
      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, typingSpeed);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, typingSpeed / 2);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, 1000);
      }
    };
  
    type();
  }, []);

  return (
    <section className="home" id="home">
      <p className="home-p">
        <span className="home-s">● </span>Available for freelance work
      </p>
      <div className="home-container">
        <div className="home-section">
          <div className="info-home">
            <h1 className="fw-bold">Hi, I'm Azhar Ali</h1>
            <h3
              className="typing-text"
              dangerouslySetInnerHTML={{ __html: typedText }}
            ></h3>
            <div className="info-p">
              <p>
                I create beautiful, functional, and user-centered digital
                experiences. 2+ years in <b>Web</b> & <b>App Development</b>, I
                bring ideas to life through clean code and thoughtful design.
              </p>
            </div>
            <div className="info-p2">
              <p>
                <i className="fa-solid fa-location-dot"></i> Based in Pakistan
              </p>
              <p>
                <i className="fa-solid fa-briefcase"></i> Available Now
              </p>
            </div>
            <div className="btnn">
              <a href="#contact" className="btn-home1">
                <i className="fa-solid fa-arrow-right"></i> Hire Me
              </a>

              <a
                href={CV}
                download="Azhar_Ali_CV.pdf"
                className="btn-home2"
              >
                <i className="fa-solid fa-download"></i> Download CV
              </a>
            </div>
            <hr />
            <div className="follow">
              <p className="followw">Follow me:</p>
              <ul>
                <li>
                  <a href="https://github.com/azhar0i0/">
                    <i className="fa-brands fa-github"></i>
                  </a>
                </li>
                <li>
                  <a href="https://discord.com/channels/@skibidi.azhar">
                    <i className="fa-brands fa-discord"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/skibidi-azhar/">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/skibidi.azhar/">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="img-wrap">
          <img src={pfp} alt="Profile" />
        </div>
      </div>
    </section>
  );
}
