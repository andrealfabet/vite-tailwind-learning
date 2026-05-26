// ─────────────────────────────────────────────────────────────────
//  cv.ts — Single source of truth for all CV / portfolio content.
//  Edit this file to update both the website AND the generated PDF.
// ─────────────────────────────────────────────────────────────────

export const personalInfo = {
  name: "Andreas Wenra Alfa Septiaji",
  title: "Software Developer",
  location: "Bandung, Indonesia",
  email: "andreaswenra@gmail.com",
  phone: "+6282216278089",
  linkedin: "linkedin.com/in/andreaswenra",
  summary:
    "Software developer with 13+ years of experience building enterprise web applications and government digital platforms. Skilled in .NET ecosystems, CMS technologies, and modern web frameworks — driven by a passion for problem-solving and delivering reliable, high-impact software.",
};

export const skillGroups = [
  {
    category: "Languages",
    badge: "Core" as const,
    icon: "💻",
    items: ["C#", "VB.NET", "JavaScript", "PHP", "Python"],
  },
  {
    category: ".NET Stack",
    badge: "Core" as const,
    icon: "⚙️",
    items: [".NET Framework", ".NET Core", "ASP.NET", "DevExpress"],
  },
  {
    category: "Web Frameworks",
    badge: "Core" as const,
    icon: "🌐",
    items: ["Node.js", "Next.js", "Django"],
  },
  {
    category: "CMS Platforms",
    badge: "Pro" as const,
    icon: "🖥️",
    items: ["Sitecore", "Sitefinity", "Directus (VISOR)"],
  },
  {
    category: "Databases",
    badge: "Core" as const,
    icon: "🗄️",
    items: ["Oracle", "SQL Server", "PostgreSQL"],
  },
  {
    category: "Cloud & Tools",
    badge: "Pro" as const,
    icon: "☁️",
    items: ["AWS", "Git", "VS Code"],
  },
];

export const experiences = [
  {
    company: "Xtremax Pte. Ltd",
    role: "Software Developer II",
    period: "November 2025 – Present",
    bullets: [
      "Developed and maintained Singapore Government websites (YRSG, PSD Challenges, PSD PSC).",
      "Implemented web enhancements and ensured platform stability through continuous maintenance.",
      "Executed migration from Sitecore CMS to Directus Visor using Next.js.",
      "Configured and managed application environments leveraging AWS services.",
    ],
    tech: ["Next.js", "Directus", "Sitecore", "AWS", "C#"],
  },
  {
    company: "Xtremax Pte. Ltd",
    role: "Software Developer I",
    period: "August 2023 – November 2025",
    bullets: [
      "Developed and maintained Singapore Government websites (SPS, YRSG, PSD Corp, PSD Careers, PSD Challenges, Tote Board, PSC).",
      "Implemented web enhancements and ensured platform stability through continuous maintenance.",
      "Contributed to Sitefinity platform upgrades, ensuring compatibility and smooth migration.",
      "Helped optimize website performance, contributing to winning a DSA award.",
    ],
    tech: ["Sitefinity", ".NET Core", "C#", "SQL Server", "JavaScript"],
  },
  {
    company: "Xtremax Pte. Ltd",
    role: "Associate Software Developer",
    period: "June 2020 – August 2023",
    bullets: [
      "Contributed to development and ongoing maintenance of Singapore Government digital platforms.",
      "Implemented web enhancements and ensured platform stability through continuous maintenance.",
      "Participated in Sitefinity CMS platform upgrades ensuring compatibility and smooth migration.",
    ],
    tech: ["Sitecore", "Sitefinity", "C#", ".NET Core", "JavaScript"],
  },
  {
    company: "PT Triklin – Rekatama",
    role: "Software Developer",
    period: "July 2013 – June 2020",
    bullets: [
      "Built and maintained IPROCURA, a procurement web application for PELINDO and Lintas Arta.",
      "Delivered transaction management, approval workflows, and rich reporting using .NET Framework, C#, and Oracle with DevExpress.",
    ],
    tech: [".NET Framework", "C#", "Oracle", "DevExpress", "ASP.NET"],
  },
  {
    company: "PT Insan Infonesia",
    role: "Software Developer",
    period: "June 2012 – July 2013",
    bullets: [
      "Built and maintained MYCOINS, a billing and finance reporting web application for PT Telkom Indonesia, using PHP and Oracle.",
      "Built and maintained SIKM, a savings and loan web application for Bank BUKOPIN, using VB.NET and Oracle.",
      "Built a digital library web application using Python, Medusa, and Django.",
      "Built an ID-Cert website application using Python and Django.",
    ],
    tech: ["PHP", "VB.NET", "Python", "Django", "Oracle"],
  },
];

export const education = {
  degree: "Bachelor of Applied Science in Computer and Informatics Engineering",
  institution: "Politeknik Negeri Bandung",
  period: "2009 – 2013",
};
