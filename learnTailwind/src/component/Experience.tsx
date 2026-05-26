import { experiences } from "../data/cv";


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

              <ul className="mb-5 space-y-1.5 list-none">
                {exp.bullets.map((bullet, j) => (
                  <li key={j} className="flex gap-2 text-stone-600 dark:text-gray-400 leading-relaxed text-sm">
                    <span className="text-teal-500 mt-0.5 shrink-0">›</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

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
