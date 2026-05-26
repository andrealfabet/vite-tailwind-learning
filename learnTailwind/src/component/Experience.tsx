const experiences = [
  {
    company: "Xtremax Pte. Ltd",
    role: "Software Developer II",
    period: "November 2025 – Present",
    description:
      "Leading development and maintenance of Singapore Government websites (YRSG, PSD Challenges, PSD PSC). Spearheaded a full CMS migration from Sitecore to Directus Visor using Next.js, and manage cloud application environments on AWS.",
    tech: ["Next.js", "Directus", "Sitecore", "AWS", "C#"],
  },
  {
    company: "Xtremax Pte. Ltd",
    role: "Software Developer I",
    period: "August 2023 – November 2025",
    description:
      "Developed and maintained high-profile Singapore Government websites (SPS, YRSG, PSD Corp, PSD Careers, PSD Challenges, Tote Board, PSC). Helped optimize website performance that contributed to winning a DSA award.",
    tech: ["Sitefinity", ".NET Core", "C#", "SQL Server", "JavaScript"],
  },
  {
    company: "Xtremax Pte. Ltd",
    role: "Associate Software Developer",
    period: "June 2020 – August 2023",
    description:
      "Contributed to development and ongoing maintenance of Singapore Government digital platforms. Implemented web enhancements, ensured platform stability, and participated in Sitefinity CMS upgrades ensuring compatibility and smooth migration.",
    tech: ["Sitecore", "Sitefinity", "C#", ".NET Core", "JavaScript"],
  },
  {
    company: "PT Triklin – Rekatama",
    role: "Software Developer",
    period: "July 2013 – June 2020",
    description:
      "Built and maintained IPROCURA, a procurement web application for PELINDO and Lintas Arta. Delivered transaction management, approval workflows, and rich reporting features using .NET Framework, C#, and Oracle with DevExpress.",
    tech: [".NET Framework", "C#", "Oracle", "DevExpress", "ASP.NET"],
  },
  {
    company: "PT Insan Infonesia",
    role: "Software Developer",
    period: "June 2012 – July 2013",
    description:
      "Delivered multiple web applications: a billing & finance reporting system (MYCOINS) for PT Telkom Indonesia, a savings & loan system (SIKM) for Bank BUKOPIN, a digital library, and the ID-Cert website — using PHP, VB.NET, Python, and Django.",
    tech: ["PHP", "VB.NET", "Python", "Django", "Oracle"],
  },
];

function Experience() {
  return (
    <section id="experience" className="py-24 bg-amber-50 dark:bg-black px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-widest">
            Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white">
            Where I've worked
          </h2>
          <p className="text-stone-500 dark:text-gray-400 text-center">
            Over 13 years of professional experience across government digital platforms,
            enterprise applications, and software consultancy.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-950 rounded-2xl p-8 border border-stone-200 dark:border-white/10 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">{exp.role}</h3>
                  <p className="text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                    {exp.company}
                  </p>
                </div>
                <span className="self-start text-sm text-stone-500 dark:text-gray-500 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 px-4 py-1.5 rounded-full whitespace-nowrap">
                  {exp.period}
                </span>
              </div>

              <p className="text-stone-600 dark:text-gray-400 leading-relaxed mb-5">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
