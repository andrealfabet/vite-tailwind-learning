const skillGroups = [
  {
    category: "Frontend",
    badge: "Core",
    icon: "🖥️",
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js"],
  },
  {
    category: "Backend",
    badge: "Core",
    icon: "⚙️",
    items: ["Node.js", "Express", "Python", "REST API", "GraphQL"],
  },
  {
    category: "Database",
    badge: "Core",
    icon: "🗄️",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma"],
  },
  {
    category: "Cloud & DevOps",
    badge: "Pro",
    icon: "☁️",
    items: ["AWS", "Docker", "CI/CD", "Vercel", "Nginx"],
  },
  {
    category: "Design & Tools",
    badge: "Core",
    icon: "🎨",
    items: ["Figma", "Git", "VS Code", "Postman", "Jira"],
  },
  {
    category: "Testing",
    badge: "Pro",
    icon: "🧪",
    items: ["Jest", "Vitest", "Cypress", "RTL", "Playwright"],
  },
];

const badgeStyle: Record<string, string> = {
  Core: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  Pro: "bg-purple-500/10 border-purple-500/20 text-purple-400",
};

function About() {
  return (
    <section id="about" className="py-24 bg-gray-950 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-teal-400 text-sm font-semibold uppercase tracking-widest">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Everything you need in a developer
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From pixel-perfect UIs to scalable APIs, I bring ideas to life
            with clean code, thoughtful architecture, and a passion for great
            user experiences.
          </p>
        </div>

        {/* Skills grid – 3 columns like Figma features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="bg-black rounded-2xl p-6 border border-white/10 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 group"
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

              <h3 className="text-white font-bold text-lg mb-3">
                {group.category}
              </h3>

              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-md text-xs group-hover:border-teal-500/20 transition-colors"
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
