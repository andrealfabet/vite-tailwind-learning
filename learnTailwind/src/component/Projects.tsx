const projects = [
  {
    badge: "Government",
    title: "Singapore Government Websites",
    description:
      "Developed and maintained multiple Singapore Government digital platforms — YRSG, PSD Corp, PSD Careers, PSD Challenges, Tote Board, and PSC — using enterprise CMS technologies and modern web frameworks.",
    tech: ["Next.js", "Sitecore", "Sitefinity", "C#", "SQL Server"],
  },
  {
    badge: "Migration",
    title: "CMS Migration: Sitecore \u2192 Directus",
    description:
      "Led end-to-end migration of a Singapore Government website from Sitecore CMS to Directus Visor, rebuilding the frontend with Next.js and configuring cloud environments on AWS.",
    tech: ["Next.js", "Directus", "Sitecore", "AWS"],
  },
  {
    badge: "Enterprise",
    title: "IPROCURA \u2013 Procurement System",
    description:
      "Built and maintained a procurement web application for PELINDO and Lintas Arta, featuring transaction management, approval workflows, and rich reporting with DevExpress.",
    tech: [".NET Framework", "C#", "Oracle", "DevExpress", "ASP.NET"],
  },
  {
    badge: "Finance",
    title: "MYCOINS \u2013 Billing & Finance",
    description:
      "Developed and maintained a billing and finance reporting web application for PT Telkom Indonesia, handling large-scale financial data and automated report generation.",
    tech: ["PHP", "Oracle"],
  },
  {
    badge: "Banking",
    title: "SIKM \u2013 Savings & Loan System",
    description:
      "Built a savings and loan management web application for Bank BUKOPIN, supporting core banking operations including account management and transaction processing.",
    tech: ["VB.NET", "Oracle"],
  },
  {
    badge: "Web App",
    title: "Digital Library & ID-Cert",
    description:
      "Built a digital library web application using Python, Medusa, and Django, along with an ID-Cert website \u2014 full-stack Python projects covering content management and identity certification.",
    tech: ["Python", "Django", "Medusa"],
  },
];

const badgeColors: Record<string, string> = {
  Government: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  Migration: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Enterprise: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  Finance: "bg-green-500/10 border-green-500/20 text-green-400",
  Banking: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  "Web App": "bg-pink-500/10 border-pink-500/20 text-pink-400",
};

function Projects() {
  return (
    <section id="projects" className="py-24 bg-orange-50 dark:bg-gray-950 px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-widest">
            Projects
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white">
            Things I've built
          </h2>
          <p className="text-stone-500 dark:text-gray-400 text-center">
            A selection of real-world projects delivered across government, banking, finance,
            and enterprise sectors over 13+ years.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-black rounded-2xl p-6 border border-stone-200 dark:border-white/10 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col"
            >
              {/* Top row: badge only */}
              <div className="flex items-start justify-between mb-5">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    badgeColors[project.badge] ??
                    "bg-gray-500/10 border-gray-500/20 text-gray-400"
                  }`}
                >
                  {project.badge}
                </span>
                <span className="text-xs text-stone-400 dark:text-gray-600 italic">Enterprise</span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-stone-500 dark:text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-500 dark:text-gray-400 rounded-md text-xs"
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

export default Projects;
