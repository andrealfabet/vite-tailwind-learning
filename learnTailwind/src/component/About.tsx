const skillGroups = [
  {
    category: "Languages",
    badge: "Core",
    icon: "💻",
    items: ["C#", "VB.NET", "JavaScript", "PHP", "Python"],
  },
  {
    category: ".NET Stack",
    badge: "Core",
    icon: "⚙️",
    items: [".NET Framework", ".NET Core", "ASP.NET", "DevExpress"],
  },
  {
    category: "Web Frameworks",
    badge: "Core",
    icon: "🌐",
    items: ["Node.js", "Next.js", "Django"],
  },
  {
    category: "CMS Platforms",
    badge: "Pro",
    icon: "🖥️",
    items: ["Sitecore", "Sitefinity", "Directus (VISOR)"],
  },
  {
    category: "Databases",
    badge: "Core",
    icon: "🗄️",
    items: ["Oracle", "SQL Server", "PostgreSQL"],
  },
  {
    category: "Cloud & Tools",
    badge: "Pro",
    icon: "☁️",
    items: ["AWS", "Git", "VS Code"],
  },
];

const badgeStyle: Record<string, string> = {
  Core: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  Pro: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

function About() {
  return (
    <section id="about" className="py-24 bg-orange-50 dark:bg-gray-950 px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-teal-600 dark:text-teal-400 text-sm font-semibold uppercase tracking-widest">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white leading-tight">
            Technologies I've worked with
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
            From enterprise .NET applications to government CMS platforms — a broad range of
            expertise refined over 13+ years of professional software development.
          </p>
        </div>

        {/* Skills grid – 3 columns like Figma features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="bg-white dark:bg-black rounded-2xl p-6 border border-stone-200 dark:border-white/10 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 group"
            >
              {/* Icon + Badge row */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{group.icon}</span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeStyle[group.badge]}`}
                >
                  {group.badge}
                </span>
              </div>

              <h3 className="text-stone-900 dark:text-white font-bold text-lg mb-3">
                {group.category}
              </h3>

              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-gray-400 rounded-md text-xs group-hover:border-teal-500/20 transition-colors"
                  >
                    {skill}
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

export default About;
