import React from "react";
import { FaCode } from "react-icons/fa6"; // Or any icon you prefer
import "./styles/Marquee.css";

const Marquee = () => {
  const skills = [
    "Web & App Developer",
    "UI/UX Designer",
    "Web Enthusiast",
    "React Developer",
  ];

  return (
    <div className="marquee-container">
      {/* The Gradient overlay for fade effect is handled in CSS mask-image */}
      
      <div className="marquee-wrapper">
        {/* Render the group twice to create the seamless infinite loop */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="marquee-content">
            {skills.map((item, index) => (
              <div key={index} className="marquee-item">
                <span className="marquee-text">{item}</span>
                <span className="marquee-icon">
                  <FaCode />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;