const projects = [
  {
    badge: "Full Stack",
    title: "E-Commerce Platform",
    description:
      "Full-featured online store with cart, auth, payment integration via Stripe, and a real-time admin dashboard.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    github: "https://github.com",
    live: "#",
  },
  {
    badge: "Frontend",
    title: "Design System Dashboard",
    description:
      "Comprehensive design system manager with token management, component documentation, and team collaboration.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com",
    live: "#",
  },
  {
    badge: "Full Stack",
    title: "Task Management App",
    description:
      "Kanban-style project management tool with drag-and-drop, real-time updates via WebSockets, and team roles.",
    tech: ["React", "Socket.io", "MongoDB", "Express"],
    github: "https://github.com",
    live: "#",
  },
  {
    badge: "Open Source",
    title: "React Component Library",
    description:
      "Collection of accessible, customizable UI components with full TypeScript support and Storybook documentation.",
    tech: ["React", "TypeScript", "Storybook"],
    github: "https://github.com",
    live: "#",
  },
  {
    badge: "Mobile",
    title: "Fitness Tracker App",
    description:
      "Cross-platform mobile app for tracking workouts, setting goals, and monitoring health metrics with charts.",
    tech: ["React Native", "Expo", "Firebase"],
    github: "https://github.com",
    live: "#",
  },
  {
    badge: "Backend",
    title: "REST API Boilerplate",
    description:
      "Production-ready Node.js API starter with JWT auth, rate limiting, structured logging, and automated tests.",
    tech: ["Node.js", "Express", "PostgreSQL", "Jest"],
    github: "https://github.com",
    live: "#",
  },
];

const badgeColors: Record<string, string> = {
  "Full Stack": "bg-teal-500/10 border-teal-500/20 text-teal-400",
  Frontend: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  "Open Source": "bg-purple-500/10 border-purple-500/20 text-purple-400",
  Mobile: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  Backend: "bg-green-500/10 border-green-500/20 text-green-400",
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
            A selection of projects I'm proud of. Each one solved a real
            problem and taught me something new.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-black rounded-2xl p-6 border border-stone-200 dark:border-white/10 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 flex flex-col"
            >
              {/* Top row: badge + links */}
              <div className="flex items-start justify-between mb-5">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    badgeColors[project.badge] ??
                    "bg-gray-500/10 border-gray-500/20 text-gray-400"
                  }`}
                >
                  {project.badge}
                </span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-500 dark:text-gray-500 hover:text-stone-900 dark:hover:text-white transition-colors text-sm"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-500 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm"
                  >
                    Live ↗
                  </a>
                </div>
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
