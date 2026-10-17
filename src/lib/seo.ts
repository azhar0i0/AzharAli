// Single source of truth for search/social metadata. The canonical host is
// www (the apex domain 308-redirects there), so every absolute URL uses it.
export const SITE_URL = "https://www.azharali.site";

export const SEO = {
  title: "Azhar Ali – Freelance Full-Stack Developer (React, Next.js)",
  description:
    "Azhar Ali is a freelance full-stack developer in Bahawalpur, Pakistan, building fast React, Next.js and Node.js web apps, SaaS and e-commerce. Let's talk.",
  ogTitle: "Azhar Ali – Full-Stack Developer · React, Next.js & Node.js",
  ogDescription:
    "Explore my work in an interactive desktop-OS portfolio: projects, services, skills and resume. Open to freelance web and app development.",
  image: `${SITE_URL}/og-image.jpg`,
  imageAlt: "AzharOS — Azhar Ali's interactive desktop-style developer portfolio",
};

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Person + WebSite + ProfilePage graph. Everything here mirrors content that's
// visible on the page — keep it in sync when the profile or links change.
export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Azhar Ali",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/icon-512.png`,
      jobTitle: "Full-Stack Developer",
      description:
        "Freelance full-stack developer building web and mobile products with React, Next.js and Node.js.",
      email: "mailto:azharisworking@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bahawalpur",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Express",
        "Tailwind CSS",
        "React Native",
        "WordPress",
        "MongoDB",
        "PostgreSQL",
        "Web development",
        "Technical SEO",
      ],
      sameAs: ["https://github.com/azhar0i0", "https://www.linkedin.com/in/skibidi-azhar"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: "Azhar Ali",
      alternateName: ["AzharOS", "azharali.site"],
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: `${SITE_URL}/`,
      name: SEO.title,
      description: SEO.description,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: SEO.image, width: 1200, height: 675 },
    },
  ],
};
